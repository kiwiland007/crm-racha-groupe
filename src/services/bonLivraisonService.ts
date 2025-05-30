import jsPDF from "jspdf";
import { toast } from "sonner";

// Configuration de l'entreprise pour BL
const COMPANY_CONFIG = {
  name: "Racha Business Group",
  legalForm: "SARL AU",
  address: "Casablanca, Maroc",
  phone: "+212 6 69 38 28 28",
  email: "contact@rachabusiness.com",
  website: "www.rachabusiness.com",
  // Informations légales marocaines
  rc: "123456",
  patente: "78901234",
  if: "56789012",
  ice: "002345678901234",
  cnss: "9876543",
  capital: "100 000,00 MAD"
};

// Types pour les données BL professionnelles
export interface BonLivraisonData {
  id: string;
  devisId?: string; // Référence au devis original
  factureId?: string; // Référence facture si applicable
  commandeId?: string; // Numéro de commande

  // Informations client
  client: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: string;
  clientVille?: string;
  clientCodePostal?: string;
  clientICE?: string; // ICE du client si entreprise

  // Informations livraison
  adresseLivraison?: string; // Si différente de l'adresse client
  villeLivraison?: string;
  codePostalLivraison?: string;
  contactLivraison?: string; // Personne à contacter sur site
  telephoneLivraison?: string;

  // Dates et références
  dateLivraison: string;
  dateCreation: string;
  heurePrevisionnelle?: string;

  // Articles
  items: Array<{
    reference?: string; // Référence produit
    designation: string;
    description?: string;
    quantiteCommandee: number;
    quantiteLivree: number;
    quantiteRestante?: number; // Calculé automatiquement
    unite?: string; // Unité (pcs, kg, m, etc.)
    numeroSerie?: string;
    numeroLot?: string;
    etat: 'neuf' | 'occasion' | 'reconditionne' | 'defectueux';
    observations?: string;
  }>;

  // Livraison
  livreur: string;
  transporteur?: string;
  vehicule?: string; // Immatriculation véhicule
  modeLivraison: 'livraison_directe' | 'transporteur' | 'retrait_client' | 'coursier';

  // Conditions et observations
  conditionsLivraison?: string;
  observationsGenerales?: string;
  observationsClient?: string;

  // Statut et validation
  status: 'en_preparation' | 'expedie' | 'en_cours_livraison' | 'livre' | 'partiellement_livre' | 'refuse' | 'retour';
  signatureClient?: boolean;
  signatureLivreur?: boolean;

  // Informations complémentaires
  totalColis?: number;
  poidsTotal?: number;
  volumeTotal?: number;
}

/**
 * Service pour générer les Bons de Livraison (BL)
 * Conformes aux exigences marocaines
 * Version corrigée - setTextColor fix
 */
class BonLivraisonService {
  private doc!: jsPDF;

  /**
   * Génère un Bon de Livraison PDF professionnel
   */
  public generateBonLivraison(data: BonLivraisonData): string | null {
    try {
      console.log("=== GÉNÉRATION BON DE LIVRAISON PROFESSIONNEL ===");
      console.log("Données BL:", data);

      this.doc = new jsPDF();

      // Calcul automatique des quantités restantes
      data.items.forEach(item => {
        item.quantiteRestante = item.quantiteCommandee - item.quantiteLivree;
      });

      let yPos = 20;

      try {
        // En-tête avec logo et informations légales
        yPos = this.addProfessionalHeader(yPos);
        yPos += 5; // Espacement réduit

        // Titre du document avec numéro
        yPos = this.addDocumentTitle(data, yPos);
        yPos += 8; // Espacement réduit

        // Informations client et livraison (2 colonnes)
        yPos = this.addClientAndDeliveryInfo(data, yPos);
        yPos += 8; // Espacement réduit

        // Références et dates
        yPos = this.addReferencesAndDates(data, yPos);
        yPos += 8; // Espacement réduit

        // Tableau des articles avec récapitulatif
        yPos = this.addProfessionalItemsTable(data.items, yPos);
        yPos += 5; // Espacement réduit

        // Récapitulatif des quantités
        yPos = this.addQuantitySummary(data.items, yPos);
        yPos += 8; // Espacement réduit

        // Conditions de livraison
        yPos = this.addDeliveryConditions(data, yPos);
        yPos += 8; // Espacement réduit

        // Vérifier l'espace disponible pour les signatures
        if (yPos > 240) {
          // Nouvelle page si nécessaire
          this.doc.addPage();
          yPos = 20;
        }

        // Signatures et validation
        this.addProfessionalSignatures(data, yPos);

        // Footer avec mentions légales
        this.addFooter();
      } catch (renderError) {
        console.error("Erreur lors du rendu PDF:", renderError);
        throw new Error(`Erreur rendu PDF: ${renderError.message}`);
      }

      // Sauvegarde
      const filename = this.generateProfessionalFilename(data);
      this.doc.save(filename);

      console.log("=== BON DE LIVRAISON PROFESSIONNEL GÉNÉRÉ ===");

      toast.success("Bon de livraison professionnel généré", {
        description: `Fichier ${filename} téléchargé`
      });

      return filename;
    } catch (error) {
      console.error("=== ERREUR GÉNÉRATION BL PROFESSIONNEL ===", error);
      toast.error(`Erreur génération BL: ${error.message || 'Erreur inconnue'}`);
      return null;
    }
  }

