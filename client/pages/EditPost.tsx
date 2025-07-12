import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit3 } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export default function EditPost() {
  const { slug } = useParams();

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </Button>

        <h1 className="text-3xl font-bold">Edit Post</h1>
        <p className="text-muted-foreground mt-2">
          Update your blog post: {slug}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Edit3 className="h-5 w-5" />
            <span>Coming Soon</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="h-24 w-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center">
              <Edit3 className="h-12 w-12 text-brand-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Post Editing Form</h3>
            <p className="text-muted-foreground mb-4">
              This feature will be implemented in the next phase, allowing you
              to modify existing posts with real-time preview and version
              history.
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" asChild>
                <Link to={`/post/${slug}`}>View Post</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/">All Posts</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
