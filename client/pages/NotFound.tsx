import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-brand-50/30 to-purple-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="text-center px-4">
        <div className="h-32 w-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-brand-100 to-purple-200 flex items-center justify-center">
          <Search className="h-16 w-16 text-brand-600" />
        </div>
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/" className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/create" className="flex items-center space-x-2">
              <span>Create a Post</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;