  /**
   * Ajoute un en-tête professionnel compact
   */
  private addProfessionalHeader(yPos: number): number {
    // Logo et nom de l'entreprise (plus compact)
    this.doc.setFontSize(16);
    this.doc.setTextColor(26, 43, 60);
    this.doc.setFont(undefined, 'bold');
    this.doc.text("RACHA BUSINESS GROUP", 20, yPos);

    this.doc.setFontSize(9);
    this.doc.setTextColor(100, 100, 100);
    this.doc.setFont(undefined, 'normal');
    this.doc.text("SARL AU", 20, yPos + 7);

    // Informations de contact (colonne gauche) - plus compact
    this.doc.setFontSize(7);
    this.doc.setTextColor(60, 60, 60);
    this.doc.text("Casablanca, Maroc | Tél: +212 6 69 38 28 28", 20, yPos + 14);
    this.doc.text("Email: contact@rachabusiness.com", 20, yPos + 20);

    // Informations légales (colonne droite) - sur 2 lignes
    this.doc.setFontSize(7);
    this.doc.setTextColor(80, 80, 80);
    this.doc.text(`RC: ${COMPANY_CONFIG.rc} | IF: ${COMPANY_CONFIG.if} | ICE: ${COMPANY_CONFIG.ice}`, 120, yPos + 14);
    this.doc.text(`Patente: ${COMPANY_CONFIG.patente} | CNSS: ${COMPANY_CONFIG.cnss} | Capital: ${COMPANY_CONFIG.capital}`, 120, yPos + 20);

    // Ligne de séparation
    this.doc.setDrawColor(26, 43, 60);
    this.doc.setLineWidth(0.8);
    this.doc.line(20, yPos + 27, 190, yPos + 27);

    return yPos + 32; // Réduit de 40 à 32
  }

  /**
   * Ajoute le titre du document avec numéro BL (compact)
   */
  private addDocumentTitle(data: BonLivraisonData, yPos: number): number {
    // Fond coloré pour le titre (plus compact)
    this.doc.setFillColor(26, 43, 60);
    this.doc.rect(20, yPos, 170, 12, 'F');

    this.doc.setFontSize(12);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text("BON DE LIVRAISON", 105, yPos + 5, { align: 'center' });

    this.doc.setFontSize(9);
    this.doc.text(`N° ${data.id}`, 105, yPos + 10, { align: 'center' });

    return yPos + 15; // Réduit de 20 à 15
  }

  /**
   * Ajoute les informations client et livraison
   */
  private addClientAndDeliveryInfo(data: BonLivraisonData, yPos: number): number {
    // === INFORMATIONS CLIENT === (plus compact)
    this.doc.setDrawColor(26, 43, 60);
    this.doc.setLineWidth(0.5);
    this.doc.rect(20, yPos, 80, 28); // Réduit de 35 à 28

    // En-tête client
    this.doc.setFillColor(240, 240, 240);
    this.doc.rect(20, yPos, 80, 7, 'F'); // Réduit de 8 à 7
    this.doc.setFontSize(8);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(0, 0, 0);
    this.doc.text("CLIENT", 22, yPos + 4);

    // Contenu client (plus compact)
    this.doc.setFont(undefined, 'bold');
    this.doc.setFontSize(8);
    const clientName = data.client.length > 25 ? data.client.substring(0, 22) + "..." : data.client;
    this.doc.text(clientName, 22, yPos + 12);

    this.doc.setFont(undefined, 'normal');
    this.doc.setFontSize(7);
    if (data.clientAddress) {
      const address = data.clientAddress.length > 30 ? data.clientAddress.substring(0, 27) + "..." : data.clientAddress;
      this.doc.text(address, 22, yPos + 17);
    }
    if (data.clientVille) {
      this.doc.text(`${data.clientCodePostal || ''} ${data.clientVille}`, 22, yPos + 22);
    }
    if (data.clientPhone) {
      this.doc.text(`Tél: ${data.clientPhone}`, 22, yPos + 27);
    }

    // === INFORMATIONS LIVRAISON === (plus compact)
    this.doc.setDrawColor(26, 43, 60);
    this.doc.rect(110, yPos, 80, 28); // Réduit de 35 à 28

    // En-tête livraison
    this.doc.setFillColor(240, 240, 240);
    this.doc.rect(110, yPos, 80, 7, 'F'); // Réduit de 8 à 7
    this.doc.setFontSize(8);
    this.doc.setFont(undefined, 'bold');
    this.doc.text("LIVRAISON", 112, yPos + 4); // Titre plus court

    // Contenu livraison (plus compact)
    this.doc.setFont(undefined, 'normal');
    this.doc.setFontSize(7);
    const adresseLivraison = data.adresseLivraison || data.clientAddress || "Même adresse";
    const adresseTrunc = adresseLivraison.length > 30 ? adresseLivraison.substring(0, 27) + "..." : adresseLivraison;
    this.doc.text(adresseTrunc, 112, yPos + 12);

    if (data.villeLivraison || data.clientVille) {
      this.doc.text(`${data.codePostalLivraison || data.clientCodePostal || ''} ${data.villeLivraison || data.clientVille || ''}`, 112, yPos + 17);
    }

    if (data.contactLivraison) {
      const contact = data.contactLivraison.length > 25 ? data.contactLivraison.substring(0, 22) + "..." : data.contactLivraison;
      this.doc.text(`Contact: ${contact}`, 112, yPos + 22);
    }

    if (data.telephoneLivraison) {
      this.doc.text(`Tél: ${data.telephoneLivraison}`, 112, yPos + 27);
    }

    return yPos + 32; // Réduit de 40 à 32
  }

