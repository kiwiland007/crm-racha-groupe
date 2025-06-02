import jsPDF from "jspdf";
import { toast } from "sonner";

// Configuration de l'entreprise
const COMPANY_CONFIG = {
  name: "Racha Business Group",
  legalForm: "SARL AU",
  address: "Casablanca, Maroc",
  phone: "+212 6 69 38 28 28",
  email: "contact@rachabusiness.com",
  website: "www.rachabusiness.com",
  rc: "123456",
  patente: "78901234",
  if: "56789012",
  ice: "002345678901234",
  cnss: "9876543",
  capital: "100 000,00 MAD"
};

// Interface pour les données de fiche technique
export interface TechnicalSheetData {
  id: string;
  name: string;
  brand?: string;
  model?: string;
  category: string;
  description: string;
  price?: {
    sale: string | number;
    rental: string | number;
  };
  technicalSpecs?: string;
  specifications?: {
    dimensions?: string;
    weight?: string;
    power?: string;
    connectivity?: string;
    display?: string;
    processor?: string;
    memory?: string;
    storage?: string;
    os?: string;
  };
  features?: string[];
  maintenanceNotes?: string;
  warranty?: string;
  availability?: string;
  sku?: string;
}

/**
 * Service spécialisé pour la génération de fiches techniques PDF
 */
class TechnicalSheetPDFService {
  private doc!: jsPDF;

