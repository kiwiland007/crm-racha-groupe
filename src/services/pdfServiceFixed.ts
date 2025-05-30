import jsPDF from "jspdf";
import { toast } from "sonner";

// Configuration de l'entreprise pour PDF
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
  capital: "100 000,00 MAD",
  bank: "À COMPLÉTER",
  rib: "À COMPLÉTER",
  paymentTerms: "Selon conditions convenues",
  paymentMethod: "Chèque, virement bancaire ou espèces"
};

// Types pour les données PDF
export interface PDFQuoteData {
  id: string;
  client: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: string;
  projectName?: string;
  description: string;
  date: string;
  items: Array<{
    type: 'device' | 'service';
    name: string;
    description: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
  }>;
  subtotal: number;
  discount?: number;
  tax: number;
  total: number;
  taxRate?: number;
  paymentTerms?: string;
  validityDays?: number;
  notes?: string;
  status?: string;
}

/**
 * Service PDF corrigé sans autoTable
 * Utilise uniquement des tableaux manuels
 */
class PDFServiceFixed {
  private doc!: jsPDF;

  /**
   * Formate un nombre avec la méthode simple qui fonctionne
   */
  private formatNumber(value: number, decimals: number = 2): string {
    try {
      if (typeof value !== 'number' || isNaN(value)) {
        return '0,00';
      }
      
      const fixed = value.toFixed(decimals);
      const parts = fixed.split('.');
      let entier = parts[0];
      const decimal = parts[1] || '';
      
      // Ajouter espaces pour milliers
      if (entier.length > 3) {
        const reversed = entier.split('').reverse();
        let formatted = '';
        
        for (let i = 0; i < reversed.length; i++) {
          if (i > 0 && i % 3 === 0) {
            formatted = ' ' + formatted;
          }
          formatted = reversed[i] + formatted;
        }
        entier = formatted;
      }
      
      return decimal ? `${entier},${decimal}` : entier;
    } catch (error) {
      console.error('Erreur formatage:', error);
      return value.toFixed(decimals).replace('.', ',');
    }
  }

  /**
   * Formate un montant en MAD
   */
  private formatMontant(value: number): string {
    return `${this.formatNumber(value, 2)} MAD`;
  }

  /**
   * Génère un PDF pour devis ou facture SANS autoTable
   */
  public generateQuotePDF(data: PDFQuoteData, type: 'quote' | 'invoice'): string | null {
    try {
      console.log("=== GÉNÉRATION PDF SANS AUTOTABLE ===");
      console.log("Données:", data);

      this.doc = new jsPDF();

      // Logo et en-tête
      this.addLogo();

      // Titre du document
      let yPos = 88;
      const title = type === 'invoice' ? 'FACTURE COMMERCIALE' : 'DEVIS COMMERCIAL';

      // Fond coloré pour le titre
      this.doc.setFillColor(26, 43, 60);
      this.doc.rect(20, yPos - 5, 170, 12, 'F');

      this.doc.setFontSize(16);
      this.doc.setFont(undefined, 'bold');
      this.doc.setTextColor(255, 255, 255);
      this.doc.text(title, 105, yPos + 3, { align: 'center' });

      yPos += 20;

      // Informations client et document
      this.doc.setTextColor(0, 0, 0);
      this.doc.setFontSize(10);
      this.doc.setFont(undefined, 'bold');
      
      // Colonne gauche - Informations entreprise
      this.doc.text("ÉMETTEUR", 20, yPos);
      this.doc.setFont(undefined, 'normal');
      this.doc.text(COMPANY_CONFIG.name, 20, yPos + 6);
      this.doc.text(COMPANY_CONFIG.address, 20, yPos + 12);
      this.doc.text(`ICE: ${COMPANY_CONFIG.ice}`, 20, yPos + 18);

      // Colonne droite - Informations client
      this.doc.setFont(undefined, 'bold');
      this.doc.text("DESTINATAIRE", 120, yPos);
      this.doc.setFont(undefined, 'normal');
      this.doc.text(data.client, 120, yPos + 6);
      if (data.clientEmail) {
        this.doc.text(data.clientEmail, 120, yPos + 12);
      }
      if (data.clientPhone) {
        this.doc.text(data.clientPhone, 120, yPos + 18);
      }

      yPos += 35;

      // Informations document
      this.doc.setFont(undefined, 'bold');
      this.doc.text(`N° ${type === 'invoice' ? 'Facture' : 'Devis'}: ${data.id}`, 20, yPos);
      this.doc.text(`Date: ${data.date}`, 120, yPos);

      yPos += 15;

      // Tableau des articles MANUEL
      this.drawManualTable(data.items, yPos);
      yPos += (data.items.length * 16) + 20; // Réduction de l'espacement

      // Totaux - Position ajustée pour éviter débordement
      this.addTotalsSection(data, yPos);

      this.addFooter();

      // Sauvegarde
      const filename = this.generateFilename(data, type);
      this.doc.save(filename);

      console.log("=== PDF GÉNÉRÉ AVEC SUCCÈS ===");

      toast.success("PDF généré avec succès", {
        description: `Fichier ${filename} téléchargé`
      });

      return filename;
    } catch (error) {
      console.error("=== ERREUR GÉNÉRATION PDF ===", error);
      toast.error(`Erreur lors de la génération du PDF: ${error.message || 'Erreur inconnue'}`);
      return null;
    }
  }