  /**
   * Ajoute les références et dates
   */
  private addReferencesAndDates(data: BonLivraisonData, yPos: number): number {
    // Cadre pour les références (plus compact)
    this.doc.setDrawColor(200, 200, 200);
    this.doc.setLineWidth(0.3);
    this.doc.rect(20, yPos, 170, 16); // Réduit de 20 à 16

    this.doc.setFontSize(7); // Réduit de 8 à 7
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(0, 0, 0);

    // Colonne 1
    this.doc.text("Créé:", 22, yPos + 6);
    this.doc.setFont(undefined, 'normal');
    this.doc.text(data.dateCreation, 22, yPos + 11);

    // Colonne 2
    this.doc.setFont(undefined, 'bold');
    this.doc.text("Livraison:", 70, yPos + 6);
    this.doc.setFont(undefined, 'normal');
    this.doc.text(data.dateLivraison, 70, yPos + 11);

    // Colonne 3
    if (data.devisId) {
      this.doc.setFont(undefined, 'bold');
      this.doc.text("Devis:", 118, yPos + 6);
      this.doc.setFont(undefined, 'normal');
      this.doc.text(data.devisId, 118, yPos + 11);
    }

    // Colonne 4
    if (data.commandeId) {
      this.doc.setFont(undefined, 'bold');
      this.doc.text("Commande:", 160, yPos + 6);
      this.doc.setFont(undefined, 'normal');
      this.doc.text(data.commandeId, 160, yPos + 11);
    }

    return yPos + 20; // Réduit de 25 à 20
  }

