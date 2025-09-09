import React from 'react';
import { Plus, X } from 'lucide-react';

interface TestBlock {
  id: number;
  name: string;
  status: string;
  score: number;
  failures: string[];
}

interface Product {
  id: number;
  name: string;
  env: string;
  quality_score: number;
  coverage_score: number;
  execution_score: number;
  success_score: number;
  description: string;
  test_blocks: TestBlock[];
}

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  error: string;
  onAddProduct: () => void;
  onProductClick: (product: Product) => void;
  showAddProduct: boolean;
  setShowAddProduct: (show: boolean) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, loading, error, onAddProduct, onProductClick, showAddProduct, setShowAddProduct }) => (
  <div className="flex-1 p-6">
    <div className="flex justify-between items-center mb-6">
      <div className="relative">
        {/* Environment filter and search will go here */}
      </div>
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-600"
        onClick={onAddProduct}
      >
        <Plus className="w-4 h-4" />
        Add Product
      </button>
    </div>
    {showAddProduct && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Add Product</h3>
            <button onClick={() => setShowAddProduct(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* Add product form will go here */}
        </div>
      </div>
    )}
    {loading ? (
      <div>Loading products...</div>
    ) : error ? (
      <div className="text-red-500">{error}</div>
    ) : (
      <div className="grid grid-cols-2 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onProductClick(product)}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 bg-orange-400 rounded-lg flex items-center justify-center text-white font-bold text-lg`}>
                {product.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{product.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-orange-400">{product.quality_score}</span>
                  <span className="text-sm text-gray-500">Quality Score</span>
                </div>
              </div>
            </div>
            <div className="mb-2">
              <span className="text-xs text-gray-500">Env: {product.env}</span>
            </div>
            <div className="mb-2">
              <span className="text-xs text-gray-500">Coverage: {product.coverage_score} | Execution: {product.execution_score} | Success: {product.success_score}</span>
            </div>
            <div className="mt-4">
              <div className="font-semibold text-sm mb-2">Test Blocks:</div>
              <ul className="space-y-2">
                {product.test_blocks.map((block) => (
                  <li key={block.id} className="flex items-center gap-3 p-2 rounded border border-gray-100 bg-gray-50">
                    <span className={`w-3 h-3 rounded-full ${block.status === 'pass' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span className="font-medium text-gray-700">{block.name}</span>
                    <span className="text-xs text-gray-500">Score: {block.score}</span>
                    <span className={`text-xs font-bold ${block.status === 'pass' ? 'text-green-600' : 'text-red-600'}`}>{block.status.toUpperCase()}</span>
                    {block.failures && block.failures.length > 0 && (
                      <span className="text-xs text-red-500 ml-2">Failures: {block.failures.join(', ')}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    )}
    {/* Pagination controls will go here */}
  </div>
);

export default ProductGrid; 