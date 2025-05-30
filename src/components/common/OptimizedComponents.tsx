import React, { memo, useMemo, useCallback, lazy, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { type Contact, type Product, type Quote } from '@/types';

// Composant de loading optimisé
export const LoadingSkeleton: React.FC<{ 
  lines?: number; 
  className?: string;
  variant?: 'card' | 'table' | 'list';
}> = memo(({ lines = 3, className, variant = 'card' }) => {
  const skeletonLines = useMemo(() => 
    Array.from({ length: lines }, (_, i) => (
      <Skeleton key={i} className="h-4 w-full mb-2" />
    )), [lines]
  );

  if (variant === 'card') {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          {skeletonLines}
        </CardContent>
      </Card>
    );
  }

  if (variant === 'table') {
    return (
      <div className={className}>
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="flex space-x-4 mb-4">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      {skeletonLines}
    </div>
  );
});

LoadingSkeleton.displayName = 'LoadingSkeleton';

// Composant Contact optimisé avec memo
interface ContactCardProps {
  contact: Contact;
  onEdit?: (contact: Contact) => void;
  onDelete?: (id: string) => void;
  onView?: (contact: Contact) => void;
}

export const ContactCard: React.FC<ContactCardProps> = memo(({
  contact,
  onEdit,
  onDelete,
  onView
}) => {
  const handleEdit = useCallback(() => {
    onEdit?.(contact);
  }, [contact, onEdit]);

  const handleDelete = useCallback(() => {
    onDelete?.(contact.id);
  }, [contact.id, onDelete]);

  const handleView = useCallback(() => {
    onView?.(contact);
  }, [contact, onView]);

  const statusColor = useMemo(() => {
    switch (contact.status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, [contact.status]);

  const typeColor = useMemo(() => {
    switch (contact.type) {
      case 'client': return 'bg-blue-100 text-blue-800';
      case 'prospect': return 'bg-yellow-100 text-yellow-800';
      case 'supplier': return 'bg-purple-100 text-purple-800';
      case 'partner': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, [contact.type]);

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">{contact.name}</CardTitle>
            {contact.company && (
              <p className="text-sm text-muted-foreground mt-1">{contact.company}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Badge className={statusColor}>{contact.status}</Badge>
            <Badge className={typeColor}>{contact.type}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-medium">Email:</span> {contact.email}
          </p>
          <p className="text-sm">
            <span className="font-medium">Téléphone:</span> {contact.phone}
          </p>
          {contact.address && (
            <p className="text-sm">
              <span className="font-medium">Adresse:</span> {contact.address}
            </p>
          )}
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={handleView}>
            Voir
          </Button>
          <Button variant="outline" size="sm" onClick={handleEdit}>
            Modifier
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            Supprimer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

ContactCard.displayName = 'ContactCard';

// Composant Product optimisé
interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
  onView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = memo(({
  product,
  onEdit,
  onDelete,
  onView
}) => {
  const handleEdit = useCallback(() => {
    onEdit?.(product);
  }, [product, onEdit]);

  const handleDelete = useCallback(() => {
    onDelete?.(product.id);
  }, [product.id, onDelete]);

  const handleView = useCallback(() => {
    onView?.(product);
  }, [product, onView]);

  const availabilityColor = useMemo(() => {
    switch (product.availability) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      case 'discontinued': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, [product.availability]);

  const stockStatus = useMemo(() => {
    if (product.stock.quantity <= product.stock.minQuantity) {
      return { label: 'Stock faible', color: 'bg-orange-100 text-orange-800' };
    }
    if (product.stock.quantity === 0) {
      return { label: 'Rupture', color: 'bg-red-100 text-red-800' };
    }
    return { label: 'En stock', color: 'bg-green-100 text-green-800' };
  }, [product.stock.quantity, product.stock.minQuantity]);

  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: product.price.currency,
    }).format(product.price.sale);
  }, [product.price.sale, product.price.currency]);

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">{product.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">SKU: {product.sku}</p>
          </div>
          <div className="flex gap-2">
            <Badge className={availabilityColor}>{product.availability}</Badge>
            <Badge className={stockStatus.color}>{stockStatus.label}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm line-clamp-2">{product.description}</p>
          <p className="text-lg font-semibold text-primary">{formattedPrice}</p>
          <p className="text-sm">
            <span className="font-medium">Stock:</span> {product.stock.quantity} unités
          </p>
          <p className="text-sm">
            <span className="font-medium">Catégorie:</span> {product.category}
          </p>
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={handleView}>
            Voir
          </Button>
          <Button variant="outline" size="sm" onClick={handleEdit}>
            Modifier
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            Supprimer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

ProductCard.displayName = 'ProductCard';

// Composant Quote optimisé
interface QuoteCardProps {
  quote: Quote;
  onEdit?: (quote: Quote) => void;
  onDelete?: (id: string) => void;
  onView?: (quote: Quote) => void;
  onConvert?: (quote: Quote) => void;
}

export const QuoteCard: React.FC<QuoteCardProps> = memo(({
  quote,
  onEdit,
  onDelete,
  onView,
  onConvert
}) => {
  const handleEdit = useCallback(() => {
    onEdit?.(quote);
  }, [quote, onEdit]);

  const handleDelete = useCallback(() => {
    onDelete?.(quote.id);
  }, [quote.id, onDelete]);

  const handleView = useCallback(() => {
    onView?.(quote);
  }, [quote, onView]);

  const handleConvert = useCallback(() => {
    onConvert?.(quote);
  }, [quote, onConvert]);

  const statusColor = useMemo(() => {
    switch (quote.status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, [quote.status]);

  const formattedTotal = useMemo(() => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
    }).format(quote.total);
  }, [quote.total]);

  const isExpired = useMemo(() => {
    return new Date() > quote.expiresAt;
  }, [quote.expiresAt]);

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Devis #{quote.id}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{quote.client}</p>
          </div>
          <div className="flex gap-2">
            <Badge className={statusColor}>{quote.status}</Badge>
            {isExpired && <Badge className="bg-red-100 text-red-800">Expiré</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm line-clamp-2">{quote.description}</p>
          <p className="text-lg font-semibold text-primary">{formattedTotal}</p>
          <p className="text-sm">
            <span className="font-medium">Articles:</span> {quote.items.length}
          </p>
          <p className="text-sm">
            <span className="font-medium">Expire le:</span>{' '}
            {quote.expiresAt.toLocaleDateString('fr-FR')}
          </p>
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={handleView}>
            Voir
          </Button>
          <Button variant="outline" size="sm" onClick={handleEdit}>
            Modifier
          </Button>
          {quote.status === 'accepted' && (
            <Button variant="default" size="sm" onClick={handleConvert}>
              Convertir
            </Button>
          )}
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            Supprimer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

QuoteCard.displayName = 'QuoteCard';

// Hook pour la virtualisation des listes
export const useVirtualization = <T,>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );

    return {
      startIndex,
      endIndex,
      items: items.slice(startIndex, endIndex),
      totalHeight: items.length * itemHeight,
      offsetY: startIndex * itemHeight,
    };
  }, [items, itemHeight, containerHeight, scrollTop]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    handleScroll,
  };
};

// Composant de liste virtualisée
interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  height: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export const VirtualizedList = <T,>({
  items,
  itemHeight,
  height,
  renderItem,
  className
}: VirtualizedListProps<T>) => {
  const { visibleItems, handleScroll } = useVirtualization(items, itemHeight, height);

  return (
    <div
      className={className}
      style={{ height, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: visibleItems.totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${visibleItems.offsetY}px)` }}>
          {visibleItems.items.map((item, index) =>
            renderItem(item, visibleItems.startIndex + index)
          )}
        </div>
      </div>
    </div>
  );
};
