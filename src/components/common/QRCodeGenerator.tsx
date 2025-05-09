
import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  level?: "L" | "M" | "Q" | "H";
  includeMargin?: boolean;
  className?: string;
  productId?: string;
  type?: string;
  showDialog?: boolean;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  value,
  size = 128,
  level = "L",
  includeMargin = false,
  className = "",
  productId,
  type,
  showDialog = false,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(showDialog);
  
  const handleDownloadQR = () => {
    const canvas = document.getElementById(`qr-canvas-${productId || "default"}`) as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      link.download = `qr-${type || "code"}-${productId || "default"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const qrCode = (
    <div className={`qr-code-container ${className}`}>
      <QRCodeSVG
        id={`qr-canvas-${productId || "default"}`}
        value={value}
        size={size}
        level={level}
        includeMargin={includeMargin}
      />
    </div>
  );

  return showDialog ? (
    <>
      <Button 
        variant="outline" 
        className="flex gap-2" 
        onClick={() => setIsDialogOpen(true)}
      >
        Afficher le QR Code
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>QR Code {productId}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-4">
            {qrCode}
            <Button 
              variant="outline" 
              onClick={handleDownloadQR} 
              className="flex gap-2 mt-2"
            >
              <Download size={16} />
              Télécharger
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  ) : qrCode;
};

export default QRCodeGenerator;
