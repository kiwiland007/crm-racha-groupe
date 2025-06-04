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

export interface EventReportData {
  id: string;
  title: string;
  client: string;
  date: string;
  time: string;
  location: string;
  status: string;
  description?: string;
  assignedTechnicians?: string[];
  reservedMaterials?: Array<{
    productName: string;
    quantity: number;
    category?: string;
    status?: string;
  }>;
  notes?: string;
  budget?: number;
  actualCost?: number;
}

class EventReportPDFService {
  private doc!: jsPDF;

  /**
   * Génère un rapport PDF professionnel pour un événement
   */
  public generateEventReport(data: EventReportData): string | null {
    try {
      console.log("=== GÉNÉRATION RAPPORT ÉVÉNEMENT PDF ===");
      console.log("Données:", data);

      this.doc = new jsPDF();

      // En-tête avec logo et informations entreprise
      this.addHeader();

      // Titre du rapport
      let yPos = 70;
      this.addReportTitle(data, yPos);
      yPos += 25;

      // Informations générales de l'événement
      yPos = this.addEventInfo(data, yPos);
      yPos += 15;

      // Section matériel réservé
      if (data.reservedMaterials && data.reservedMaterials.length > 0) {
        yPos = this.addMaterialSection(data.reservedMaterials, yPos);
        yPos += 15;
      }

      // Section équipe technique
      if (data.assignedTechnicians && data.assignedTechnicians.length > 0) {
        yPos = this.addTeamSection(data.assignedTechnicians, yPos);
        yPos += 15;
      }

      // Section budget (si disponible)
      if (data.budget || data.actualCost) {
        yPos = this.addBudgetSection(data, yPos);
        yPos += 15;
      }

      // Notes et observations
      if (data.notes) {
        yPos = this.addNotesSection(data.notes, yPos);
      }

      // Footer
      this.addFooter();

      // Sauvegarde
      const filename = this.generateFilename(data);
      this.doc.save(filename);

      console.log("=== RAPPORT PDF GÉNÉRÉ AVEC SUCCÈS ===");

      toast.success("Rapport généré avec succès", {
        description: `Fichier ${filename} téléchargé`
      });

      return filename;
    } catch (error) {
      console.error("=== ERREUR GÉNÉRATION RAPPORT PDF ===", error);
      toast.error(`Erreur lors de la génération du rapport: ${error.message || 'Erreur inconnue'}`);
      return null;
    }
  }

  private addHeader(): void {
    // Logo et nom de l'entreprise
    this.doc.setFillColor(26, 43, 60);
    this.doc.rect(0, 0, 210, 25, 'F');

    this.doc.setFontSize(18);
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFont(undefined, 'bold');
    this.doc.text(COMPANY_CONFIG.name, 20, 16);

    this.doc.setFontSize(10);
    this.doc.setFont(undefined, 'normal');
    this.doc.text(COMPANY_CONFIG.legalForm, 150, 12);
    this.doc.text(COMPANY_CONFIG.address, 150, 18);

    // Ligne de séparation
    this.doc.setDrawColor(26, 43, 60);
    this.doc.setLineWidth(0.5);
    this.doc.line(20, 30, 190, 30);

    // Informations légales en petit
    this.doc.setFontSize(7);
    this.doc.setTextColor(100, 100, 100);
    this.doc.text(`RC: ${COMPANY_CONFIG.rc} | ICE: ${COMPANY_CONFIG.ice} | IF: ${COMPANY_CONFIG.if}`, 20, 38);
    this.doc.text(`Tel: ${COMPANY_CONFIG.phone} | Email: ${COMPANY_CONFIG.email}`, 20, 44);

    // Reset colors
    this.doc.setTextColor(0, 0, 0);
  }

