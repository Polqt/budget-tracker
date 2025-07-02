'use client';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import CategoryStats from '@/components/Category/CategoryStats';
import CategoryFilter from '@/components/Category/CategoryFilter';
import CategoryCard from '@/components/Category/CategoryCard';
import EmptyState from '@/components/Category/EmptyState';
import AddCategoryModal from '@/components/Category/AddCategoryModal';

export default function Categories() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const categories = [
    /* same dummy data as before */
  ];

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      activeFilter === 'all' || category.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleAddCategory = categoryData => {
    console.log('Adding category:', categoryData);
  };

  const handleEditCategory = id => {
    console.log('Editing category:', id);
  };

  const handleDeleteCategory = id => {
    console.log('Deleting category:', id);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-1">
            Manage your income and expense categories
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      <CategoryStats categories={categories} />
      <CategoryFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map(category => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={handleEditCategory}
              onDelete={handleDeleteCategory}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          hasSearch={!!searchTerm}
          onAdd={() => setShowAddForm(true)}
        />
      )}

      <AddCategoryModal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onAdd={handleAddCategory}
      />
    </div>
  );
}
