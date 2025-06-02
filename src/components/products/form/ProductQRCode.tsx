
import React from "react";
import QRCodeGenerator from "../../common/QRCodeGenerator";
import { qrCodeService } from "@/services/qrCodeService";

interface ProductQRCodeProps {
  productId: string;
  productName: string;
  productPrice: { sale: string; rental: string };
}

const ProductQRCode: React.FC<ProductQRCodeProps> = ({
  productId,
  productName,
  productPrice,
}) => {
  // Créer un objet produit temporaire pour le service QR
  const tempProduct = {
    id: productId,
    name: productName,
    price: productPrice,
    category: "Produit", // Valeur par défaut
    sku: `SKU-${productId}`
  };

  // Générer le QR avec le service unifié
  const qrResult = qrCodeService.generateProductQR(tempProduct);

  return (
    <div className="flex justify-end">
      <QRCodeGenerator
        type="product"
        productId={productId}
        value={qrResult.jsonContent}
        showDialog={true}
        size={128}
      />
    </div>
  );
};

export default ProductQRCode;
