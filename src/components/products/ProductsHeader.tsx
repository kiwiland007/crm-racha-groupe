
import React, { useState } from "react";
import { Filter, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProductSearch from "./ProductSearch";
import { useProductContext } from "@/contexts/ProductContext";

interface ProductsHeaderProps {
  onAddProduct: () => void;
  onSearch: (term: string) => void;
  onFilter?: (filters: FilterOptions) => void;
}

interface FilterOptions {
  category?: string;
  availability?: string;
  priceRange?: string;
}

const ProductsHeader: React.FC<ProductsHeaderProps> = ({ onAddProduct, onSearch, onFilter }) => {
  const { categories } = useProductContext();
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({});

  // Filtrer les catégories de produits de manière sécurisée
  const productCategories = React.useMemo(() => {
    return categories?.filter(cat => cat?.type === "product") || [];
  }, [categories]);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...activeFilters };
    if (newFilters[key] === value) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    setActiveFilters(newFilters);
    onFilter?.(newFilters);
  };

  const clearFilters = () => {
    setActiveFilters({});
    onFilter?.({});
  };

  const getFilterCount = () => {
    return Object.keys(activeFilters).length;
  };

  const getCategoryName = (categoryId: string) => {
    const category = productCategories.find(cat => cat?.id === categoryId);
    return category?.name || categoryId;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
          <ProductSearch onSearch={onSearch} />

          {/* Filtres rapides */}
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 relative">
                  <Filter size={16} />
                  Catégorie
                  {activeFilters.category && (
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-blue-600 rounded-full"></div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuLabel>Catégories</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => handleFilterChange("category", "")}
                  className={!activeFilters.category ? "bg-blue-50" : ""}
                >
                  Toutes les catégories
                  {!activeFilters.category && (
                    <Badge variant="secondary" className="ml-auto">✓</Badge>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {productCategories.map((category) => (
                  <DropdownMenuItem
                    key={category.id}
                    onClick={() => handleFilterChange("category", category.id)}
                    className={activeFilters.category === category.id ? "bg-blue-50" : ""}
                  >
                    {category.name}
                    {activeFilters.category === category.id && (
                      <Badge variant="secondary" className="ml-auto">✓</Badge>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 relative">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  Stock
                  {activeFilters.availability && (
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-blue-600 rounded-full"></div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel>Disponibilité</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => handleFilterChange("availability", "")}
                  className={!activeFilters.availability ? "bg-blue-50" : ""}
                >
                  Tous les stocks
                  {!activeFilters.availability && (
                    <Badge variant="secondary" className="ml-auto">✓</Badge>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleFilterChange("availability", "en_stock")}
                  className={activeFilters.availability === "en_stock" ? "bg-blue-50" : ""}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    En stock
                  </div>
                  {activeFilters.availability === "en_stock" && (
                    <Badge variant="secondary" className="ml-auto">✓</Badge>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFilterChange("availability", "sur_commande")}
                  className={activeFilters.availability === "sur_commande" ? "bg-blue-50" : ""}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                    Sur commande
                  </div>
                  {activeFilters.availability === "sur_commande" && (
                    <Badge variant="secondary" className="ml-auto">✓</Badge>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFilterChange("availability", "rupture")}
                  className={activeFilters.availability === "rupture" ? "bg-blue-50" : ""}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    Rupture de stock
                  </div>
                  {activeFilters.availability === "rupture" && (
                    <Badge variant="secondary" className="ml-auto">✓</Badge>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 relative">
                  💰 Prix
                  {activeFilters.priceRange && (
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-blue-600 rounded-full"></div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel>Gamme de prix</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => handleFilterChange("priceRange", "")}
                  className={!activeFilters.priceRange ? "bg-blue-50" : ""}
                >
                  Tous les prix
                  {!activeFilters.priceRange && (
                    <Badge variant="secondary" className="ml-auto">✓</Badge>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleFilterChange("priceRange", "0-20000")}
                  className={activeFilters.priceRange === "0-20000" ? "bg-blue-50" : ""}
                >
                  💚 0 - 20,000 MAD
                  {activeFilters.priceRange === "0-20000" && (
                    <Badge variant="secondary" className="ml-auto">✓</Badge>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFilterChange("priceRange", "20000-50000")}
                  className={activeFilters.priceRange === "20000-50000" ? "bg-blue-50" : ""}
                >
                  💛 20,000 - 50,000 MAD
                  {activeFilters.priceRange === "20000-50000" && (
                    <Badge variant="secondary" className="ml-auto">✓</Badge>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFilterChange("priceRange", "50000+")}
                  className={activeFilters.priceRange === "50000+" ? "bg-blue-50" : ""}
                >
                  💎 50,000+ MAD
                  {activeFilters.priceRange === "50000+" && (
                    <Badge variant="secondary" className="ml-auto">✓</Badge>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Bouton de réinitialisation */}
            {getFilterCount() > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X size={16} />
                Effacer ({getFilterCount()})
              </Button>
            )}
          </div>
        </div>
        <Button className="gap-2 w-full lg:w-auto" onClick={onAddProduct}>
          <Plus size={16} />
          Nouveau produit
        </Button>
      </div>

      {/* Résumé des filtres actifs */}
      {getFilterCount() > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-blue-800">
              <Filter size={16} />
              <span className="font-medium">
                {getFilterCount()} filtre{getFilterCount() > 1 ? 's' : ''} actif{getFilterCount() > 1 ? 's' : ''}:
              </span>
              <div className="flex flex-wrap gap-1">
                {activeFilters.category && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {getCategoryName(activeFilters.category)}
                  </span>
                )}
                {activeFilters.availability && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {activeFilters.availability === "en_stock" ? "En stock" :
                     activeFilters.availability === "sur_commande" ? "Sur commande" : "Rupture"}
                  </span>
                )}
                {activeFilters.priceRange && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {activeFilters.priceRange === "0-20000" ? "0-20K MAD" :
                     activeFilters.priceRange === "20000-50000" ? "20K-50K MAD" : "50K+ MAD"}
                  </span>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-700 h-6 px-2"
            >
              Tout effacer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsHeader;
