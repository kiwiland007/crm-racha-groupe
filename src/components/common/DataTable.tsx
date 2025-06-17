import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Filter,
  Download,
  Plus
} from 'lucide-react';

// Types pour le composant DataTable
export interface Column<T> {
  key: keyof T | string;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: T[keyof T], item: T, index: number) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface FilterOption {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  filterable?: boolean;
  filterOptions?: FilterOption[];
  sortable?: boolean;
  paginated?: boolean;
  pageSize?: number;
  exportable?: boolean;
  addable?: boolean;
  onAdd?: () => void;
  onExport?: () => void;
  onRowClick?: (item: T, index: number) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  title,
  searchable = true,
  searchPlaceholder = "Rechercher...",
  filterable = false,
  filterOptions = [],
  sortable = true,
  paginated = true,
  pageSize = 10,
  exportable = false,
  addable = false,
  onAdd,
  onExport,
  onRowClick,
  loading = false,
  emptyMessage = "Aucune donnée disponible",
  className = "",
}: DataTableProps<T>) {
  
  // État local
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  
  // Données filtrées et triées
  const processedData = useMemo(() => {
    let result = [...data];
    
    // Recherche
    if (searchTerm && searchable) {
      result = result.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    // Filtres
    if (filterable && Object.keys(filters).length > 0) {
      result = result.filter(item => {
        return Object.entries(filters).every(([key, value]) => {
          if (!value) return true;
          return String(item[key]) === value;
        });
      });
    }
    
    // Tri
    if (sortConfig && sortable) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return result;
  }, [data, searchTerm, sortConfig, filters, searchable, filterable, sortable]);
  
  // Pagination
  const paginatedData = useMemo(() => {
    if (!paginated) return processedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return processedData.slice(startIndex, endIndex);
  }, [processedData, currentPage, pageSize, paginated]);
  
  const totalPages = Math.ceil(processedData.length / pageSize);
  
  // Handlers
  const handleSort = (key: string) => {
    if (!sortable) return;
    
    setSortConfig(current => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { key, direction: 'asc' };
    });
  };
  
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1); // Reset à la première page
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Rendu d'une cellule
  const renderCell = (column: Column<T>, item: T, index: number) => {
    const value = item[column.key as keyof T];
    
    if (column.render) {
      return column.render(value, item, index);
    }
    
    // Rendu par défaut selon le type
    if (typeof value === 'boolean') {
      return (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Oui' : 'Non'}
        </Badge>
      );
    }
    
    if (value instanceof Date) {
      return value.toLocaleDateString('fr-FR');
    }
    
    if (typeof value === 'number') {
      return value.toLocaleString('fr-FR');
    }
    
    return String(value || '');
  };
  
  return (
    <Card className={className}>
      {/* En-tête */}
      {(title || searchable || filterable || exportable || addable) && (
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {title && <CardTitle>{title}</CardTitle>}
            
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {/* Recherche */}
              {searchable && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
              )}
              
              {/* Filtres */}
              {filterable && filterOptions.map(option => (
                <Select
                  key={option.key}
                  value={filters[option.key] || ''}
                  onValueChange={(value) => handleFilterChange(option.key, value)}
                >
                  <SelectTrigger className="w-full sm:w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder={option.label} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous</SelectItem>
                    {option.options.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ))}
              
              {/* Actions */}
              <div className="flex gap-2">
                {exportable && (
                  <Button variant="outline" size="sm" onClick={onExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                )}
                
                {addable && (
                  <Button size="sm" onClick={onAdd}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      )}
      
      {/* Contenu */}
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : paginatedData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {emptyMessage}
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((column, index) => (
                      <TableHead
                        key={index}
                        className={`
                          ${column.width ? `w-${column.width}` : ''}
                          ${column.align === 'center' ? 'text-center' : ''}
                          ${column.align === 'right' ? 'text-right' : ''}
                          ${column.sortable && sortable ? 'cursor-pointer hover:bg-gray-50' : ''}
                        `}
                        onClick={() => column.sortable && handleSort(String(column.key))}
                      >
                        <div className="flex items-center gap-2">
                          {column.title}
                          {column.sortable && sortable && sortConfig?.key === column.key && (
                            <span className="text-xs">
                              {sortConfig.direction === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((item, index) => (
                    <TableRow
                      key={index}
                      className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
                      onClick={() => onRowClick?.(item, index)}
                    >
                      {columns.map((column, colIndex) => (
                        <TableCell
                          key={colIndex}
                          className={`
                            ${column.align === 'center' ? 'text-center' : ''}
                            ${column.align === 'right' ? 'text-right' : ''}
                          `}
                        >
                          {renderCell(column, item, index)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination */}
            {paginated && totalPages > 1 && (
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-500">
                  Affichage de {((currentPage - 1) * pageSize) + 1} à{' '}
                  {Math.min(currentPage * pageSize, processedData.length)} sur{' '}
                  {processedData.length} résultats
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <span className="text-sm">
                    Page {currentPage} sur {totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
