import CategoriesContent from './CategoriesContent';
import CategoriesHeader from './CategoriesHeader';
import CategoriesList from './CategoriesList';
import CategoriesTip from './CategoriesTip';

export default function Categories() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <CategoriesHeader />
        <CategoriesContent />
        <CategoriesList />
        <CategoriesTip />
      </div>
    </div>
  );
}
