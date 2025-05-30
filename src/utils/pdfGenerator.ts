
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { toast } from "sonner";

// Extension de la définition des types de jsPDF pour inclure autotable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: {
      finalY: number;
    };
  }
}

const companyInfo = {
  name: "MarocTactile CRM Hub",
  address: "123 Avenue Mohammed V, Casablanca, Maroc",
  phone: "+212 522 123 456",
  email: "contact@maroctactile.ma",
  website: "www.maroctactile.ma",
  logo: "/logo.png" // Path to your logo
};

/**
 * Génère un document PDF pour une facture ou un devis
 * @param data Les données à inclure dans le PDF
 * @param type Le type de document ('invoice' pour facture, 'quote' pour devis)
 */
export const generatePDF = (data: Record<string, unknown>, type: 'invoice' | 'quote') => {
  try {
    const doc = new jsPDF();
    
    // Titre du document
    const title = type === 'invoice' ? 'FACTURE' : 'DEVIS';
    const documentNumber = String(data.id || '');
    
    // Style de base
    doc.setFontSize(22);
    doc.setTextColor(0, 0, 0);
    doc.text(title, 105, 20, { align: 'center' });
    
    // Informations de l'entreprise
    doc.setFontSize(10);
    doc.text(companyInfo.name, 20, 40);
    doc.text(companyInfo.address, 20, 45);
    doc.text(`Tél: ${companyInfo.phone}`, 20, 50);
    doc.text(`Email: ${companyInfo.email}`, 20, 55);
    
    // Informations du client
    doc.setFontSize(11);
    doc.text("Client:", 140, 40);
    doc.text(data.client, 140, 45);
    
    // Numéro et date du document
    doc.setFontSize(10);
    doc.text(`N° ${documentNumber}`, 20, 70);
    doc.text(`Date: ${data.date}`, 20, 75);
    
    // Tableau des détails
    const tableColumn = ["Description", "Montant (MAD)", "Avance (MAD)", "Reste à payer (MAD)"];
    const resteToPay = data.amount - data.advanceAmount;
    
    const tableRows = [
      [
        type === 'invoice' ? 'Facture de services' : 'Devis de services', 
        data.amount.toLocaleString(), 
        data.advanceAmount.toLocaleString(), 
        resteToPay.toLocaleString()
      ],
    ];
    
    doc.autoTable({
      startY: 85,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [26, 43, 60], textColor: [255, 255, 255] },
      foot: [[
        'Total',
        `${data.amount.toLocaleString()} MAD`,
        '',
        ''
      ]],
      footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' }
    });
    
    // Mode de paiement
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Mode de paiement: ${data.paymentMethod}`, 20, finalY);
    doc.text(`Statut: ${data.status}`, 20, finalY + 5);
    
    // Pied de page
    doc.setFontSize(8);
    doc.text("Document généré automatiquement - MarocTactile CRM Hub", 105, 280, { align: 'center' });
    
    const filename = type === 'invoice' ? `Facture_${data.id}_${data.client}.pdf` : `Devis_${data.id}_${data.client}.pdf`;
    doc.save(filename);
    
    return filename;
  } catch (error) {
    console.error("Erreur lors de la génération du PDF:", error);
    toast.error("Erreur lors de la génération du PDF");
    return null;
  }
};

// Fonction pour générer un PDF avec plusieurs éléments
// Fonction pour générer une fiche technique PDF attrayante
export const generateTechnicalSheetPDF = (data: Record<string, unknown>) => {
  try {
    const doc = new jsPDF();

    // Logo et en-tête professionnel
    addProfessionalHeader(doc);

    // Titre principal avec style
    doc.setFillColor(26, 43, 60);
    doc.rect(20, 45, 170, 15, 'F');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.setFont(undefined, 'bold');
    doc.text('FICHE TECHNIQUE PRODUIT', 105, 55, { align: 'center' });

    // Réinitialiser couleur
    doc.setTextColor(0, 0, 0);

    // Section informations principales
    let yPos = 75;
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(26, 43, 60);
    doc.text('INFORMATIONS GÉNÉRALES', 20, yPos);

    // Ligne de séparation
    doc.setDrawColor(64, 224, 208);
    doc.setLineWidth(1);
    doc.line(20, yPos + 2, 190, yPos + 2);

    yPos += 15;
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0, 0, 0);

    // Informations en deux colonnes
    const leftCol = 20;
    const rightCol = 110;

    doc.setFont(undefined, 'bold');
    doc.text('Nom du produit:', leftCol, yPos);
    doc.setFont(undefined, 'normal');
    doc.text(String(data.name || 'Non spécifié'), leftCol + 35, yPos);

    doc.setFont(undefined, 'bold');
    doc.text('Référence:', rightCol, yPos);
    doc.setFont(undefined, 'normal');
    doc.text(String(data.reference || 'N/A'), rightCol + 25, yPos);

    yPos += 10;
    doc.setFont(undefined, 'bold');
    doc.text('Catégorie:', leftCol, yPos);
    doc.setFont(undefined, 'normal');
    doc.text(String(data.category || 'Non spécifiée'), leftCol + 25, yPos);

    doc.setFont(undefined, 'bold');
    doc.text('Prix:', rightCol, yPos);
    doc.setFont(undefined, 'normal');
    doc.text(data.price ? `${Number(data.price).toLocaleString()} MAD` : 'Sur devis', rightCol + 15, yPos);

    // Section description
    yPos += 25;
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(26, 43, 60);
    doc.text('DESCRIPTION', 20, yPos);

    doc.setDrawColor(64, 224, 208);
    doc.line(20, yPos + 2, 190, yPos + 2);

    yPos += 15;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0, 0, 0);

    if (data.description) {
      const splitDescription = doc.splitTextToSize(String(data.description), 170);
      doc.text(splitDescription, 20, yPos);
      yPos += splitDescription.length * 5 + 10;
    } else {
      doc.text('Aucune description disponible.', 20, yPos);
      yPos += 15;
    }

    // Section spécifications techniques
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(26, 43, 60);
    doc.text('SPÉCIFICATIONS TECHNIQUES', 20, yPos);

    doc.setDrawColor(64, 224, 208);
    doc.line(20, yPos + 2, 190, yPos + 2);

    yPos += 15;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0, 0, 0);

    if (data.specifications) {
      const splitSpecs = doc.splitTextToSize(String(data.specifications), 170);
      doc.text(splitSpecs, 20, yPos);
      yPos += splitSpecs.length * 5 + 10;
    } else {
      doc.text('• Dimensions: À spécifier selon le modèle', 20, yPos);
      doc.text('• Alimentation: Selon les normes européennes', 20, yPos + 8);
      doc.text('• Garantie: 2 ans constructeur', 20, yPos + 16);
      doc.text('• Installation: Incluse dans le prix', 20, yPos + 24);
      yPos += 35;
    }

    // Section contact et informations
    yPos = Math.max(yPos, 220);
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPos, 170, 30, 'F');

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(26, 43, 60);
    doc.text('CONTACT & INFORMATIONS', 25, yPos + 10);

    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text('Tel: +212 6 69 38 28 28', 25, yPos + 18);
    doc.text('Email: contact@rachabusiness.com', 25, yPos + 25);
    doc.text('Web: www.rachabusiness.com', 120, yPos + 18);
    doc.text('Adresse: Casablanca, Maroc', 120, yPos + 25);

    // Pied de page avec date
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    const currentDate = new Date().toLocaleDateString('fr-FR');
    doc.text(`Document généré le ${currentDate} - Racha Business Digital CRM`, 105, 280, { align: 'center' });

    const filename = `Fiche_Technique_${String(data.name || 'Produit').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    doc.save(filename);

    toast.success("Fiche technique générée", {
      description: `Fichier ${filename} téléchargé avec succès`
    });

    return filename;
  } catch (error) {
    console.error("Erreur lors de la génération de la fiche technique:", error);
    toast.error("Erreur lors de la génération de la fiche technique");
    return null;
  }
};

