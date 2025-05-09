
import React, { useState } from "react";
import QRCode from "qrcode.react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { QrCode } from "lucide-react";

interface QRCodeGeneratorProps {
  value?: string;
  type?: "url" | "text" | "product";
  productId?: string;
  showDialog?: boolean;
  size?: number;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ 
  value = "", 
  type = "url", 
  productId = "",
  showDialog = true,
  size = 128
}) => {
  const [qrValue, setQrValue] = useState(value);
  const [qrType, setQrType] = useState<"url" | "text" | "product">(type);
  const [productDetails, setProductDetails] = useState({
    id: productId,
    name: "",
    price: "",
  });
  
  const generateProductQR = () => {
    if (qrType === "product" && productDetails.id) {
      return JSON.stringify({
        id: productDetails.id,
        name: productDetails.name,
        price: productDetails.price,
      });
    }
    return qrValue;
  };
  
  const handleDownload = () => {
    const canvas = document.getElementById("qr-code") as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `qrcode-${qrType}-${Date.now()}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };
  
  const QRCodeContent = () => (
    <CardContent className="flex flex-col items-center justify-center space-y-6">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="qrType">Type de QR Code</Label>
        <Select
          value={qrType}
          onValueChange={(value) => setQrType(value as "url" | "text" | "product")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="url">URL</SelectItem>
            <SelectItem value="text">Texte</SelectItem>
            <SelectItem value="product">Produit</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {qrType === "product" ? (
        <div className="grid w-full max-w-sm gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="productId">ID du produit</Label>
            <Input
              id="productId"
              value={productDetails.id}
              onChange={(e) => setProductDetails({ ...productDetails, id: e.target.value })}
              placeholder="ID du produit"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="productName">Nom du produit</Label>
            <Input
              id="productName"
              value={productDetails.name}
              onChange={(e) => setProductDetails({ ...productDetails, name: e.target.value })}
              placeholder="Nom du produit"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="productPrice">Prix du produit (MAD)</Label>
            <Input
              id="productPrice"
              value={productDetails.price}
              onChange={(e) => setProductDetails({ ...productDetails, price: e.target.value })}
              placeholder="Prix du produit"
              type="number"
            />
          </div>
        </div>
      ) : (
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="qrValue">Valeur</Label>
          <Input
            type="text"
            id="qrValue"
            value={qrValue}
            onChange={(e) => setQrValue(e.target.value)}
            placeholder={qrType === "url" ? "https://example.com" : "Texte à encoder"}
          />
        </div>
      )}

      <div className="flex flex-col items-center justify-center space-y-2 bg-white p-4 rounded-lg">
        {qrType === "product" ? (
          <QRCode
            id="qr-code"
            value={generateProductQR()}
            size={size}
            bgColor="#FFFFFF"
            fgColor="#000000"
            level="H"
            includeMargin={true}
          />
        ) : (
          <QRCode
            id="qr-code"
            value={qrValue || "https://maroctactile.ma"}
            size={size}
            bgColor="#FFFFFF"
            fgColor="#000000"
            level="H"
            includeMargin={true}
          />
        )}
      </div>

      <Button onClick={handleDownload} variant="outline" className="w-full">
        Télécharger QR Code
      </Button>
    </CardContent>
  );
  
  return showDialog ? (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <QrCode className="h-4 w-4" />
          Générer QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Générateur de QR Code</DialogTitle>
        </DialogHeader>
        {QRCodeContent()}
      </DialogContent>
    </Dialog>
  ) : (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Générateur de QR Code</CardTitle>
      </CardHeader>
      {QRCodeContent()}
    </Card>
  );
};

export default QRCodeGenerator;