  /**
   * Dessine un tableau manuel sans autoTable
   */
  private drawManualTable(items: any[], startY: number): void {
    const colWidths = [70, 20, 30, 20, 30];
    const colPositions = [20, 90, 110, 140, 160];
    const rowHeight = 16;

    // En-tête du tableau
    this.doc.setFillColor(26, 43, 60);
    this.doc.rect(20, startY, 170, 12, 'F');

    this.doc.setFontSize(9);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(255, 255, 255);

    const headers = ["Désignation", "Qté", "Prix unitaire", "Remise", "Total"];
    headers.forEach((header, index) => {
      this.doc.text(header, colPositions[index] + 2, startY + 8);
    });

    let yPos = startY + 12;

    // Lignes du tableau
    items.forEach((item, index) => {
      // Fond alterné
      if (index % 2 === 1) {
        this.doc.setFillColor(245, 245, 245);
        this.doc.rect(20, yPos, 170, rowHeight, 'F');
      }

      // Bordures
      this.doc.setDrawColor(200, 200, 200);
      this.doc.setLineWidth(0.5);
      colPositions.forEach((pos, i) => {
        this.doc.rect(pos, yPos, colWidths[i], rowHeight);
      });

      // Contenu
      this.doc.setFontSize(8);
      this.doc.setFont(undefined, 'bold');
      this.doc.setTextColor(0, 0, 0);

      // Nom de l'article
      const nomTronque = item.name.length > 35 ? item.name.substring(0, 32) + "..." : item.name;
      this.doc.text(nomTronque, colPositions[0] + 2, yPos + 6);

      // Description
      this.doc.setFontSize(7);
      this.doc.setFont(undefined, 'normal');
      this.doc.setTextColor(100, 100, 100);
      const descTronquee = item.description.length > 45 ? item.description.substring(0, 42) + "..." : item.description;
      this.doc.text(descTronquee, colPositions[0] + 2, yPos + 11);

      // Données numériques
      this.doc.setFontSize(8);
      this.doc.setTextColor(0, 0, 0);
      this.doc.setFont(undefined, 'normal');

      // Quantité
      this.doc.text(item.quantity.toString(), colPositions[1] + 8, yPos + 8);

      // Prix unitaire
      const prixText = this.formatMontant(item.unitPrice);
      const prixWidth = this.doc.getTextWidth(prixText);
      this.doc.text(prixText, colPositions[2] + colWidths[2] - prixWidth - 2, yPos + 8);

      // Remise
      const remiseText = (item.discount || 0) + "%";
      const remiseWidth = this.doc.getTextWidth(remiseText);
      this.doc.text(remiseText, colPositions[3] + (colWidths[3] - remiseWidth) / 2, yPos + 8);

      // Total
      const itemTotal = item.quantity * item.unitPrice;
      const itemDiscount = ((item.discount || 0) / 100) * itemTotal;
      const itemFinal = itemTotal - itemDiscount;
      
      this.doc.setFont(undefined, 'bold');
      const totalText = this.formatMontant(itemFinal);
      const totalWidth = this.doc.getTextWidth(totalText);
      this.doc.text(totalText, colPositions[4] + colWidths[4] - totalWidth - 2, yPos + 8);

      yPos += rowHeight;
    });
  }

