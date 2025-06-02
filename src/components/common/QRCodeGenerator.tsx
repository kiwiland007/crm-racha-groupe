
import React, { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

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
  const qrRef = useRef<SVGSVGElement>(null);

  const handleDownloadQR = () => {
    try {
      if (qrRef.current) {
        // Convertir le SVG en canvas puis en image
        const svgData = new XMLSerializer().serializeToString(qrRef.current);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        canvas.width = size;
        canvas.height = size;

        img.onload = () => {
          if (ctx) {
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);

            // Télécharger l'image
            const url = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = url;
            link.download = `qr-${type || "code"}-${productId || "default"}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success("QR Code téléchargé", {
              description: `Fichier qr-${type || "code"}-${productId || "default"}.png téléchargé`
            });
          }
        };

        img.src = "data:image/svg+xml;base64," + btoa(svgData);
      }
    } catch (error) {
      console.error("Erreur lors du téléchargement du QR Code:", error);
      toast.error("Erreur de téléchargement", {
        description: "Impossible de télécharger le QR Code"
      });
    }
  };

  const qrCode = (
    <div className={`qr-code-container ${className}`}>
      <QRCodeSVG
        ref={qrRef}
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
