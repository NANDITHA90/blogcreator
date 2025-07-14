import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "./ui/button";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  placeholder?: string;
}

export function SearchBar({ searchTerm, onSearchChange, placeholder = "Search..." }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 pr-10 bg-white/80 backdrop-blur-sm border-brand-200 focus:border-brand-400"
      />
      {searchTerm && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSearchChange("")}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}