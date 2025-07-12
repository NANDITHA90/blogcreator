import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { PenTool, Home, Plus } from "lucide-react";

export function Header() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-blue-500 flex items-center justify-center">
            <PenTool className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-brand-600 to-blue-600 bg-clip-text text-transparent">
            QuickBlog
          </span>
        </Link>

        <nav className="flex items-center space-x-1">
          <Button
            variant={isActive("/") ? "default" : "ghost"}
            size="sm"
            asChild
          >
            <Link to="/" className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </Button>

          <Button
            variant={isActive("/create") ? "default" : "ghost"}
            size="sm"
            asChild
          >
            <Link to="/create" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create Post</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
