import { useState, useEffect } from 'react';
import { ChevronDown, MoreHorizontal, Search, Plus, Home } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

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

interface TestBlock {
  id: number;
  name: string;
  status: string;
  score: number;
  failures: string[];
}

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6); // Number of products per page as seen in the design
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(fetchProducts, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [currentPage]); // Refetch when page changes

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/products?page=${currentPage}&page_size=${productsPerPage}`);
      setProducts(response.data.products);
      setTotalProducts(response.data.total);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products');
      setLoading(false);
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Render page numbers
  const renderPaginationNumbers = () => {
    const pageNumbers = [];
    // Display current page and a few around it
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <Link to={`/products/${product.id}`} key={product.id} className="block">
            <div
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer h-full"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-orange-400 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  {product.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">{product.name}</h3>
                  <div className="text-sm text-gray-500">{product.env}</div>
                </div>
              </div>

              <div className="flex items-end justify-between mb-4">
                 <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-orange-500">{product.quality_score}</span>
                    <span className="text-sm text-gray-600">Quality Score</span>
                 </div>
                 <div className="text-xs text-gray-500 flex flex-col items-end">
                    <span>Coverage: {product.coverage_score}</span>
                    <span>Execution: {product.execution_score}</span>
                    <span>Success: {product.success_score}</span>
                 </div>
              </div>

              <p className="text-gray-600 text-sm line-clamp-3">{product.description}</p>

              {/* Test Block Summary (Optional based on space/design) */}
               {/* <div className="mt-4">
                <div className="font-semibold text-sm mb-2">Test Blocks:</div>
                <ul className="space-y-1">
                  {product.test_blocks.slice(0, 2).map(block => (
                    <li key={block.id} className="flex items-center gap-2 text-xs text-gray-600">
                       <span
                        className={`w-2 h-2 rounded-full ${block.status === 'pass' ? 'bg-green-500' : 'bg-red-500'}`}
                      ></span>
                      {block.name}
                    </li>
                  ))}
                   {product.test_blocks.length > 2 && (
                      <li className="text-xs text-gray-500">+{product.test_blocks.length - 2} more test blocks</li>
                   )}
                </ul>
              </div> */}

            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
       {totalPages > 1 && (
         <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => paginate(1)}
            disabled={currentPage === 1}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{'<<'}</span>
          </button>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{'<'}</span>
          </button>

          {renderPaginationNumbers().map(number => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-3 py-1 rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
            >
              {String(number).padStart(2, '0')}
            </button>
          ))}

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{'>'}</span>
          </button>
          <button
            onClick={() => paginate(totalPages)}
            disabled={currentPage === totalPages}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{'>>'}</span>
          </button>
        </div>
       )}
    </div>
  );
} 