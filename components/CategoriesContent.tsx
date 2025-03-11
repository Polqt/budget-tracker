import { Card, CardContent } from './ui/card';

export default function CategoriesContent() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-center">
      <Card className="shadow-md bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-gray-6 mb-1">Total Categories</div>
            <p className="text-3xl font-bold">
              {/* TODO: Replace this on the next step with the actual number of categories */}
              0
            </p>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-md bg-gradient-to-r from-green-50 to-teal-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-gray-6 mb-1">Expense Categories</div>
            <p className="text-3xl font-bold">
              {/* TODO: Replace this on the next step with the actual number of categories */}
              0
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
