import { Card, CardContent } from '../ui/card';
import { Tag } from 'lucide-react';

interface EmptyStateProps {
  hasSearch: boolean;
  onAdd: () => void;
}

export default function EmptyState({ hasSearch, onAdd }: EmptyStateProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Tag className="w-8 h-8 text-gray-500" />
          </div>
          <p className="text-gray-600 font-medium">No categories found</p>
          <p className="text-sm text-gray-500 mt-1">
            {hasSearch
              ? 'Try adjusting your search terms'
              : 'Create your first category to get started'}
          </p>
          {!hasSearch && (
            <button
              onClick={onAdd}
              className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Add Category
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
