import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Plus } from 'lucide-react';

interface TestBlock {
  id: number;
  name: string;
  status: string;
  score: number;
  failures: string[];
  description: string; // Assuming test blocks have descriptions based on screenshots
}

interface Product {
  id: number;
  name: string;
  test_blocks: TestBlock[];
}

export default function TestBlocks() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null); // To get product name and test blocks
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProductWithTestBlocks = async () => {
      try {
        setLoading(true);
        // Assuming the /api/products/{productId} endpoint includes test blocks
        const response = await axios.get(`/api/products/${productId}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch product details');
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductWithTestBlocks();
    }
  }, [productId]);

  if (loading) {
    return <div className="text-center text-gray-500">Loading test blocks...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="text-center text-gray-500">Product not found.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header similar to Dashboard but specific to Test Blocks */}
      <div className="flex items-center justify-between">
         <h1 className="text-xl font-semibold text-gray-800">Test Blocks for {product.name}</h1>
         <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 gap-2">
               <Search className="w-4 h-4 text-gray-500" />
               <input type="text" placeholder="Search Test Blocks" className="bg-transparent border-none outline-none text-sm" />
            </div>
            <button className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
               <Plus className="w-5 h-5" />
            </button>
         </div>
      </div>

      {/* Test Block Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {product.test_blocks.map(block => (
          <Link to={`/products/${productId}/testblocks/${block.id}`} key={block.id} className="block">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer h-full">
              <div className="flex items-center gap-4 mb-4">
                 {/* Icon/Indicator for Test Block Type (Placeholder) */}
                 <div className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    {block.name.charAt(0)}
                 </div>
                 <div>
                    <h3 className="font-semibold text-gray-800 text-lg">{block.name}</h3>
                    {/* Score or Status Summary */}
                    <span className={`text-sm font-bold ${block.status === 'pass' ? 'text-green-600' : 'text-red-600'}`}>
                       {block.status.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">Score: {block.score}</span>
                 </div>
              </div>
              {/* Description/Summary of the Test Block */}
              <p className="text-gray-600 text-sm line-clamp-3">{block.description || 'No description available.'}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 