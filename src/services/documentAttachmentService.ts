import { toast } from "sonner";
import { eventReportPDFService, EventReportData } from "./eventReportPDFService";
import { pdfServiceFixed, PDFQuoteData } from "./pdfServiceFixed";
import { bonLivraisonService, BonLivraisonData } from "./bonLivraisonService";

export interface AttachmentOptions {
  includeEventReport?: boolean;
  eventData?: EventReportData;
  attachToInvoice?: boolean;
  attachToBL?: boolean;
}

/**
 * Service pour gérer les pièces jointes de documents
 * Permet d'attacher des rapports d'événements aux factures et BL
 */
class DocumentAttachmentService {
  
  /**
   * Génère une facture avec rapport d'événement attaché
   */
  public generateInvoiceWithEventReport(
    invoiceData: PDFQuoteData, 
    eventData: EventReportData,
    options: AttachmentOptions = {}
  ): { invoiceFilename: string | null; reportFilename: string | null } {
    try {
      console.log("=== GÉNÉRATION FACTURE AVEC RAPPORT ÉVÉNEMENT ===");
      
      let invoiceFilename: string | null = null;
      let reportFilename: string | null = null;

      // Générer la facture
      invoiceFilename = pdfServiceFixed.generateQuotePDF(invoiceData, 'invoice');
      
      // Générer le rapport d'événement si demandé
      if (options.includeEventReport && eventData) {
        reportFilename = eventReportPDFService.generateEventReport(eventData);
      }

      if (invoiceFilename && reportFilename) {
        toast.success("Documents générés avec succès", {
          description: `Facture et rapport d'événement téléchargés`,
          action: {
            label: "Voir détails",
            onClick: () => {
              toast.info("Documents générés", {
                description: `Facture: ${invoiceFilename}\nRapport: ${reportFilename}`
              });
            }
          }
        });
      } else if (invoiceFilename) {
        toast.success("Facture générée", {
          description: `Fichier ${invoiceFilename} téléchargé`
        });
      }

      return { invoiceFilename, reportFilename };
    } catch (error) {
      console.error("Erreur génération facture avec rapport:", error);
      toast.error("Erreur génération documents", {
        description: `Erreur: ${error.message || 'Erreur inconnue'}`
      });
      return { invoiceFilename: null, reportFilename: null };
    }
  }

  /**
   * Génère un BL avec rapport d'événement attaché
   */
  public generateBLWithEventReport(
    blData: BonLivraisonData,
    eventData: EventReportData,
    options: AttachmentOptions = {}
  ): { blFilename: string | null; reportFilename: string | null } {
    try {
      console.log("=== GÉNÉRATION BL AVEC RAPPORT ÉVÉNEMENT ===");
      
      let blFilename: string | null = null;
      let reportFilename: string | null = null;

      // Générer le BL
      blFilename = bonLivraisonService.generateBonLivraisonPDF(blData);
      
      // Générer le rapport d'événement si demandé
      if (options.includeEventReport && eventData) {
        reportFilename = eventReportPDFService.generateEventReport(eventData);
      }

      if (blFilename && reportFilename) {
        toast.success("Documents générés avec succès", {
          description: `Bon de livraison et rapport d'événement téléchargés`,
          action: {
            label: "Voir détails",
            onClick: () => {
              toast.info("Documents générés", {
                description: `BL: ${blFilename}\nRapport: ${reportFilename}`
              });
            }
          }
        });
      } else if (blFilename) {
        toast.success("Bon de livraison généré", {
          description: `Fichier ${blFilename} téléchargé`
        });
      }

      return { blFilename, reportFilename };
    } catch (error) {
      console.error("Erreur génération BL avec rapport:", error);
      toast.error("Erreur génération documents", {
        description: `Erreur: ${error.message || 'Erreur inconnue'}`
      });
      return { blFilename: null, reportFilename: null };
    }
  }