  /**
   * Ajoute la section des totaux avec position optimisée
   */
  private addTotalsSection(data: PDFQuoteData, yPos: number): void {
    // Position optimisée pour éviter débordement
    const totalsX = 110;
    const totalsWidth = 80;

    // Vérifier si on a assez de place, sinon ajuster
    const maxY = 240; // Limite avant footer (ajustée pour nouveau footer)
    if (yPos > maxY) {
      yPos = maxY - 50; // Repositionner plus haut
    }

    // Calculs
    const subtotal = data.subtotal || 0;
    const discount = data.discount || 0;
    const tax = data.tax || 0;
    const total = data.total || 0;

    // Encadré totaux avec hauteur adaptative
    const boxHeight = discount > 0 ? 50 : 44; // Plus haut si remises
    this.doc.setFillColor(245, 245, 245);
    this.doc.rect(totalsX, yPos, totalsWidth, boxHeight, 'F');
    this.doc.setDrawColor(26, 43, 60);
    this.doc.setLineWidth(1);
    this.doc.rect(totalsX, yPos, totalsWidth, boxHeight);

    // En-tête RÉCAPITULATIF
    this.doc.setFillColor(26, 43, 60);
    this.doc.rect(totalsX, yPos, totalsWidth, 12, 'F');
    this.doc.setFontSize(10);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(255, 255, 255);

    // Centrer le texte RÉCAPITULATIF
    const recapText = "RÉCAPITULATIF";
    const recapWidth = this.doc.getTextWidth(recapText);
    const recapX = totalsX + (totalsWidth - recapWidth) / 2;
    this.doc.text(recapText, recapX, yPos + 8);

    // Lignes de totaux
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFont(undefined, 'normal');
    this.doc.setFontSize(8);

    let totalsY = yPos + 20;

    // Sous-total HT
    this.doc.text("Sous-total HT:", totalsX + 3, totalsY);
    const sousText = this.formatMontant(subtotal);
    const sousWidth = this.doc.getTextWidth(sousText);
    this.doc.text(sousText, totalsX + totalsWidth - sousWidth - 3, totalsY);
    totalsY += 7;

    // Remises si présentes
    if (discount > 0) {
      this.doc.text("Remises:", totalsX + 3, totalsY);
      const remText = "-" + this.formatMontant(discount);
      const remWidth = this.doc.getTextWidth(remText);
      this.doc.setTextColor(200, 0, 0);
      this.doc.text(remText, totalsX + totalsWidth - remWidth - 3, totalsY);
      this.doc.setTextColor(0, 0, 0);
      totalsY += 7;
    }

    // TVA 20%
    this.doc.text("TVA (20%):", totalsX + 3, totalsY);
    const tvaText = this.formatMontant(tax);
    const tvaWidth = this.doc.getTextWidth(tvaText);
    this.doc.text(tvaText, totalsX + totalsWidth - tvaWidth - 3, totalsY);
    totalsY += 9;

    // TOTAL TTC (en surbrillance)
    this.doc.setFillColor(26, 43, 60);
    this.doc.rect(totalsX + 1, totalsY - 7, totalsWidth - 2, 14, 'F');
    this.doc.setFont(undefined, 'bold');
    this.doc.setFontSize(11);
    this.doc.setTextColor(255, 255, 255);
    this.doc.text("TOTAL TTC:", totalsX + 3, totalsY);
    const ttcText = this.formatMontant(total);
    const ttcWidth = this.doc.getTextWidth(ttcText);
    this.doc.text(ttcText, totalsX + totalsWidth - ttcWidth - 3, totalsY);

    // Réinitialiser les couleurs
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFillColor(255, 255, 255);
  }

  private generateFilename(data: PDFQuoteData, type: 'quote' | 'invoice'): string {
    const prefix = type === 'invoice' ? 'Facture' : 'Devis';
    const clientName = data.client.replace(/[^a-zA-Z0-9]/g, '_');
    return `${prefix}_${data.id}_${clientName}.pdf`;
  }

