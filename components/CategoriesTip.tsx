import { Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export default function CategoriesTip() {
  return (
    <div className="mt-8">
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-none shadow-md">
        <CardHeader>
          <CardTitle className="text-lg text-green-700">
            <div className="flex items-center gap-2">
              <Circle className="h-5 w-5 fill-green-100 text-green-600" />
              Quick Tip
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700/75">
            Organizing your expenses into categories helps you identify spending
            patterns and stick to your budget more effectively. Try to limit
            your categories to 10-15 to keep things manageable.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
