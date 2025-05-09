
import React from "react";
import { Badge } from "@/components/ui/badge";

interface ProductAvailabilityBadgeProps {
  availability: string;
}

const ProductAvailabilityBadge: React.FC<ProductAvailabilityBadgeProps> = ({ availability }) => {
  switch (availability) {
    case "en_stock":
      return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">En stock</Badge>;
    case "sur_commande":
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Sur commande</Badge>;
    case "rupture":
      return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Rupture de stock</Badge>;
    default:
      return <Badge variant="outline">{availability}</Badge>;
  }
};

export default ProductAvailabilityBadge;