  /**
   * Ajoute un tableau professionnel des articles
   */
  private addProfessionalItemsTable(items: any[], yPos: number): number {
    // En-tête du tableau (plus compact)
    this.doc.setFillColor(26, 43, 60);
    this.doc.rect(20, yPos, 170, 10, 'F'); // Réduit de 12 à 10

    this.doc.setFontSize(7); // Réduit de 8 à 7
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(255, 255, 255);

    const headers = ["Réf.", "Désignation", "Qté Cmd", "Qté Livr", "Reste", "État"];
    const colPositions = [20, 35, 100, 120, 140, 160];
    const colWidths = [15, 65, 20, 20, 20, 30];

    headers.forEach((header, index) => {
      this.doc.text(header, colPositions[index] + 2, yPos + 7); // Ajusté pour la nouvelle hauteur
    });

    let currentY = yPos + 10; // Ajusté pour la nouvelle hauteur

    // Lignes du tableau (plus compactes)
    items.forEach((item, index) => {
      const rowHeight = 14; // Réduit de 16 à 14

      // Fond alterné
      if (index % 2 === 1) {
        this.doc.setFillColor(248, 249, 250);
        this.doc.rect(20, currentY, 170, rowHeight, 'F');
      }

      // Bordures
      this.doc.setDrawColor(220, 220, 220);
      this.doc.setLineWidth(0.3);
      colPositions.forEach((pos, i) => {
        this.doc.rect(pos, currentY, colWidths[i], rowHeight);
      });

      // Contenu avec alignement amélioré
      this.doc.setFontSize(7);
      this.doc.setTextColor(0, 0, 0);
      this.doc.setFont(undefined, 'normal');

      // Référence (centrée verticalement)
      if (item.reference) {
        this.doc.setFontSize(6);
        this.doc.text(item.reference, colPositions[0] + 1, currentY + 8);
      }

      // Désignation (ligne 1)
      const designation = item.designation || item.name || '';
      const designationTrunc = designation.length > 32 ? designation.substring(0, 29) + "..." : designation;
      this.doc.setFont(undefined, 'bold');
      this.doc.setFontSize(7);
      this.doc.text(designationTrunc, colPositions[1] + 2, currentY + 5);

      // Description (ligne 2, plus discrète)
      if (item.description) {
        this.doc.setFont(undefined, 'normal');
        this.doc.setFontSize(6);
        this.doc.setTextColor(120, 120, 120);
        const descTrunc = item.description.length > 38 ? item.description.substring(0, 35) + "..." : item.description;
        this.doc.text(descTrunc, colPositions[1] + 2, currentY + 10);
      }

      // Quantités (centrées dans les colonnes)
      this.doc.setFontSize(8);
      this.doc.setTextColor(0, 0, 0);
      this.doc.setFont(undefined, 'normal');

      // Qté commandée (centrée)
      const qteCmd = item.quantiteCommandee || item.quantity || 0;
      this.doc.text(qteCmd.toString(), colPositions[2] + 10, currentY + 8, { align: 'center' });

      // Qté livrée (centrée, avec couleur)
      const qteLivr = item.quantiteLivree || item.quantityLivree || 0;
      this.doc.setFont(undefined, 'bold');
      if (qteLivr === qteCmd) {
        this.doc.setTextColor(0, 150, 0); // Vert si complet
      } else if (qteLivr > 0) {
        this.doc.setTextColor(200, 100, 0); // Orange si partiel
      } else {
        this.doc.setTextColor(200, 0, 0); // Rouge si rien
      }
      this.doc.text(qteLivr.toString(), colPositions[3] + 10, currentY + 8, { align: 'center' });

      // Reste (centré)
      const reste = qteCmd - qteLivr;
      if (reste > 0) {
        this.doc.setTextColor(200, 0, 0); // Rouge si reste
        this.doc.setFont(undefined, 'bold');
      } else {
        this.doc.setTextColor(100, 100, 100); // Gris si complet
        this.doc.setFont(undefined, 'normal');
      }
      this.doc.text(reste.toString(), colPositions[4] + 10, currentY + 8, { align: 'center' });

      // État (centré)
      this.doc.setTextColor(0, 0, 0);
      this.doc.setFont(undefined, 'normal');
      this.doc.setFontSize(7);
      const etat = item.etat || 'N/A';
      this.doc.text(etat, colPositions[5] + 15, currentY + 8, { align: 'center' });

      currentY += rowHeight;
    });

    return currentY;
  }

  /**
   * Ajoute un récapitulatif des quantités avec disposition améliorée
   */
  private addQuantitySummary(items: any[], yPos: number): number {
    const totalCmd = items.reduce((sum, item) => sum + (item.quantiteCommandee || item.quantity || 0), 0);
    const totalLivr = items.reduce((sum, item) => sum + (item.quantiteLivree || item.quantityLivree || 0), 0);
    const totalReste = totalCmd - totalLivr;

    // Cadre récapitulatif (plus large et mieux positionné)
    this.doc.setDrawColor(26, 43, 60);
    this.doc.setLineWidth(0.5);
    this.doc.rect(100, yPos, 90, 22); // Plus large et plus haut

    // En-tête avec dégradé visuel
    this.doc.setFillColor(26, 43, 60);
    this.doc.rect(100, yPos, 90, 8, 'F');
    this.doc.setFontSize(8);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text("RÉCAPITULATIF LIVRAISON", 145, yPos + 5, { align: 'center' });

    // Contenu avec alignement en colonnes
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(7);
    this.doc.setFont(undefined, 'normal');

    // Ligne 1: Commandé et Livré
    this.doc.text(`Commandé: ${totalCmd}`, 102, yPos + 13);
    this.doc.setTextColor(0, 150, 0);
    this.doc.setFont(undefined, 'bold');
    this.doc.text(`Livré: ${totalLivr}`, 145, yPos + 13);

    // Ligne 2: Reste (si applicable)
    if (totalReste > 0) {
      this.doc.setTextColor(200, 0, 0);
      this.doc.setFont(undefined, 'bold');
      this.doc.text(`Reste à livrer: ${totalReste}`, 102, yPos + 19);
    } else {
      this.doc.setTextColor(0, 150, 0);
      this.doc.setFont(undefined, 'bold');
      this.doc.text("✓ LIVRAISON COMPLÈTE", 145, yPos + 19, { align: 'center' });
    }

    // Ligne de séparation décorative
    this.doc.setDrawColor(200, 200, 200);
    this.doc.setLineWidth(0.3);
    this.doc.line(100, yPos + 25, 190, yPos + 25);

    return yPos + 30; // Augmenté pour l'espace supplémentaire
  }