  private addReportTitle(data: EventReportData, yPos: number): void {
    // Fond coloré pour le titre
    this.doc.setFillColor(52, 152, 219);
    this.doc.rect(20, yPos - 5, 170, 15, 'F');

    this.doc.setFontSize(14);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('RAPPORT D\'ÉVÉNEMENT', 105, yPos + 5, { align: 'center' });

    // Sous-titre avec ID et date
    this.doc.setFontSize(10);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text(`Événement: ${data.id} | Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 105, yPos + 18, { align: 'center' });
  }

  private addEventInfo(data: EventReportData, yPos: number): number {
    // Titre de section
    this.doc.setFontSize(12);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(26, 43, 60);
    this.doc.text('INFORMATIONS GÉNÉRALES', 20, yPos);

    yPos += 8;

    // Tableau d'informations
    const infoData = [
      ['Titre:', data.title],
      ['Client:', data.client],
      ['Date:', data.date],
      ['Heure:', data.time],
      ['Lieu:', data.location],
      ['Statut:', data.status],
    ];

    if (data.description) {
      infoData.push(['Description:', data.description]);
    }

    this.doc.setFontSize(10);
    this.doc.setFont(undefined, 'normal');
    this.doc.setTextColor(0, 0, 0);

    infoData.forEach(([label, value], index) => {
      const currentY = yPos + (index * 6);
      
      // Label en gras
      this.doc.setFont(undefined, 'bold');
      this.doc.text(label, 25, currentY);
      
      // Valeur normale
      this.doc.setFont(undefined, 'normal');
      this.doc.text(value, 70, currentY);
    });

    return yPos + (infoData.length * 6);
  }

  private addMaterialSection(materials: EventReportData['reservedMaterials'], yPos: number): number {
    // Vérifier l'espace disponible
    if (yPos > 220) {
      this.doc.addPage();
      yPos = 20;
    }

    // Titre de section
    this.doc.setFontSize(12);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(26, 43, 60);
    this.doc.text('MATÉRIEL RÉSERVÉ', 20, yPos);

    yPos += 10;

    // En-têtes du tableau
    this.doc.setFillColor(240, 240, 240);
    this.doc.rect(20, yPos - 3, 170, 8, 'F');

    this.doc.setFontSize(9);
    this.doc.setFont(undefined, 'bold');
    this.doc.text('Équipement', 25, yPos + 2);
    this.doc.text('Quantité', 120, yPos + 2);
    this.doc.text('Catégorie', 150, yPos + 2);

    yPos += 8;

    // Lignes du tableau
    this.doc.setFont(undefined, 'normal');
    materials!.forEach((material, index) => {
      if (yPos > 270) {
        this.doc.addPage();
        yPos = 20;
      }

      // Alternance de couleurs
      if (index % 2 === 0) {
        this.doc.setFillColor(250, 250, 250);
        this.doc.rect(20, yPos - 2, 170, 6, 'F');
      }

      this.doc.setTextColor(0, 0, 0);
      this.doc.text(material.productName, 25, yPos + 2);
      this.doc.text(material.quantity.toString(), 125, yPos + 2);
      this.doc.text(material.category || 'N/A', 155, yPos + 2);

      yPos += 6;
    });

    // Ligne de séparation
    this.doc.setDrawColor(200, 200, 200);
    this.doc.line(20, yPos + 2, 190, yPos + 2);

    return yPos + 5;
  }

  private addTeamSection(technicians: string[], yPos: number): number {
    // Vérifier l'espace disponible
    if (yPos > 240) {
      this.doc.addPage();
      yPos = 20;
    }

    // Titre de section
    this.doc.setFontSize(12);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(26, 43, 60);
    this.doc.text('ÉQUIPE TECHNIQUE', 20, yPos);

    yPos += 8;

    this.doc.setFontSize(10);
    this.doc.setFont(undefined, 'normal');
    this.doc.setTextColor(0, 0, 0);

    technicians.forEach((tech, index) => {
      this.doc.text(`• Technicien ${tech}`, 25, yPos + (index * 5));
    });

    return yPos + (technicians.length * 5);
  }

  private addBudgetSection(data: EventReportData, yPos: number): number {
    // Titre de section
    this.doc.setFontSize(12);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(26, 43, 60);
    this.doc.text('BUDGET', 20, yPos);

    yPos += 8;

    this.doc.setFontSize(10);
    this.doc.setFont(undefined, 'normal');

    if (data.budget) {
      this.doc.setFont(undefined, 'bold');
      this.doc.text('Budget prévu:', 25, yPos);
      this.doc.setFont(undefined, 'normal');
      this.doc.text(`${data.budget.toLocaleString()} MAD`, 80, yPos);
      yPos += 6;
    }

    if (data.actualCost) {
      this.doc.setFont(undefined, 'bold');
      this.doc.text('Coût réel:', 25, yPos);
      this.doc.setFont(undefined, 'normal');
      this.doc.text(`${data.actualCost.toLocaleString()} MAD`, 80, yPos);
      yPos += 6;
    }

    return yPos;
  }

  private addNotesSection(notes: string, yPos: number): number {
    // Vérifier l'espace disponible
    if (yPos > 220) {
      this.doc.addPage();
      yPos = 20;
    }

    // Titre de section
    this.doc.setFontSize(12);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(26, 43, 60);
    this.doc.text('NOTES ET OBSERVATIONS', 20, yPos);

    yPos += 8;

    // Cadre pour les notes
    this.doc.setDrawColor(200, 200, 200);
    this.doc.rect(20, yPos - 2, 170, 30);

    this.doc.setFontSize(9);
    this.doc.setFont(undefined, 'normal');
    this.doc.setTextColor(0, 0, 0);

    // Diviser le texte en lignes
    const lines = this.doc.splitTextToSize(notes, 160);
    lines.forEach((line: string, index: number) => {
      if (index < 4) { // Limiter à 4 lignes
        this.doc.text(line, 25, yPos + 5 + (index * 5));
      }
    });

    return yPos + 35;
  }

  private addFooter(): void {
    const pageHeight = this.doc.internal.pageSize.height;
    const footerY = pageHeight - 20;

    // Ligne de séparation
    this.doc.setDrawColor(26, 43, 60);
    this.doc.setLineWidth(0.5);
    this.doc.line(20, footerY - 5, 190, footerY - 5);

    // Texte du footer
    this.doc.setFontSize(8);
    this.doc.setTextColor(100, 100, 100);
    this.doc.setFont(undefined, 'normal');

    const dateFormatted = new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    this.doc.text(
      `Rapport généré le ${dateFormatted} - ${COMPANY_CONFIG.name} ${COMPANY_CONFIG.legalForm}`,
      105,
      footerY,
      { align: 'center' }
    );

    this.doc.text(
      `${COMPANY_CONFIG.phone} | ${COMPANY_CONFIG.email}`,
      105,
      footerY + 6,
      { align: 'center' }
    );
  }

  private generateFilename(data: EventReportData): string {
    const clientName = data.client.replace(/[^a-zA-Z0-9]/g, '_');
    const eventDate = data.date.replace(/[^0-9]/g, '');
    return `Rapport_Evenement_${data.id}_${clientName}_${eventDate}.pdf`;
  }
}

// Instance singleton
export const eventReportPDFService = new EventReportPDFService();

// Export des types
export type { EventReportData };