  private addLogo(): void {
    try {
      // Logo simple et professionnel pour Racha Business Group

      // === EN-TÊTE ENTREPRISE ===
      this.doc.setFontSize(20);
      this.doc.setTextColor(26, 43, 60); // Bleu foncé corporate
      this.doc.setFont(undefined, 'bold');
      this.doc.text("RACHA BUSINESS GROUP", 20, 20);

      // Forme juridique
      this.doc.setFontSize(10);
      this.doc.setTextColor(100, 100, 100);
      this.doc.setFont(undefined, 'normal');
      this.doc.text("SARL AU", 20, 28);

      // === INFORMATIONS CONTACT ===
      this.doc.setFontSize(9);
      this.doc.setTextColor(60, 60, 60);

      // Adresse et contact
      this.doc.text("Casablanca, Maroc", 20, 36);
      this.doc.text("Tel: +212 6 69 38 28 28", 20, 42);
      this.doc.text("Email: contact@rachabusiness.com", 20, 48);
      this.doc.text("Web: www.rachabusiness.com", 20, 54);

      // === INFORMATIONS LÉGALES MAROCAINES ===
      this.doc.setFontSize(8);
      this.doc.setTextColor(80, 80, 80);

      // Ligne 1 - Identifiants principaux
      this.doc.text(`RC: ${COMPANY_CONFIG.rc} | IF: ${COMPANY_CONFIG.if} | ICE: ${COMPANY_CONFIG.ice}`, 20, 62);

      // Ligne 2 - Autres informations
      this.doc.text(`Patente: ${COMPANY_CONFIG.patente} | CNSS: ${COMPANY_CONFIG.cnss} | Capital: ${COMPANY_CONFIG.capital}`, 20, 69);

      // === LIGNE DE SÉPARATION ===
      this.doc.setDrawColor(26, 43, 60);
      this.doc.setLineWidth(1);
      this.doc.line(20, 78, 190, 78);

      // Réinitialiser les couleurs
      this.doc.setTextColor(0, 0, 0);
      this.doc.setDrawColor(0, 0, 0);
      this.doc.setLineWidth(0.2);

    } catch (error) {
      console.warn('Erreur logo, utilisation du logo simple:', error);

      // === FALLBACK LOGO SIMPLE ===
      this.doc.setFontSize(18);
      this.doc.setTextColor(26, 43, 60);
      this.doc.setFont(undefined, 'bold');
      this.doc.text("RACHA BUSINESS GROUP", 20, 20);

      this.doc.setFontSize(10);
      this.doc.setTextColor(100, 100, 100);
      this.doc.setFont(undefined, 'normal');
      this.doc.text("SARL AU - Casablanca, Maroc", 20, 30);

      this.doc.setFontSize(8);
      this.doc.text("Tel: +212 6 69 38 28 28 | Email: contact@rachabusiness.com", 20, 40);

      // Ligne simple
      this.doc.setDrawColor(26, 43, 60);
      this.doc.line(20, 45, 190, 45);
    }
  }

  private addFooter(): void {
    // Position optimisée du footer
    const footerY = 280; // Position plus haute pour meilleure visibilité

    // Ligne de séparation avant le footer
    this.doc.setDrawColor(200, 200, 200);
    this.doc.setLineWidth(0.5);
    this.doc.line(20, footerY - 5, 190, footerY - 5);

    // Texte du footer
    this.doc.setFontSize(8);
    this.doc.setTextColor(120, 120, 120); // Couleur plus foncée pour meilleure lisibilité

    // Formatage correct de la date
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
    const dateFormatted = `${day}/${month}/${year}`;

    // Footer centré avec position optimisée
    this.doc.text(
      `Document généré le ${dateFormatted} - ${COMPANY_CONFIG.name} ${COMPANY_CONFIG.legalForm}`,
      105,
      footerY,
      { align: 'center' }
    );

    // Informations supplémentaires en bas (optionnel)
    this.doc.setFontSize(7);
    this.doc.setTextColor(150, 150, 150);
    this.doc.text(
      `${COMPANY_CONFIG.phone} | ${COMPANY_CONFIG.email}`,
      105,
      footerY + 6,
      { align: 'center' }
    );

    // Réinitialiser les couleurs
    this.doc.setTextColor(0, 0, 0);
    this.doc.setDrawColor(0, 0, 0);
  }
}

// Instance singleton
export const pdfServiceFixed = new PDFServiceFixed();

// Export des types pour utilisation externe
export type { PDFQuoteData };