  /**
   * Ajoute les conditions de livraison avec disposition améliorée
   */
  private addDeliveryConditions(data: BonLivraisonData, yPos: number): number {
    if (data.conditionsLivraison || data.observationsGenerales) {
      // Cadre conditions avec en-tête coloré
      this.doc.setDrawColor(26, 43, 60);
      this.doc.setLineWidth(0.5);
      this.doc.rect(20, yPos, 170, 28); // Hauteur augmentée

      // En-tête coloré
      this.doc.setFillColor(240, 240, 240);
      this.doc.rect(20, yPos, 170, 8, 'F');
      this.doc.setFontSize(8);
      this.doc.setFont(undefined, 'bold');
      this.doc.setTextColor(26, 43, 60);
      this.doc.text("CONDITIONS ET OBSERVATIONS", 22, yPos + 5);

      // Contenu avec meilleur espacement
      this.doc.setFont(undefined, 'normal');
      this.doc.setFontSize(7);
      this.doc.setTextColor(0, 0, 0);

      let contentY = yPos + 12;

      if (data.conditionsLivraison) {
        this.doc.setFont(undefined, 'bold');
        this.doc.text("Conditions:", 22, contentY);
        this.doc.setFont(undefined, 'normal');

        // Découper le texte si trop long
        const conditions = data.conditionsLivraison;
        if (conditions.length > 80) {
          const line1 = conditions.substring(0, 77) + "...";
          const line2 = conditions.substring(77, 154) + (conditions.length > 154 ? "..." : "");
          this.doc.text(line1, 22, contentY + 4);
          if (line2.trim()) {
            this.doc.text(line2, 22, contentY + 8);
          }
          contentY += 12;
        } else {
          this.doc.text(conditions, 22, contentY + 4);
          contentY += 8;
        }
      }

      if (data.observationsGenerales) {
        this.doc.setFont(undefined, 'bold');
        this.doc.text("Observations:", 22, contentY);
        this.doc.setFont(undefined, 'normal');

        // Découper le texte si trop long
        const observations = data.observationsGenerales;
        if (observations.length > 80) {
          const line1 = observations.substring(0, 77) + "...";
          this.doc.text(line1, 22, contentY + 4);
        } else {
          this.doc.text(observations, 22, contentY + 4);
        }
      }

      return yPos + 32; // Augmenté pour l'espace supplémentaire
    }
    return yPos;
  }

  /**
   * Ajoute les signatures professionnelles avec disposition améliorée
   */
  private addProfessionalSignatures(data: BonLivraisonData, yPos: number): void {
    // Titre de section
    this.doc.setFontSize(9);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(26, 43, 60);
    this.doc.text("VALIDATION ET SIGNATURES", 105, yPos, { align: 'center' });

    yPos += 8;

    // Signatures côte à côte avec meilleur espacement
    // Livreur (gauche)
    this.doc.setDrawColor(26, 43, 60);
    this.doc.setLineWidth(0.5);
    this.doc.rect(20, yPos, 80, 35); // Légèrement plus large

    this.doc.setFillColor(240, 240, 240);
    this.doc.rect(20, yPos, 80, 8, 'F');
    this.doc.setFontSize(8);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(26, 43, 60);
    this.doc.text("LIVREUR", 60, yPos + 5, { align: 'center' });

    // Contenu livreur
    this.doc.setFont(undefined, 'normal');
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(8);
    const livreurName = data.livreur.length > 25 ? data.livreur.substring(0, 22) + "..." : data.livreur;
    this.doc.text(livreurName, 60, yPos + 15, { align: 'center' });

    this.doc.setFontSize(7);
    this.doc.text("Date:", 22, yPos + 22);
    this.doc.text(data.dateLivraison, 35, yPos + 22);

    this.doc.text("Signature:", 22, yPos + 28);
    this.doc.setDrawColor(200, 200, 200);
    this.doc.setLineWidth(0.3);
    this.doc.rect(22, yPos + 30, 76, 4);

    // Client (droite)
    this.doc.setDrawColor(26, 43, 60);
    this.doc.setLineWidth(0.5);
    this.doc.rect(110, yPos, 80, 35); // Légèrement plus large

    this.doc.setFillColor(240, 240, 240);
    this.doc.rect(110, yPos, 80, 8, 'F');
    this.doc.setFontSize(8);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(26, 43, 60);
    this.doc.text("CLIENT", 150, yPos + 5, { align: 'center' });

    // Contenu client
    this.doc.setFont(undefined, 'normal');
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(8);
    const clientName = data.client.length > 25 ? data.client.substring(0, 22) + "..." : data.client;
    this.doc.text(clientName, 150, yPos + 15, { align: 'center' });

    this.doc.setFontSize(7);
    this.doc.text("Nom et qualité:", 112, yPos + 22);
    this.doc.text("Signature:", 112, yPos + 28);
    this.doc.setDrawColor(200, 200, 200);
    this.doc.setLineWidth(0.3);
    this.doc.rect(112, yPos + 30, 76, 4);

    // Note de validation
    yPos += 40;
    this.doc.setFontSize(6);
    this.doc.setTextColor(100, 100, 100);
    this.doc.text("Les signatures ci-dessus valident la conformité de la livraison", 105, yPos, { align: 'center' });
  }

