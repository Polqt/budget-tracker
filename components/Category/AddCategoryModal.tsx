'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface Category {
  name: string;
  type: string;
  icon: string;
  color: string;
}

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (category: Category) => void;
}

export default function AddCategoryModal({
  isOpen,
  onClose,
}: AddCategoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Add New Category
            <button onClick={onClose}>×</button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Category form would be implemented here...</p>
        </CardContent>
      </Card>
    </div>
  );
}
