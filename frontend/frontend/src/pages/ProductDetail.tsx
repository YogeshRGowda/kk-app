import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  env: string;
  quality_score: number;
  coverage_score: number;
  execution_score: number;
  success_score: number;
  description: string;
  test_blocks: any[]; // Use a more specific type later
}

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' or 'testblocks'

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Assuming an API endpoint like /api/products/{productId}
        const response = await axios.get(`/api/products/${productId}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch product details');
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return <div className="text-center text-gray-500">Loading product details...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="text-center text-gray-500">Product not found.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Product Header (similar to dashboard card header) */}
      <div className="bg-white rounded-lg p-6 shadow-sm flex items-center gap-4">
         <div className="w-16 h-16 bg-orange-400 rounded-lg flex items-center justify-center text-white font-bold text-2xl">
           {product.name.charAt(0)}
         </div>
         <div>
           <h1 className="text-2xl font-semibold text-gray-800">{product.name}</h1>
           <div className="text-gray-500">{product.env}</div>
         </div>
         {/* Placeholder for Last Update / Last Test info */}
         <div className="ml-auto text-sm text-gray-600">
             <div>Last Update: [Date]</div>
             <div>Last Test: [Date]</div>
         </div>
      </div>

      {/* Tabs for Overview and Test Blocks */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'testblocks' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('testblocks')}
          >
            Test Blocks
          </button>
        </nav>
      </div>

      {/* Content based on active tab */}
      <div className="px-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {/* Quality Score Card */}
             <div className="bg-white rounded-lg p-6 shadow-sm text-center">
               <div className="text-4xl font-bold text-orange-500 mb-1">{product.quality_score}%</div>
               <div className="text-sm text-gray-600">Quality Score</div>
                <div className="text-xs text-gray-500 mt-1">Goal: 90</div>
             </div>
             {/* Coverage Score Card */}
              <div className="bg-white rounded-lg p-6 shadow-sm text-center">
               <div className="text-4xl font-bold text-green-600 mb-1">{product.coverage_score}%</div>
               <div className="text-sm text-gray-600">Coverage Score</div>
             </div>
             {/* Execution Score Card */}
              <div className="bg-white rounded-lg p-6 shadow-sm text-center">
               <div className="text-4xl font-bold text-orange-500 mb-1">{product.execution_score}%</div>
               <div className="text-sm text-gray-600">Execution Score</div>
             </div>
             {/* Success Score Card */}
              <div className="bg-white rounded-lg p-6 shadow-sm text-center">
               <div className="text-4xl font-bold text-green-600 mb-1">{product.success_score}%</div>
               <div className="text-sm text-gray-600">Success Score</div>
             </div>
          </div>
        )}

        {activeTab === 'testblocks' && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            {/* Placeholder for Test Blocks Diagram/List */}
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Test Blocks Diagram</h2>
            <div className="bg-gray-100 h-96 flex items-center justify-center rounded-lg">
               <span className="text-gray-500">Diagram Visualization Placeholder</span>
            </div>
            {/* Could also list test blocks here or have another sub-navigation */}
          </div>
        )}
      </div>
    </div>
  );
} 