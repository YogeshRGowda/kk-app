import React from 'react';
import { ReactNode, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Bell, Search, User, LogOut, Menu, ChevronRight, ChevronDown, Home, Package, Blocks, Plus } from 'lucide-react';
import AddProductModal from './AddProductModal';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const openAddProductModal = () => setIsAddProductModalOpen(true);
  const closeAddProductModal = () => setIsAddProductModalOpen(false);

  // Function to generate breadcrumbs based on the current path
  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x: string) => x);
    return (
      <div className="flex items-center space-x-1 text-sm text-gray-600">
        <Link to="/dashboard" className="hover:text-gray-800">Dashboard</Link>
        {/* If the path is not just '/', show the product link before other breadcrumbs */}
        {location.pathname !== '/dashboard' && (
          <>
            <ChevronRight className="w-3 h-3" />
            <Link to="/products" className="hover:text-gray-800">Products</Link>
          </>
        )}
        {pathnames.map((name: string, index: number) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          // Basic mapping for known routes, can be expanded
          let displayName = name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');
          
          // Handle specific route names for display
          if (name === 'products') displayName = 'Products';
          if (name === 'testblocks') displayName = 'Test Blocks';
          // Add more specific name mappings as needed for routes like product IDs or test block IDs

          // Skip 'dashboard' as it's the starting point
          if (name === 'dashboard') return null;

          return isLast ? (
            <span key={name} className="font-semibold">{displayName}</span>
          ) : (
            <React.Fragment key={name}>
              <ChevronRight className="w-3 h-3" />
              <Link to={routeTo} className="hover:text-gray-800">
                {displayName}
              </Link>
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* TIBIL Solutions Logo */}
          <div className="flex items-center gap-2">
            <img src="/tibil-logo.png" alt="TIBIL Solutions Logo" className="w-8 h-8 rounded-lg" />
            <span className="font-semibold text-gray-800">TIBIL Solutions</span>
          </div>
          {/* Breadcrumbs */}
          {generateBreadcrumbs()}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 gap-2">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent border-none outline-none text-sm"
            />
          </div>
          {/* Plus button to open Add Product Modal */}
          <button onClick={openAddProductModal} className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
            <Plus className="w-5 h-5" />
          </button>

          <button className="relative p-2 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5 text-gray-600" />
            {/* Notification dot - replace with actual count */}
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center gap-2">
            <Link to="/profile" className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="text-sm">
                <div className="font-medium">{user?.name || 'User'}</div>
                <div className="text-gray-500 text-xs">{user?.designation || 'User'}</div>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Quality Score in Sidebar */}
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <div className="text-4xl font-bold text-orange-500 mb-1">75%</div>
              <div className="text-sm text-gray-600">Quality Score</div>
            </div>

            {/* Sidebar Navigation */}
            <nav className="space-y-2">
              <Link
                to="/dashboard"
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${location.pathname === '/dashboard' ? 'bg-gray-200 text-gray-800' : 'hover:bg-gray-100 text-gray-700'}`}
              >
                 <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/products"
                 className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${location.pathname.startsWith('/products') && !location.pathname.includes('/testblocks') ? 'bg-gray-200 text-gray-800' : 'hover:bg-gray-100 text-gray-700'}`}
              >
                 <Package className="w-5 h-5" />
                <span>Products</span>
              </Link>
               {/* Test Blocks Link - Conditional rendering or dynamic based on route */}
               {location.pathname.startsWith('/products/') && !location.pathname.includes('/testblocks') && (
                  <Link
                     to={`/products/${location.pathname.split('/')[2]}/testblocks`}
                     className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${location.pathname.includes('/testblocks') ? 'bg-gray-200 text-gray-800' : 'hover:bg-gray-100 text-gray-700'}`}
                  >
                    <Blocks className="w-5 h-5" />
                    <span>Test Blocks</span>
                  </Link>
               )}
               {/* Test Block Detail Link - Conditional rendering */}
               {location.pathname.includes('/testblocks/') && location.pathname.split('/').filter(Boolean).length > 3 && (
                  <Link
                     to={location.pathname}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors bg-gray-200 text-gray-800`}
                  >
                    <Blocks className="w-5 h-5" />
                    <span>Test Block Detail</span>
                  </Link>
               )}
            </nav>
          </div>

          {/* Version Info */}
          <div className="text-xs text-gray-500 text-center">KK App | V 1.0</div>
        </div>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>

      {/* Add Product Modal */}
      <AddProductModal isOpen={isAddProductModalOpen} onClose={closeAddProductModal} />
    </div>
  );
} 