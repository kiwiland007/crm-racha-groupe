/**
 * Service de numérotation automatique pour documents
 * Gère les séquences pour Devis, BL, Factures
 */

interface DocumentCounter {
  devis: number;
  bonLivraison: number;
  facture: number;
  year: number;
}

class NumerotationService {
  private readonly STORAGE_KEY = 'racha_document_counters';

  /**
   * Récupère les compteurs depuis le localStorage
   */
  private getCounters(): DocumentCounter {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const counters = JSON.parse(stored);
        const currentYear = new Date().getFullYear();
        
        // Reset compteurs si nouvelle année
        if (counters.year !== currentYear) {
          return {
            devis: 0,
            bonLivraison: 0,
            facture: 0,
            year: currentYear
          };
        }
        
        return counters;
      }
    } catch (error) {
      console.warn('Erreur lecture compteurs:', error);
    }

    // Valeurs par défaut
    return {
      devis: 0,
      bonLivraison: 0,
      facture: 0,
      year: new Date().getFullYear()
    };
  }

  /**
   * Sauvegarde les compteurs dans le localStorage
   */
  private saveCounters(counters: DocumentCounter): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(counters));
    } catch (error) {
      console.error('Erreur sauvegarde compteurs:', error);
    }
  }

  /**
   * Génère le prochain numéro de devis
   */
  public generateDevisNumber(): string {
    const counters = this.getCounters();
    counters.devis += 1;
    this.saveCounters(counters);

    const year = counters.year.toString().slice(-2); // 2 derniers chiffres
    const number = counters.devis.toString().padStart(3, '0');
    
    return `DEVIS-${year}-${number}`;
  }

  /**
   * Génère le prochain numéro de bon de livraison
   */
  public generateBLNumber(): string {
    const counters = this.getCounters();
    counters.bonLivraison += 1;
    this.saveCounters(counters);

    const year = counters.year.toString().slice(-2);
    const number = counters.bonLivraison.toString().padStart(3, '0');
    
    return `BL-${year}-${number}`;
  }

  /**
   * Génère le prochain numéro de facture
   */
  public generateFactureNumber(): string {
    const counters = this.getCounters();
    counters.facture += 1;
    this.saveCounters(counters);

    const year = counters.year.toString().slice(-2);
    const number = counters.facture.toString().padStart(3, '0');
    
    return `FACT-${year}-${number}`;
  }

  /**
   * Génère un numéro de BL basé sur un devis
   */
  public generateBLFromDevis(devisNumber: string): string {
    const blNumber = this.generateBLNumber();
    
    // Optionnel: garder une trace de la relation devis -> BL
    try {
      const relations = JSON.parse(localStorage.getItem('racha_devis_bl_relations') || '{}');
      relations[devisNumber] = blNumber;
      localStorage.setItem('racha_devis_bl_relations', JSON.stringify(relations));
    } catch (error) {
      console.warn('Erreur sauvegarde relation devis-BL:', error);
    }
    
    return blNumber;
  }

  /**
   * Génère un numéro de facture basé sur un BL
   */
  public generateFactureFromBL(blNumber: string): string {
    const factureNumber = this.generateFactureNumber();
    
    // Optionnel: garder une trace de la relation BL -> Facture
    try {
      const relations = JSON.parse(localStorage.getItem('racha_bl_facture_relations') || '{}');
      relations[blNumber] = factureNumber;
      localStorage.setItem('racha_bl_facture_relations', JSON.stringify(relations));
    } catch (error) {
      console.warn('Erreur sauvegarde relation BL-facture:', error);
    }
    
    return factureNumber;
  }

  /**
   * Récupère les statistiques de numérotation
   */
  public getStatistics(): DocumentCounter & { 
    totalDocuments: number;
    lastDevis?: string;
    lastBL?: string;
    lastFacture?: string;
  } {
    const counters = this.getCounters();
    const year = counters.year.toString().slice(-2);
    
    return {
      ...counters,
      totalDocuments: counters.devis + counters.bonLivraison + counters.facture,
      lastDevis: counters.devis > 0 ? `DEVIS-${year}-${counters.devis.toString().padStart(3, '0')}` : undefined,
      lastBL: counters.bonLivraison > 0 ? `BL-${year}-${counters.bonLivraison.toString().padStart(3, '0')}` : undefined,
      lastFacture: counters.facture > 0 ? `FACT-${year}-${counters.facture.toString().padStart(3, '0')}` : undefined
    };
  }

  /**
   * Remet à zéro les compteurs (admin uniquement)
   */
  public resetCounters(): void {
    const currentYear = new Date().getFullYear();
    const resetCounters: DocumentCounter = {
      devis: 0,
      bonLivraison: 0,
      facture: 0,
      year: currentYear
    };
    
    this.saveCounters(resetCounters);
    
    // Nettoyer aussi les relations
    localStorage.removeItem('racha_devis_bl_relations');
    localStorage.removeItem('racha_bl_facture_relations');
  }

  /**
   * Vérifie si un numéro existe déjà (pour éviter les doublons)
   */
  public isNumberExists(number: string, type: 'devis' | 'bl' | 'facture'): boolean {
    const counters = this.getCounters();
    const year = counters.year.toString().slice(-2);
    
    const regex = {
      devis: new RegExp(`^DEVIS-${year}-(\\d{3})$`),
      bl: new RegExp(`^BL-${year}-(\\d{3})$`),
      facture: new RegExp(`^FACT-${year}-(\\d{3})$`)
    };
    
    const match = number.match(regex[type]);
    if (!match) return false;
    
    const numberPart = parseInt(match[1], 10);
    
    switch (type) {
      case 'devis':
        return numberPart <= counters.devis;
      case 'bl':
        return numberPart <= counters.bonLivraison;
      case 'facture':
        return numberPart <= counters.facture;
      default:
        return false;
    }
  }
}

// Instance singleton
export const numerotationService = new NumerotationService();