// Fonction helper pour l'en-tête professionnel
function addProfessionalHeader(doc: jsPDF) {
  // Logo avec fond
  doc.setFillColor(26, 43, 60);
  doc.roundedRect(20, 10, 50, 20, 3, 3, 'F');

  // Texte du logo
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.setFont(undefined, 'bold');
  doc.text("RACHA", 23, 18);
  doc.text("DIGITAL", 23, 26);

  // Accent
  doc.setFillColor(64, 224, 208);
  doc.circle(65, 20, 2, 'F');

  // Informations entreprise
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.setFont(undefined, 'normal');
  doc.text("Solutions Tactiles & Digitales", 80, 15);
  doc.text("Tel: +212 6 69 38 28 28", 80, 20);
  doc.text("Email: contact@rachabusiness.com", 80, 25);

  // Ligne de séparation
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35);
}

export const generateBulkPDF = (items: Array<Record<string, unknown>>, type: 'invoice' | 'quote') => {
  try {
    const doc = new jsPDF();
    const title = type === 'invoice' ? 'LISTE DES FACTURES' : 'LISTE DES DEVIS';
    
    doc.setFontSize(16);
    doc.text(title, 105, 20, { align: 'center' });
    
    // Date d'impression
    const today = new Date().toLocaleDateString('fr-FR');
    doc.setFontSize(10);
    doc.text(`Date d'impression: ${today}`, 20, 30);
    
    // Tableau des éléments
    const tableColumn = ["N°", "Client", "Date", "Montant (MAD)", "Avance (MAD)", "Reste (MAD)", "Statut"];
    
    const tableRows = items.map(item => [
      item.id,
      item.client,
      item.date,
      item.amount.toLocaleString(),
      item.advanceAmount.toLocaleString(),
      (item.amount - item.advanceAmount).toLocaleString(),
      item.status
    ]);
    
    doc.autoTable({
      startY: 40,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [26, 43, 60], textColor: [255, 255, 255] }
    });
    
    // Pied de page
    doc.setFontSize(8);
    doc.text("Document généré automatiquement - MarocTactile CRM Hub", 105, 280, { align: 'center' });
    
    const filename = type === 'invoice' ? `Liste_Factures_${today}.pdf` : `Liste_Devis_${today}.pdf`;
    doc.save(filename);
    
    return filename;
  } catch (error) {
    console.error("Erreur lors de la génération du PDF:", error);
    toast.error("Erreur lors de la génération du PDF");
    return null;
  }
};