  /**
   * Génère une fiche technique PDF professionnelle
   */
  public generateTechnicalSheetPDF(data: TechnicalSheetData): string | null {
    try {
      console.log("=== GÉNÉRATION FICHE TECHNIQUE PDF ===");
      console.log("Données reçues:", data);

      // Validation des données essentielles
      if (!data || !data.name) {
        console.error("Données manquantes pour la génération PDF");
        toast.error("Données manquantes", {
          description: "Nom du produit requis pour générer la fiche technique"
        });
        return null;
      }

      // Initialisation du document PDF
      this.doc = new jsPDF();
      console.log("Document PDF initialisé");

      // En-tête avec logo
      this.addHeader();
      console.log("En-tête ajouté");

      // Titre de la fiche technique
      let yPos = 60;
      yPos = this.addTitle(data, yPos);
      console.log("Titre ajouté, yPos:", yPos);

      // Informations générales
      yPos = this.addGeneralInfo(data, yPos);
      console.log("Infos générales ajoutées, yPos:", yPos);

      // Spécifications techniques
      yPos = this.addTechnicalSpecs(data, yPos);
      console.log("Spécifications techniques ajoutées, yPos:", yPos);

      // Caractéristiques et fonctionnalités
      yPos = this.addFeatures(data, yPos);
      console.log("Caractéristiques ajoutées, yPos:", yPos);

      // Informations commerciales
      yPos = this.addCommercialInfo(data, yPos);
      console.log("Infos commerciales ajoutées, yPos:", yPos);

      // Footer
      this.addFooter();
      console.log("Footer ajouté");

      // Sauvegarde
      const filename = this.generateFilename(data);
      console.log("Nom de fichier généré:", filename);

      this.doc.save(filename);
      console.log("Fichier sauvegardé");

      console.log("=== FICHE TECHNIQUE PDF GÉNÉRÉE AVEC SUCCÈS ===");

      toast.success("Fiche technique générée", {
        description: `Fichier ${filename} téléchargé`
      });

      return filename;
    } catch (error) {
      console.error("❌ ERREUR DÉTAILLÉE génération fiche technique PDF:", error);
      console.error("Stack trace:", error instanceof Error ? error.stack : 'Pas de stack trace');

      toast.error("Erreur génération PDF", {
        description: `Impossible de générer la fiche technique: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      });
      return null;
    }
  }

  private addHeader(): void {
    // Logo et informations entreprise
    this.doc.setFillColor(26, 43, 60);
    this.doc.rect(0, 0, 210, 40, 'F');

    // Nom de l'entreprise
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(20);
    this.doc.setFont(undefined, 'bold');
    this.doc.text(COMPANY_CONFIG.name, 20, 20);

    // Sous-titre
    this.doc.setFontSize(12);
    this.doc.setFont(undefined, 'normal');
    this.doc.text("Solutions Tactiles & Digitales", 20, 28);

    // Contact
    this.doc.setFontSize(10);
    this.doc.text(`${COMPANY_CONFIG.phone} | ${COMPANY_CONFIG.email}`, 20, 35);

    // Type de document
    this.doc.setFontSize(14);
    this.doc.setFont(undefined, 'bold');
    this.doc.text("FICHE TECHNIQUE", 150, 25);
  }

  private addTitle(data: TechnicalSheetData, yPos: number): number {
    try {
      // Titre principal
      this.doc.setTextColor(0, 0, 0);
      this.doc.setFontSize(18);
      this.doc.setFont(undefined, 'bold');
      this.doc.text(String(data.name || 'Produit'), 20, yPos);
      yPos += 10;

      // Sous-titre avec marque et modèle
      if (data.brand || data.model) {
        this.doc.setFontSize(12);
        this.doc.setFont(undefined, 'normal');
        this.doc.setTextColor(100, 100, 100);
        const subtitle = `${data.brand || ''} ${data.model || ''}`.trim();
        if (subtitle) {
          this.doc.text(subtitle, 20, yPos);
          yPos += 8;
        }
      }

      // Ligne de séparation
      this.doc.setDrawColor(200, 200, 200);
      this.doc.setLineWidth(0.5);
      this.doc.line(20, yPos, 190, yPos);
      yPos += 15;

      return yPos;
    } catch (error) {
      console.error("Erreur addTitle:", error);
      return yPos + 25; // Retourner une position sûre
    }
  }

  private addGeneralInfo(data: TechnicalSheetData, yPos: number): number {
    try {
      // Section informations générales
      this.doc.setFillColor(245, 245, 245);
      this.doc.rect(20, yPos - 5, 170, 8, 'F');

      this.doc.setTextColor(0, 0, 0);
      this.doc.setFontSize(12);
      this.doc.setFont(undefined, 'bold');
      this.doc.text("INFORMATIONS GÉNÉRALES", 22, yPos);
      yPos += 15;

      // Référence et catégorie
      this.doc.setFontSize(10);
      this.doc.setFont(undefined, 'normal');

      if (data.sku) {
        this.doc.setFont(undefined, 'bold');
        this.doc.text("Référence:", 22, yPos);
        this.doc.setFont(undefined, 'normal');
        this.doc.text(String(data.sku), 60, yPos);
        yPos += 6;
      }

      this.doc.setFont(undefined, 'bold');
      this.doc.text("Catégorie:", 22, yPos);
      this.doc.setFont(undefined, 'normal');
      this.doc.text(String(data.category || 'Non catégorisé'), 60, yPos);
      yPos += 6;

      if (data.availability) {
        this.doc.setFont(undefined, 'bold');
        this.doc.text("Disponibilité:", 22, yPos);
        this.doc.setFont(undefined, 'normal');
        const availabilityText = data.availability === 'en_stock' ? 'En stock' :
                                data.availability === 'sur_commande' ? 'Sur commande' :
                                String(data.availability);
        this.doc.text(availabilityText, 60, yPos);
        yPos += 6;
      }

      // Description
      if (data.description && data.description.trim()) {
        yPos += 5;
        this.doc.setFont(undefined, 'bold');
        this.doc.text("Description:", 22, yPos);
        yPos += 6;

        this.doc.setFont(undefined, 'normal');
        const lines = this.doc.splitTextToSize(String(data.description), 160);
        this.doc.text(lines, 22, yPos);
        yPos += lines.length * 5 + 10;
      }

      return yPos;
    } catch (error) {
      console.error("Erreur addGeneralInfo:", error);
      return yPos + 50; // Retourner une position sûre
    }
  }

  private addTechnicalSpecs(data: TechnicalSheetData, yPos: number): number {
    // Section spécifications techniques
    this.doc.setFillColor(245, 245, 245);
    this.doc.rect(20, yPos - 5, 170, 8, 'F');
    
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(12);
    this.doc.setFont(undefined, 'bold');
    this.doc.text("SPÉCIFICATIONS TECHNIQUES", 22, yPos);
    yPos += 15;

    this.doc.setFontSize(10);

    // Spécifications structurées
    if (data.specifications) {
      const specs = data.specifications;
      
      if (specs.dimensions) {
        this.addSpecLine("Dimensions:", specs.dimensions, 22, yPos);
        yPos += 6;
      }
      if (specs.weight) {
        this.addSpecLine("Poids:", specs.weight, 22, yPos);
        yPos += 6;
      }
      if (specs.display) {
        this.addSpecLine("Écran:", specs.display, 22, yPos);
        yPos += 6;
      }
      if (specs.processor) {
        this.addSpecLine("Processeur:", specs.processor, 22, yPos);
        yPos += 6;
      }
      if (specs.memory) {
        this.addSpecLine("Mémoire:", specs.memory, 22, yPos);
        yPos += 6;
      }
      if (specs.storage) {
        this.addSpecLine("Stockage:", specs.storage, 22, yPos);
        yPos += 6;
      }
      if (specs.connectivity) {
        this.addSpecLine("Connectivité:", specs.connectivity, 22, yPos);
        yPos += 6;
      }
      if (specs.power) {
        this.addSpecLine("Alimentation:", specs.power, 22, yPos);
        yPos += 6;
      }
      if (specs.os) {
        this.addSpecLine("Système:", specs.os, 22, yPos);
        yPos += 6;
      }
    }

    // Spécifications texte libre
    if (data.technicalSpecs) {
      yPos += 5;
      this.doc.setFont(undefined, 'normal');
      const lines = this.doc.splitTextToSize(data.technicalSpecs, 160);
      this.doc.text(lines, 22, yPos);
      yPos += lines.length * 5 + 10;
    }

    return yPos;
  }

  private addSpecLine(label: string, value: string, x: number, y: number): void {
    this.doc.setFont(undefined, 'bold');
    this.doc.text(label, x, y);
    this.doc.setFont(undefined, 'normal');
    this.doc.text(value, x + 35, y);
  }

  private addFeatures(data: TechnicalSheetData, yPos: number): number {
    if (!data.features || data.features.length === 0) return yPos;

    // Section caractéristiques
    this.doc.setFillColor(245, 245, 245);
    this.doc.rect(20, yPos - 5, 170, 8, 'F');
    
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(12);
    this.doc.setFont(undefined, 'bold');
    this.doc.text("CARACTÉRISTIQUES", 22, yPos);
    yPos += 15;

    this.doc.setFontSize(10);
    this.doc.setFont(undefined, 'normal');

    data.features.forEach(feature => {
      this.doc.text("• " + feature, 22, yPos);
      yPos += 6;
    });

    return yPos + 10;
  }

  private addCommercialInfo(data: TechnicalSheetData, yPos: number): number {
    // Section informations commerciales
    this.doc.setFillColor(245, 245, 245);
    this.doc.rect(20, yPos - 5, 170, 8, 'F');
    
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(12);
    this.doc.setFont(undefined, 'bold');
    this.doc.text("INFORMATIONS COMMERCIALES", 22, yPos);
    yPos += 15;

    this.doc.setFontSize(10);

    // Prix
    if (data.price) {
      if (data.price.sale) {
        this.addSpecLine("Prix vente:", `${data.price.sale} MAD`, 22, yPos);
        yPos += 6;
      }
      if (data.price.rental) {
        this.addSpecLine("Prix location:", `${data.price.rental} MAD/jour`, 22, yPos);
        yPos += 6;
      }
    }

    // Garantie
    if (data.warranty) {
      this.addSpecLine("Garantie:", data.warranty, 22, yPos);
      yPos += 6;
    }

    // Notes de maintenance
    if (data.maintenanceNotes) {
      yPos += 5;
      this.doc.setFont(undefined, 'bold');
      this.doc.text("Notes de maintenance:", 22, yPos);
      yPos += 6;
      
      this.doc.setFont(undefined, 'normal');
      const lines = this.doc.splitTextToSize(data.maintenanceNotes, 160);
      this.doc.text(lines, 22, yPos);
      yPos += lines.length * 5;
    }

    return yPos;
  }

  private addFooter(): void {
    const pageHeight = this.doc.internal.pageSize.height;
    const footerY = pageHeight - 20;

    // Ligne de séparation
    this.doc.setDrawColor(200, 200, 200);
    this.doc.setLineWidth(0.5);
    this.doc.line(20, footerY - 5, 190, footerY - 5);

    // Informations footer
    this.doc.setFontSize(8);
    this.doc.setTextColor(100, 100, 100);
    this.doc.setFont(undefined, 'normal');

    const dateFormatted = new Date().toLocaleDateString('fr-FR');
    this.doc.text(
      `Fiche technique générée le ${dateFormatted} - ${COMPANY_CONFIG.name}`,
      105,
      footerY,
      { align: 'center' }
    );

    this.doc.text(
      `${COMPANY_CONFIG.address} | ${COMPANY_CONFIG.phone} | ${COMPANY_CONFIG.email}`,
      105,
      footerY + 5,
      { align: 'center' }
    );
  }

  private generateFilename(data: TechnicalSheetData): string {
    const productName = data.name.replace(/[^a-zA-Z0-9]/g, '_');
    const date = new Date().toISOString().split('T')[0];
    return `Fiche_Technique_${productName}_${date}.pdf`;
  }
}

// Instance singleton
export const technicalSheetPDFService = new TechnicalSheetPDFService();

// Export des types
export type { TechnicalSheetData };
