import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Product {
  id: number;
  name: string;
  description?: string;
  test_type?: string;
  testing_by?: string;
  start_date?: string;
  base_url?: string;
}

export interface TestCase {
  id: number;
  test_id: string;
  title: string;
  description?: string;
  preconditions?: string;
  steps?: string;
  expected?: string;
  actual?: string;
  status?: string;
  priority?: string;
  assigned_to?: string;
  comments?: string;
  project_id: number;
}

export const apiService = {
  // Products
  getProducts: async (): Promise<Product[]> => {
    const response = await api.get('/products');
    return response.data;
  },

  createProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const response = await api.post('/products', product);
    return response.data;
  },

  updateProduct: async (id: number, product: Partial<Product>): Promise<Product> => {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
  },

  // Test Cases
  getTestCases: async (projectId: number): Promise<TestCase[]> => {
    const response = await api.get(`/manual-test-cases?project_id=${projectId}`);
    return response.data;
  },

  createTestCase: async (testCase: Omit<TestCase, 'id'>): Promise<TestCase> => {
    const response = await api.post('/manual-test-cases', testCase);
    return response.data;
  },

  updateTestCase: async (id: number, testCase: Partial<TestCase>): Promise<TestCase> => {
    const response = await api.put(`/manual-test-cases/${id}`, testCase);
    return response.data;
  },

  deleteTestCase: async (id: number): Promise<void> => {
    await api.delete(`/manual-test-cases/${id}`);
  },
}; 