import React, { useState } from 'react';
// Import any necessary icons or components later

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
  const [step, setStep] = useState(1); // 1: Product Details, 2: Test Blocks, 3: Confirm & Create
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    environments: ['Dev'], // Default to Dev as seen in screenshot
    targetQualityScore: 100,
    selectedTestBlocks: [] as number[], // Store IDs of selected test blocks
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Placeholder for fetching available test blocks (if needed for step 2)
  // useEffect(() => { ... }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEnvironmentChange = (environment: string, isChecked: boolean) => {
    setFormData(prev => ({
      ...prev,
      environments: isChecked
        ? [...prev.environments, environment]
        : prev.environments.filter(env => env !== environment),
    }));
  };

  const handleTestBlockSelection = (testBlockId: number, isSelected: boolean) => {
     setFormData(prev => ({
         ...prev.selectedTestBlocks,
         selectedTestBlocks: isSelected
            ? [...prev.selectedTestBlocks, testBlockId]
            : prev.selectedTestBlocks.filter(id => id !== testBlockId)
     }));
  };

  const nextStep = () => { setStep(step + 1); };
  const prevStep = () => { setStep(step - 1); };

  const handleSubmit = async () => {
    // Placeholder for API call to create product
    console.log('Submitting product data:', formData);
    setLoading(true);
    setError('');
    try {
        // await axios.post('/api/products', formData);
        console.log('Product created successfully!');
        onClose(); // Close modal on success
    } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to create product');
    } finally {
        setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Mock data for available test blocks (replace with fetched data)
   const availableTestBlocks = [
       { id: 1, name: 'UI Functional', description: 'Ensures UI/UX elements and workflows behave as expected.'},
       { id: 2, name: 'UI Non-Functional', description: 'Evaluates aspects beyond core functionality.'},
       { id: 3, name: 'API Functional', description: 'Ensures that the API behaves as expected.'},
       { id: 4, name: 'API Non-Functional', description: 'Validates API performance, security, and reliability.'},
       { id: 5, name: 'Security', description: 'Ensures the application is protected against vulnerabilities.'},
        { id: 6, name: 'Infrastructure', description: 'Ensures underlying infrastructure supports the application.'},
        { id: 7, name: '3rd Party Validations', description: 'Ensures external services and integrations function correctly.'},
        { id: 8, name: 'Service Reliability', description: 'Ensures the application and its services consistently deliver expected functionality.'},
         { id: 9, name: 'Smoke Testing', description: 'Verifies core functionalities after deployment.'},
   ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="relative p-8 w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-2xl font-semibold text-gray-800">Add new product</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">&times;</button>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-between items-center mb-6">
          <div className={`flex-1 text-center ${step >= 1 ? 'text-orange-600 font-semibold' : 'text-gray-500'}`}>1. Product Details</div>
          <div className="flex-1 text-center ${step >= 2 ? 'text-orange-600 font-semibold' : 'text-gray-500'}">2. Test Blocks</div>
          <div className={`flex-1 text-center ${step >= 3 ? 'text-orange-600 font-semibold' : 'text-gray-500'}`}>3. Confirm & Create</div>
        </div>

        {/* Error Display */}
        {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

        {/* Modal Body */}
        <div className="modal-body">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="input" placeholder="Product Title" />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} className="input" placeholder="Product Description"></textarea>
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Environments</label>
                <div className="flex items-center gap-4">
                  {['Dev', 'UAT', 'Production'].map(env => (
                    <div key={env} className="flex items-center">
                      <input
                        id={`env-${env}`}
                        type="checkbox"
                        checked={formData.environments.includes(env)}
                        onChange={(e) => handleEnvironmentChange(env, e.target.checked)}
                        className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <label htmlFor={`env-${env}`} className="ml-2 block text-sm text-gray-700">{env}</label>
                    </div>
                  ))}
                   <button className="text-blue-500 hover:text-blue-600 text-sm">+</button>
                </div>
               </div>
               <div>
                 <label htmlFor="targetQualityScore" className="block text-sm font-medium text-gray-700 mb-1">Target Quality Score</label>
                 <input type="number" id="targetQualityScore" name="targetQualityScore" value={formData.targetQualityScore} onChange={handleChange} className="input w-20" min="0" max="100"/>
                  <span className="ml-4 text-sm text-gray-500">Quality Score Formula: 0.4(Coverage Score) + 0.3(Execution score) + 0.3(Execution Success score)</span>
               </div>
            </div>
          )}

          {step === 2 && (
             <div className="space-y-4">
                 <h3 className="text-lg font-semibold mb-2">Select Test Blocks</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {availableTestBlocks.map(block => (
                         <div key={block.id} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                             <input
                                type="checkbox"
                                checked={formData.selectedTestBlocks.includes(block.id)}
                                onChange={(e) => handleTestBlockSelection(block.id, e.target.checked)}
                                className="mt-1 h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                             />
                             <div>
                                 <div className="font-medium text-gray-800">{block.name}</div>
                                 <div className="text-sm text-gray-600">{block.description}</div>
                             </div>
                         </div>
                     ))}
                 </div>
             </div>
          )}

          {step === 3 && (
              <div className="space-y-4">
                 <h3 className="text-lg font-semibold mb-2">Confirm Product Details</h3>
                 {/* Display summary of formData here */}
                 <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p className="text-sm text-gray-700"><span className="font-medium">Title:</span> {formData.title}</p>
                    <p className="text-sm text-gray-700"><span className="font-medium">Description:</span> {formData.description || 'N/A'}</p>
                    <p className="text-sm text-gray-700"><span className="font-medium">Environments:</span> {formData.environments.join(', ')}</p>
                    <p className="text-sm text-gray-700"><span className="font-medium">Target Quality Score:</span> {formData.targetQualityScore}</p>
                     <p className="text-sm text-gray-700"><span className="font-medium">Selected Test Blocks:</span> {formData.selectedTestBlocks.length > 0 ? formData.selectedTestBlocks.join(', ') : 'None'}</p>
                 </div>
                  <div className="text-sm text-gray-600">Review the details before creating the product.</div>
              </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-4 mt-6">
          {step > 1 && (
            <button onClick={prevStep} className="btn btn-secondary">Back</button>
          )}
          {step < 3 && (
            <button onClick={nextStep} className="btn btn-primary" disabled={step === 1 && (!formData.title || formData.environments.length === 0)}>
              Next
            </button>
          )}
          {step === 3 && (
            <button onClick={handleSubmit} className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create'}
            </button>
          )}
          <button onClick={onClose} className="btn btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  );
} 