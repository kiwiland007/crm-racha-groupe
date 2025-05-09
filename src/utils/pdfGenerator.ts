
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
export const generatePDF = (data: any, type: 'invoice' | 'quote') => {
  try {
    const doc = new jsPDF();
    
    // Titre du document
    const title = type === 'invoice' ? 'FACTURE' : 'DEVIS';
    const documentNumber = type === 'invoice' ? data.id : data.id;
    
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
export const generateBulkPDF = (items: any[], type: 'invoice' | 'quote') => {
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
