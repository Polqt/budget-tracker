import { Search } from 'lucide-react';

interface CategoryFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeFilter: 'all' | 'income' | 'expense';
  setActiveFilter: (filter: 'all' | 'income' | 'expense') => void;
}

export default function CategoryFilter({
  searchTerm,
  setSearchTerm,
  activeFilter,
  setActiveFilter,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search categories..."
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex gap-2">
        {(
          ['all', 'income', 'expense'] as Array<'all' | 'income' | 'expense'>
        ).map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeFilter === filter
                ? `text-white ${
                    filter === 'income'
                      ? 'bg-green-600'
                      : filter === 'expense'
                      ? 'bg-red-600'
                      : 'bg-blue-600'
                  }`
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
