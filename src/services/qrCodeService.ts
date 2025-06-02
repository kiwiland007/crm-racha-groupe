/**
 * Service unifié pour la génération de QR codes
 * Harmonise les QR codes entre inventaire et produits
 */

export interface QRCodeData {
  id: string;
  name: string;
  category: string;
  price?: string | { sale: string; rental: string };
  status?: string;
  location?: string;
  sku?: string;
  url?: string;
  type: 'product' | 'inventory' | 'equipment';
}

/**
 * Service de génération de QR codes unifié
 */
class QRCodeService {
  
  /**
   * Génère les données standardisées pour un QR code produit
   */
  public generateProductQRData(product: any): QRCodeData {
    const baseUrl = window.location.origin;
    
    return {
      id: product.id,
      name: product.name,
      category: product.category,
      price: typeof product.price === 'string' ? product.price : product.price?.sale || '0',
      sku: product.sku || product.reference || `REF-${product.id}`,
      url: `${baseUrl}/products/${product.id}`,
      type: 'product'
    };
  }

  /**
   * Génère les données standardisées pour un QR code inventaire
   */
  public generateInventoryQRData(item: any): QRCodeData {
    const baseUrl = window.location.origin;
    
    return {
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price || '0',
      status: item.status,
      location: item.location,
      url: `${baseUrl}/inventory/${item.id}`,
      type: 'inventory'
    };
  }

  /**
   * Génère les données standardisées pour un QR code équipement
   */
  public generateEquipmentQRData(equipment: any): QRCodeData {
    const baseUrl = window.location.origin;
    
    return {
      id: equipment.id,
      name: equipment.name,
      category: equipment.category,
      price: equipment.price || '0',
      status: equipment.status,
      location: equipment.location,
      url: `${baseUrl}/inventory/${equipment.id}`,
      type: 'equipment'
    };
  }

  /**
   * Convertit les données QR en JSON standardisé
   */
  public formatQRContent(data: QRCodeData): string {
    return JSON.stringify({
      id: data.id,
      name: data.name,
      category: data.category,
      price: data.price,
      status: data.status,
      location: data.location,
      sku: data.sku,
      url: data.url,
      type: data.type,
      timestamp: new Date().toISOString(),
      company: "Racha Business Group"
    });
  }

  /**
   * Génère un contenu QR lisible par humain
   */
  public formatQRContentHuman(data: QRCodeData): string {
    let content = `${data.name}\n`;
    content += `ID: ${data.id}\n`;
    content += `Catégorie: ${data.category}\n`;
    
    if (data.sku) {
      content += `SKU: ${data.sku}\n`;
    }
    
    if (data.price) {
      const priceText = typeof data.price === 'string' ? data.price : data.price.sale;
      content += `Prix: ${priceText} MAD\n`;
    }
    
    if (data.status) {
      content += `Statut: ${data.status}\n`;
    }
    
    if (data.location) {
      content += `Localisation: ${data.location}\n`;
    }
    
    if (data.url) {
      content += `URL: ${data.url}\n`;
    }
    
    content += `\nRacha Business Group`;
    
    return content;
  }

  /**
   * Génère le nom de fichier pour le QR code
   */
  public generateQRFilename(data: QRCodeData): string {
    const safeName = data.name.replace(/[^a-zA-Z0-9]/g, '_');
    const date = new Date().toISOString().split('T')[0];
    return `QR_${data.type}_${safeName}_${date}.png`;
  }

  /**
   * Génère un QR code pour un produit (format unifié)
   */
  public generateProductQR(product: any): {
    data: QRCodeData;
    jsonContent: string;
    humanContent: string;
    filename: string;
  } {
    const data = this.generateProductQRData(product);
    
    return {
      data,
      jsonContent: this.formatQRContent(data),
      humanContent: this.formatQRContentHuman(data),
      filename: this.generateQRFilename(data)
    };
  }

  /**
   * Génère un QR code pour un élément d'inventaire (format unifié)
   */
  public generateInventoryQR(item: any): {
    data: QRCodeData;
    jsonContent: string;
    humanContent: string;
    filename: string;
  } {
    const data = this.generateInventoryQRData(item);
    
    return {
      data,
      jsonContent: this.formatQRContent(data),
      humanContent: this.formatQRContentHuman(data),
      filename: this.generateQRFilename(data)
    };
  }

  /**
   * Génère un QR code pour un équipement (format unifié)
   */
  public generateEquipmentQR(equipment: any): {
    data: QRCodeData;
    jsonContent: string;
    humanContent: string;
    filename: string;
  } {
    const data = this.generateEquipmentQRData(equipment);
    
    return {
      data,
      jsonContent: this.formatQRContent(data),
      humanContent: this.formatQRContentHuman(data),
      filename: this.generateQRFilename(data)
    };
  }

  /**
   * Valide les données QR
   */
  public validateQRData(data: any): boolean {
    return !!(data && data.id && data.name && data.type);
  }

  /**
   * Parse un contenu QR JSON
   */
  public parseQRContent(content: string): QRCodeData | null {
    try {
      const parsed = JSON.parse(content);
      if (this.validateQRData(parsed)) {
        return parsed as QRCodeData;
      }
      return null;
    } catch (error) {
      console.error('Erreur parsing QR content:', error);
      return null;
    }
  }

  /**
   * Génère une URL de QR code via API externe (fallback)
   */
  public generateQRUrl(content: string, size: number = 300): string {
    const encodedContent = encodeURIComponent(content);
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedContent}`;
  }

  /**
   * Télécharge un QR code via URL
   */
  public downloadQRFromUrl(url: string, filename: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Instance singleton
export const qrCodeService = new QRCodeService();

// Export des types
export type { QRCodeData };