  /**
   * Ajoute un footer légal
   */
  private addLegalFooter(): void {
    const footerY = 280;

    this.doc.setDrawColor(200, 200, 200);
    this.doc.setLineWidth(0.5);
    this.doc.line(20, footerY - 5, 190, footerY - 5);

    this.doc.setFontSize(7);
    this.doc.setTextColor(120, 120, 120);

    const today = new Date();
    const dateFormatted = today.toLocaleDateString('fr-FR');

    this.doc.text(
      `Bon de livraison généré le ${dateFormatted} - ${COMPANY_CONFIG.name} ${COMPANY_CONFIG.legalForm}`,
      105,
      footerY,
      { align: 'center' }
    );

    this.doc.setFontSize(6);
    this.doc.text(
      "Document non contractuel - Valable uniquement avec signature des deux parties",
      105,
      footerY + 6,
      { align: 'center' }
    );
  }

  /**
   * Génère un nom de fichier professionnel
   */
  private generateProfessionalFilename(data: BonLivraisonData): string {
    const clientName = data.client.replace(/[^a-zA-Z0-9]/g, '_');
    const date = new Date().toISOString().split('T')[0];
    return `BL_${data.id}_${clientName}_${date}.pdf`;
  }

  /**
   * ANCIENNES MÉTHODES - À SUPPRIMER PROGRESSIVEMENT
   */
  private addBLInfo(data: BonLivraisonData, yPos: number): void {
    this.doc.setTextColor(0, 0, 0);

    // === SECTION INFORMATIONS BL (Colonne gauche) ===
    // Cadre pour les informations BL
    this.doc.setDrawColor(26, 43, 60);
    this.doc.setLineWidth(0.8);
    this.doc.rect(20, yPos - 2, 85, 32);

    // En-tête section BL
    this.doc.setFillColor(26, 43, 60);
    this.doc.rect(20, yPos - 2, 85, 8, 'F');
    this.doc.setFontSize(9);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text("INFORMATIONS LIVRAISON", 22, yPos + 3);

    // Contenu section BL
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(9);
    this.doc.setFont(undefined, 'bold');
    this.doc.text("N° BL:", 22, yPos + 12);
    this.doc.setFont(undefined, 'normal');
    this.doc.text(data.id, 45, yPos + 12);

    this.doc.setFont(undefined, 'bold');
    this.doc.text("Créé le:", 22, yPos + 18);
    this.doc.setFont(undefined, 'normal');
    this.doc.text(data.dateCreation, 45, yPos + 18);

    this.doc.setFont(undefined, 'bold');
    this.doc.text("Livré le:", 22, yPos + 24);
    this.doc.setFont(undefined, 'normal');
    this.doc.text(data.dateLivraison, 45, yPos + 24);

    if (data.devisId) {
      this.doc.setFont(undefined, 'bold');
      this.doc.text("Réf. Devis:", 22, yPos + 30);
      this.doc.setFont(undefined, 'normal');
      this.doc.text(data.devisId, 55, yPos + 30);
    }

    // === SECTION CLIENT (Colonne droite) ===
    // Cadre pour les informations client
    this.doc.setDrawColor(26, 43, 60);
    this.doc.setLineWidth(0.8);
    this.doc.rect(110, yPos - 2, 80, 32);

    // En-tête section client
    this.doc.setFillColor(26, 43, 60);
    this.doc.rect(110, yPos - 2, 80, 8, 'F');
    this.doc.setFontSize(9);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text("DESTINATAIRE", 112, yPos + 3);

    // Contenu section client
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(9);
    this.doc.setFont(undefined, 'bold');
    this.doc.text(data.client, 112, yPos + 12);

    let clientYPos = yPos + 18;
    if (data.clientAddress) {
      this.doc.setFont(undefined, 'normal');
      this.doc.setFontSize(8);
      // Découper l'adresse si trop longue
      const address = data.clientAddress.length > 35 ? data.clientAddress.substring(0, 32) + "..." : data.clientAddress;
      this.doc.text(address, 112, clientYPos);
      clientYPos += 6;
    }
    if (data.clientPhone) {
      this.doc.setFont(undefined, 'normal');
      this.doc.setFontSize(8);
      this.doc.text(`Tél: ${data.clientPhone}`, 112, clientYPos);
      clientYPos += 6;
    }
    if (data.clientEmail) {
      this.doc.setFont(undefined, 'normal');
      this.doc.setFontSize(8);
      this.doc.text(data.clientEmail, 112, clientYPos);
    }

    // Réinitialiser les styles
    this.doc.setDrawColor(0, 0, 0);
    this.doc.setTextColor(0, 0, 0);
  }

