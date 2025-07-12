import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BlogPost } from "@/lib/supabase";
import {
  Search,
  Filter,
  X,
  Calendar,
  Tag,
  TrendingUp,
  Clock,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type SortOption = "newest" | "oldest" | "popular" | "alphabetical";
export type FilterOptions = {
  searchTerm: string;
  selectedTags: string[];
  dateRange: "all" | "today" | "week" | "month" | "year";
  sortBy: SortOption;
  status: "all" | "published" | "draft";
};

interface BlogFiltersProps {
  posts: BlogPost[];
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  className?: string;
}

export function BlogFilters({
  posts,
  filters,
  onFiltersChange,
  className,
}: BlogFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Extract all unique tags from posts
  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags)))
    .sort()
    .slice(0, 20); // Limit to most common tags

  // Get tag counts
  const tagCounts = allTags.reduce(
    (acc, tag) => {
      acc[tag] = posts.filter((post) => post.tags.includes(tag)).length;
      return acc;
    },
    {} as Record<string, number>,
  );

  const sortOptions: { value: SortOption; label: string; icon: any }[] = [
    { value: "newest", label: "Newest First", icon: SortDesc },
    { value: "oldest", label: "Oldest First", icon: SortAsc },
    { value: "popular", label: "Most Popular", icon: TrendingUp },
    { value: "alphabetical", label: "A-Z", icon: SortAsc },
  ];

  const dateOptions = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" },
  ] as const;

  const handleSearchChange = (searchTerm: string) => {
    onFiltersChange({ ...filters, searchTerm });
  };

  const handleTagToggle = (tag: string) => {
    const selectedTags = filters.selectedTags.includes(tag)
      ? filters.selectedTags.filter((t) => t !== tag)
      : [...filters.selectedTags, tag];
    onFiltersChange({ ...filters, selectedTags });
  };

  const handleDateRangeChange = (dateRange: FilterOptions["dateRange"]) => {
    onFiltersChange({ ...filters, dateRange });
  };

  const handleSortChange = (sortBy: SortOption) => {
    onFiltersChange({ ...filters, sortBy });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      searchTerm: "",
      selectedTags: [],
      dateRange: "all",
      sortBy: "newest",
      status: "all",
    });
  };

  const hasActiveFilters =
    filters.searchTerm ||
    filters.selectedTags.length > 0 ||
    filters.dateRange !== "all" ||
    filters.sortBy !== "newest";

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.selectedTags.length > 0) count++;
    if (filters.dateRange !== "all") count++;
    if (filters.sortBy !== "newest") count++;
    return count;
  };

  return (
    <Card className={cn("border-0 bg-white/60 backdrop-blur-sm", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </CardTitle>
          <div className="flex space-x-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs"
              >
                Clear All
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="lg:hidden"
            >
              {isExpanded ? "Hide" : "Show"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent
        className={cn("space-y-4", !isExpanded && "hidden lg:block")}
      >
        {/* Search */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search posts, content, or tags..."
              value={filters.searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
            {filters.searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSearchChange("")}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        <Separator />

        {/* Sort Options */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>Sort By</span>
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {sortOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Button
                  key={option.value}
                  variant={
                    filters.sortBy === option.value ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => handleSortChange(option.value)}
                  className="justify-start"
                >
                  <Icon className="h-3 w-3 mr-2" />
                  {option.label}
                </Button>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Date Range */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>Date Range</span>
          </h4>
          <div className="flex flex-wrap gap-1">
            {dateOptions.map((option) => (
              <Button
                key={option.value}
                variant={
                  filters.dateRange === option.value ? "default" : "outline"
                }
                size="sm"
                onClick={() => handleDateRangeChange(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Tags */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center space-x-1">
            <Tag className="h-4 w-4" />
            <span>Tags</span>
            {filters.selectedTags.length > 0 && (
              <Badge variant="secondary">{filters.selectedTags.length}</Badge>
            )}
          </h4>

          {/* Selected Tags */}
          {filters.selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {filters.selectedTags.map((tag) => (
                <Badge
                  key={tag}
                  className="cursor-pointer bg-brand-100 text-brand-800 hover:bg-brand-200"
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          )}

          {/* Available Tags */}
          <div className="max-h-32 overflow-y-auto">
            <div className="flex flex-wrap gap-1">
              {allTags
                .filter((tag) => !filters.selectedTags.includes(tag))
                .map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-brand-50 hover:border-brand-300"
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                    <span className="ml-1 text-xs text-muted-foreground">
                      {tagCounts[tag]}
                    </span>
                  </Badge>
                ))}
            </div>
          </div>
        </div>

        {/* Filter Summary */}
        {hasActiveFilters && (
          <>
            <Separator />
            <div className="text-xs text-muted-foreground">
              <div className="space-y-1">
                {filters.searchTerm && (
                  <div>Search: "{filters.searchTerm}"</div>
                )}
                {filters.selectedTags.length > 0 && (
                  <div>Tags: {filters.selectedTags.join(", ")}</div>
                )}
                {filters.dateRange !== "all" && (
                  <div>
                    Date:{" "}
                    {
                      dateOptions.find((d) => d.value === filters.dateRange)
                        ?.label
                    }
                  </div>
                )}
                {filters.sortBy !== "newest" && (
                  <div>
                    Sort:{" "}
                    {sortOptions.find((s) => s.value === filters.sortBy)?.label}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
