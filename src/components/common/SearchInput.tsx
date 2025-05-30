import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchInputProps {
  placeholder?: string;
  onSearch: (term: string) => void;
  className?: string;
  debounceMs?: number;
  showClearButton?: boolean;
  initialValue?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "Rechercher...",
  onSearch,
  className = "",
  debounceMs = 300,
  showClearButton = true,
  initialValue = ""
}) => {
  const [searchValue, setSearchValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchValue, debounceMs]);

  // Call onSearch when debounced value changes
  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleClear = () => {
    setSearchValue("");
    setDebouncedValue("");
    onSearch("");
  };

  return (
    <div className={`relative w-full max-w-sm ${className}`}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
      <Input
        type="search"
        placeholder={placeholder}
        className="pl-8 pr-8 bg-white border-gray-200 w-full"
        value={searchValue}
        onChange={handleSearchChange}
      />
      {showClearButton && searchValue && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1 h-6 w-6 text-gray-400 hover:text-gray-600"
          onClick={handleClear}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};

export default SearchInput;