  /**
   * Génère un package complet de documents pour un événement
   */
  public generateEventDocumentPackage(
    eventData: EventReportData,
    invoiceData?: PDFQuoteData,
    blData?: BonLivraisonData
  ): {
    reportFilename: string | null;
    invoiceFilename: string | null;
    blFilename: string | null;
  } {
    try {
      console.log("=== GÉNÉRATION PACKAGE COMPLET ÉVÉNEMENT ===");
      
      let reportFilename: string | null = null;
      let invoiceFilename: string | null = null;
      let blFilename: string | null = null;

      // Générer le rapport d'événement
      reportFilename = eventReportPDFService.generateEventReport(eventData);

      // Générer la facture si fournie
      if (invoiceData) {
        invoiceFilename = pdfServiceFixed.generateQuotePDF(invoiceData, 'invoice');
      }

      // Générer le BL si fourni
      if (blData) {
        blFilename = bonLivraisonService.generateBonLivraisonPDF(blData);
      }

      // Compter les documents générés
      const generatedDocs = [reportFilename, invoiceFilename, blFilename].filter(Boolean);
      
      if (generatedDocs.length > 0) {
        toast.success("Package de documents généré", {
          description: `${generatedDocs.length} document(s) téléchargé(s) pour l'événement ${eventData.title}`,
          action: {
            label: "Voir détails",
            onClick: () => {
              const details = [];
              if (reportFilename) details.push(`Rapport: ${reportFilename}`);
              if (invoiceFilename) details.push(`Facture: ${invoiceFilename}`);
              if (blFilename) details.push(`BL: ${blFilename}`);
              
              toast.info("Documents générés", {
                description: details.join('\n')
              });
            }
          }
        });
      }

      return { reportFilename, invoiceFilename, blFilename };
    } catch (error) {
      console.error("Erreur génération package événement:", error);
      toast.error("Erreur génération package", {
        description: `Erreur: ${error.message || 'Erreur inconnue'}`
      });
      return { reportFilename: null, invoiceFilename: null, blFilename: null };
    }
  }

  /**
   * Génère un rapport d'événement formaté pour être attaché à une facture
   */
  public generateEventReportForInvoice(
    eventData: EventReportData,
    invoiceId: string
  ): string | null {
    try {
      // Ajouter des informations de liaison avec la facture
      const enhancedEventData: EventReportData = {
        ...eventData,
        notes: `${eventData.notes || ''}\n\nCe rapport est associé à la facture ${invoiceId}.`.trim()
      };

      return eventReportPDFService.generateEventReport(enhancedEventData);
    } catch (error) {
      console.error("Erreur génération rapport pour facture:", error);
      return null;
    }
  }

  /**
   * Génère un rapport d'événement formaté pour être attaché à un BL
   */
  public generateEventReportForBL(
    eventData: EventReportData,
    blId: string
  ): string | null {
    try {
      // Ajouter des informations de liaison avec le BL
      const enhancedEventData: EventReportData = {
        ...eventData,
        notes: `${eventData.notes || ''}\n\nCe rapport est associé au bon de livraison ${blId}.`.trim()
      };

      return eventReportPDFService.generateEventReport(enhancedEventData);
    } catch (error) {
      console.error("Erreur génération rapport pour BL:", error);
      return null;
    }
  }

  /**
   * Vérifie si un événement peut être lié à une facture ou un BL
   */
  public canAttachEventToDocument(
    eventData: EventReportData,
    documentType: 'invoice' | 'bl'
  ): boolean {
    // Vérifications de base
    if (!eventData.id || !eventData.title || !eventData.client) {
      return false;
    }

    // Vérifications spécifiques selon le type de document
    switch (documentType) {
      case 'invoice':
        // Pour une facture, on vérifie qu'il y a du matériel ou des services
        return !!(eventData.reservedMaterials?.length || eventData.budget);
      
      case 'bl':
        // Pour un BL, on vérifie qu'il y a du matériel à livrer
        return !!(eventData.reservedMaterials?.length);
      
      default:
        return false;
    }
  }

  /**
   * Génère un nom de fichier cohérent pour les documents liés
   */
  public generateLinkedFilename(
    eventId: string,
    documentType: 'invoice' | 'bl' | 'report',
    clientName: string
  ): string {
    const cleanClientName = clientName.replace(/[^a-zA-Z0-9]/g, '_');
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    
    switch (documentType) {
      case 'invoice':
        return `Facture_${eventId}_${cleanClientName}_${timestamp}.pdf`;
      case 'bl':
        return `BL_${eventId}_${cleanClientName}_${timestamp}.pdf`;
      case 'report':
        return `Rapport_${eventId}_${cleanClientName}_${timestamp}.pdf`;
      default:
        return `Document_${eventId}_${cleanClientName}_${timestamp}.pdf`;
    }
  }
}

// Instance singleton
export const documentAttachmentService = new DocumentAttachmentService();

// Export des types
export type { AttachmentOptions };