  /**
   * Dessine le tableau des articles livrés avec disposition optimisée
   */
  private drawLivraisonTable(items: any[], startY: number): void {
    // Colonnes optimisées pour meilleure lisibilité
    const colWidths = [70, 18, 18, 35, 25, 24];
    const colPositions = [20, 90, 108, 126, 161, 186];
    const rowHeight = 18; // Hauteur augmentée pour plus d'espace

    // En-tête du tableau avec hauteur augmentée
    this.doc.setFillColor(26, 43, 60);
    this.doc.rect(20, startY, 190, 14, 'F');

    this.doc.setFontSize(8);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(255, 255, 255);

    const headers = ["Désignation", "Qté Cmd", "Qté Livr", "N° Série", "État", "Obs."];
    headers.forEach((header, index) => {
      this.doc.text(header, colPositions[index] + 2, startY + 9);
    });

    let yPos = startY + 14;

    // Lignes du tableau
    items.forEach((item, index) => {
      // Fond alterné pour meilleure lisibilité
      if (index % 2 === 1) {
        this.doc.setFillColor(248, 249, 250);
        this.doc.rect(20, yPos, 190, rowHeight, 'F');
      }

      // Bordures avec couleur plus douce
      this.doc.setDrawColor(220, 220, 220);
      this.doc.setLineWidth(0.3);
      colPositions.forEach((pos, i) => {
        this.doc.rect(pos, yPos, colWidths[i], rowHeight);
      });

      // Contenu avec positionnement amélioré
      this.doc.setFontSize(8);
      this.doc.setFont(undefined, 'bold');
      this.doc.setTextColor(0, 0, 0);

      // Nom de l'article (ligne 1)
      const nomTronque = item.name.length > 32 ? item.name.substring(0, 29) + "..." : item.name;
      this.doc.text(nomTronque, colPositions[0] + 2, yPos + 7);

      // Description (ligne 2, plus petite)
      this.doc.setFontSize(7);
      this.doc.setFont(undefined, 'normal');
      this.doc.setTextColor(100, 100, 100);
      const descTronquee = item.description.length > 38 ? item.description.substring(0, 35) + "..." : item.description;
      this.doc.text(descTronquee, colPositions[0] + 2, yPos + 13);

      // Données centrées verticalement
      this.doc.setFontSize(9);
      this.doc.setTextColor(0, 0, 0);
      this.doc.setFont(undefined, 'normal');

      // Quantité commandée (centrée)
      this.doc.text(item.quantity.toString(), colPositions[1] + 8, yPos + 10);

      // Quantité livrée (centrée, avec couleur)
      this.doc.setFont(undefined, 'bold');
      if (item.quantityLivree === item.quantity) {
        this.doc.setTextColor(0, 150, 0); // Vert si quantité complète
      } else {
        this.doc.setTextColor(200, 100, 0); // Orange si quantité partielle
      }
      this.doc.text(item.quantityLivree.toString(), colPositions[2] + 8, yPos + 10);

      // Numéro de série (tronqué si nécessaire)
      this.doc.setTextColor(0, 0, 0);
      this.doc.setFont(undefined, 'normal');
      this.doc.setFontSize(7);
      if (item.numeroSerie) {
        const serieText = item.numeroSerie.length > 15 ? item.numeroSerie.substring(0, 12) + "..." : item.numeroSerie;
        this.doc.text(serieText, colPositions[3] + 2, yPos + 10);
      }

      // État
      this.doc.setFontSize(8);
      if (item.etat) {
        this.doc.text(item.etat, colPositions[4] + 2, yPos + 10);
      }

      yPos += rowHeight;
    });
  }

