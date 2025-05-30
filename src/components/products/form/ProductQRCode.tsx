
import React from "react";
import QRCodeGenerator from "../../common/QRCodeGenerator";

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
  return (
    <div className="flex justify-end">
      <QRCodeGenerator
        type="product"
        productId={productId}
        value={JSON.stringify({
          id: productId,
          name: productName,
          price: productPrice,
        })}
        showDialog={true}
        size={128}
      />
    </div>
  );
};

export default ProductQRCode;