  /**
   * Ajoute la section signatures et observations avec disposition améliorée
   */
  private addSignatureSection(data: BonLivraisonData, yPos: number): void {
    // === SECTION OBSERVATIONS ===
    if (data.observations) {
      // Cadre pour les observations
      this.doc.setDrawColor(26, 43, 60);
      this.doc.setLineWidth(0.5);
      this.doc.rect(20, yPos - 2, 170, 18);

      // En-tête observations
      this.doc.setFillColor(26, 43, 60);
      this.doc.rect(20, yPos - 2, 170, 8, 'F');
      this.doc.setFontSize(9);
      this.doc.setFont(undefined, 'bold');
      this.doc.setTextColor(255, 255, 255);
      this.doc.text("OBSERVATIONS", 22, yPos + 3);

      // Contenu observations
      this.doc.setTextColor(0, 0, 0);
      this.doc.setFont(undefined, 'normal');
      this.doc.setFontSize(8);
      const observations = data.observations.length > 90 ? data.observations.substring(0, 87) + "..." : data.observations;
      this.doc.text(observations, 22, yPos + 10);
      yPos += 25;
    }

    // === SECTION SIGNATURES ===
    // Cadre livreur
    this.doc.setDrawColor(26, 43, 60);
    this.doc.setLineWidth(0.5);
    this.doc.rect(20, yPos, 80, 35);

    // En-tête livreur
    this.doc.setFillColor(26, 43, 60);
    this.doc.rect(20, yPos, 80, 8, 'F');
    this.doc.setFontSize(9);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text("LIVREUR", 22, yPos + 5);

    // Contenu livreur
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFont(undefined, 'normal');
    this.doc.setFontSize(8);
    if (data.livreur) {
      this.doc.text(data.livreur, 22, yPos + 14);
    }
    this.doc.text("Signature:", 22, yPos + 22);
    // Zone signature livreur
    this.doc.setDrawColor(200, 200, 200);
    this.doc.setLineWidth(0.3);
    this.doc.rect(22, yPos + 25, 76, 8);

    // Cadre client
    this.doc.setDrawColor(26, 43, 60);
    this.doc.setLineWidth(0.5);
    this.doc.rect(110, yPos, 80, 35);

    // En-tête client
    this.doc.setFillColor(26, 43, 60);
    this.doc.rect(110, yPos, 80, 8, 'F');
    this.doc.setFontSize(9);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text("CLIENT", 112, yPos + 5);

    // Contenu client
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFont(undefined, 'normal');
    this.doc.setFontSize(8);
    const clientName = data.client.length > 25 ? data.client.substring(0, 22) + "..." : data.client;
    this.doc.text(clientName, 112, yPos + 14);
    this.doc.text("Signature:", 112, yPos + 22);
    // Zone signature client
    this.doc.setDrawColor(200, 200, 200);
    this.doc.setLineWidth(0.3);
    this.doc.rect(112, yPos + 25, 76, 8);

    // === SECTION DATE ET CACHET ===
    yPos += 40;
    this.doc.setFontSize(8);
    this.doc.setTextColor(100, 100, 100);
    this.doc.text(`Date de livraison: ${data.dateLivraison}`, 20, yPos);
    this.doc.text("Cachet de l'entreprise", 120, yPos);

    // Réinitialiser les styles
    this.doc.setDrawColor(0, 0, 0);
    this.doc.setTextColor(0, 0, 0);
  }

  private generateFilename(data: BonLivraisonData): string {
    const clientName = data.client.replace(/[^a-zA-Z0-9]/g, '_');
    return `BL_${data.id}_${clientName}.pdf`;
  }

  private addLogo(): void {
    try {
      // Logo simple pour Racha Business Group
      this.doc.setFontSize(20);
      this.doc.setTextColor(26, 43, 60);
      this.doc.setFont(undefined, 'bold');
      this.doc.text("RACHA BUSINESS GROUP", 20, 20);
      
      this.doc.setFontSize(10);
      this.doc.setTextColor(100, 100, 100);
      this.doc.setFont(undefined, 'normal');
      this.doc.text("SARL AU", 20, 28);

      // Informations contact
      this.doc.setFontSize(9);
      this.doc.setTextColor(60, 60, 60);
      this.doc.text("Casablanca, Maroc", 20, 36);
      this.doc.text("Tel: +212 6 69 38 28 28", 20, 42);
      this.doc.text("Email: contact@rachabusiness.com", 20, 48);
      this.doc.text("Web: www.rachabusiness.com", 20, 54);

      // Informations légales
      this.doc.setFontSize(8);
      this.doc.setTextColor(80, 80, 80);
      this.doc.text("RC: [À COMPLÉTER] | IF: [À COMPLÉTER] | ICE: [À COMPLÉTER]", 20, 62);
      this.doc.text("Patente: [À COMPLÉTER] | CNSS: [À COMPLÉTER] | Capital: [À COMPLÉTER]", 20, 69);

      // Ligne de séparation
      this.doc.setDrawColor(26, 43, 60);
      this.doc.setLineWidth(1);
      this.doc.line(20, 78, 190, 78);

      this.doc.setTextColor(0, 0, 0);
      this.doc.setDrawColor(0, 0, 0);
    } catch (error) {
      console.warn('Erreur logo BL:', error);
    }
  }

  private addFooter(): void {
    const footerY = 280;
    
    this.doc.setDrawColor(200, 200, 200);
    this.doc.setLineWidth(0.5);
    this.doc.line(20, footerY - 5, 190, footerY - 5);
    
    this.doc.setFontSize(8);
    this.doc.setTextColor(120, 120, 120);
    
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
    const dateFormatted = `${day}/${month}/${year}`;
    
    this.doc.text(
      `Bon de livraison généré le ${dateFormatted} - ${COMPANY_CONFIG.name} ${COMPANY_CONFIG.legalForm}`,
      105,
      footerY,
      { align: 'center' }
    );
    
    this.doc.setFontSize(7);
    this.doc.setTextColor(150, 150, 150);
    this.doc.text(
      `${COMPANY_CONFIG.phone} | ${COMPANY_CONFIG.email}`,
      105,
      footerY + 6,
      { align: 'center' }
    );
    
    this.doc.setTextColor(0, 0, 0);
    this.doc.setDrawColor(0, 0, 0);
  }
}

// Instance singleton
export const bonLivraisonService = new BonLivraisonService();
