import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, Smile, Meh, Frown } from 'lucide-react';

interface TestBlockDetailData {
  id: number;
  name: string;
  status: string;
  score: number;
  failures: string[];
  description: string;
  architecture_block?: string;
  last_update?: string;
  last_test?: string;
  details?: {
    features?: { id: string; name: string; totalTestCases: number; qualityIndicator: 'green' | 'orange' | 'red'; criticalFailures: number; nonCriticalFailures: number; }[];
    flows?: { id: string; name: string; totalTestCases: number; qualityIndicator: 'green' | 'orange' | 'red'; criticalFailures: number; nonCriticalFailures: number; }[];
    runs?: { id: string; name: string; date: string; totalTestCases: number; qualityIndicator: 'green' | 'orange' | 'red'; criticalFailures: number; nonCriticalFailures: number; }[];
    test_cases?: { id: string; name: string; priority: 'High' | 'Medium' | 'Low'; cost: 'High' | 'Medium' | 'Low'; executionMode: 'Automated' | 'Manual'; executionStatus: 'Done' | 'Pending'; status: 'Pass' | 'Fail'; lastTest: string; }[];
  };
  settings?: {
      git_repository?: string;
      enable_ai_generation?: boolean;
  }
  coverage_score?: number;
  execution_score?: number;
  success_score?: number;
}

export default function TestBlockDetail() {
  const { productId, testBlockId } = useParams<{ productId: string; testBlockId: string }>();
  const [testBlock, setTestBlock] = useState<TestBlockDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [activeDetailsView, setActiveDetailsView] = useState('features');


  useEffect(() => {
    const fetchTestBlockDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/products/${productId}/testblocks/${testBlockId}`);
        setTestBlock(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch test block details');
        setLoading(false);
      }
    };

    if (productId && testBlockId) {
      fetchTestBlockDetail();
    }
  }, [productId, testBlockId]);

  const getQualityIndicatorIcon = (indicator: 'green' | 'orange' | 'red') => {
    switch (indicator) {
      case 'green': return <Smile className="w-5 h-5 text-green-500" />;
      case 'orange': return <Meh className="w-5 h-5 text-orange-500" />;
      case 'red': return <Frown className="w-5 h-5 text-red-500" />;
      default: return null;
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading test block details...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!testBlock) {
    return <div className="text-center text-gray-500">Test block not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 bg-white rounded-lg p-6 shadow-sm">
        <Link to={`/products/${productId}/testblocks`} className="text-gray-600 hover:text-gray-800">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">{testBlock.name}</h1>
          <div className="text-sm text-gray-500">Product ID: {productId}</div>
        </div>
        <div className="ml-auto text-sm text-gray-600 flex gap-4">
          {testBlock.architecture_block && <div>Architecture Block: {testBlock.architecture_block}</div>}
          {testBlock.last_update && <div>Last Update: {testBlock.last_update}</div>}
          {testBlock.last_test && <div>Last Test: {testBlock.last_test}</div>}
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'settings' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </nav>
      </div>

      <div className="px-6 py-6 bg-white rounded-lg shadow-sm">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm text-center">
              <div className="text-4xl font-bold text-orange-500 mb-1">{testBlock.score}%</div>
              <div className="text-sm text-gray-600">Quality Score</div>
              <div className="text-xs text-gray-500 mt-1">Goal: 95</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm text-center">
              <div className="text-4xl font-bold text-green-600 mb-1">{testBlock.coverage_score ?? '--'}%</div>
              <div className="text-sm text-gray-600">Coverage</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm text-center">
              <div className="text-4xl font-bold text-orange-500 mb-1">{testBlock.execution_score ?? '--'}%</div>
              <div className="text-sm text-gray-600">Execution</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm text-center">
              <div className="text-4xl font-bold text-green-600 mb-1">{testBlock.success_score ?? '--'}%</div>
              <div className="text-sm text-gray-600">Success</div>
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="space-y-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Details Views">
                <button
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${activeDetailsView === 'features' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  onClick={() => setActiveDetailsView('features')}
                >
                  Views: Features
                </button>
                <button
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${activeDetailsView === 'flows' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  onClick={() => setActiveDetailsView('flows')}
                >
                  Views: Flows
                </button>
                <button
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${activeDetailsView === 'runs' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  onClick={() => setActiveDetailsView('runs')}
                >
                  Views: Runs
                </button>
                <button
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${activeDetailsView === 'test_cases' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  onClick={() => setActiveDetailsView('test_cases')}
                >
                  Views: Test Cases
                </button>
              </nav>
            </div>

            <div>
              {activeDetailsView === 'features' && (testBlock.details?.features ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Features</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Test Cases</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quality Indicator</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {testBlock.details.features.map(feature => (
                        <tr key={feature.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{feature.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{feature.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{feature.totalTestCases}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 flex justify-center">
                            {getQualityIndicatorIcon(feature.qualityIndicator)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {feature.criticalFailures > 0 && <span className="text-red-600 font-medium">{feature.criticalFailures} Critical Failures</span>}
                            {feature.criticalFailures > 0 && feature.nonCriticalFailures > 0 && <span>, </span>}
                            {feature.nonCriticalFailures > 0 && <span className="text-orange-600 font-medium">{feature.nonCriticalFailures} Non-critical Failures</span>}
                            {feature.criticalFailures === 0 && feature.nonCriticalFailures === 0 && <span>No Failures</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (<div className="bg-gray-100 p-4 rounded-lg text-gray-500 text-center">No Features data available.</div>))}

              {activeDetailsView === 'flows' && (testBlock.details?.flows ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flows</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Test Cases</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quality Indicator</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {testBlock.details.flows.map(flow => (
                        <tr key={flow.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{flow.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{flow.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{flow.totalTestCases}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 flex justify-center">
                            {getQualityIndicatorIcon(flow.qualityIndicator)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {flow.criticalFailures > 0 && <span className="text-red-600 font-medium">{flow.criticalFailures} Critical Failures</span>}
                            {flow.criticalFailures > 0 && flow.nonCriticalFailures > 0 && <span>, </span>}
                            {flow.nonCriticalFailures > 0 && <span className="text-orange-600 font-medium">{flow.nonCriticalFailures} Non-critical Failures</span>}
                            {flow.criticalFailures === 0 && flow.nonCriticalFailures === 0 && <span>No Failures</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (<div className="bg-gray-100 p-4 rounded-lg text-gray-500 text-center">No Flows data available.</div>))}

              {activeDetailsView === 'runs' && (testBlock.details?.runs ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Runs</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Test Cases</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quality Indicator</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {testBlock.details.runs.map(run => (
                        <tr key={run.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{run.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{run.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{run.totalTestCases}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 flex justify-center">
                            {getQualityIndicatorIcon(run.qualityIndicator)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {run.criticalFailures > 0 && <span className="text-red-600 font-medium">{run.criticalFailures} Critical Failures</span>}
                            {run.criticalFailures > 0 && run.nonCriticalFailures > 0 && <span>, </span>}
                            {run.nonCriticalFailures > 0 && <span className="text-orange-600 font-medium">{run.nonCriticalFailures} Non-critical Failures</span>}
                            {run.criticalFailures === 0 && run.nonCriticalFailures === 0 && <span>No Failures</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (<div className="bg-gray-100 p-4 rounded-lg text-gray-500 text-center">No Runs data available.</div>))}

              {activeDetailsView === 'test_cases' && (testBlock.details?.test_cases ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Cases</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Execution Mode</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Execution Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Test</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {testBlock.details.test_cases.map(testCase => (
                        <tr key={testCase.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{testCase.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{testCase.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{testCase.priority}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{testCase.cost}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{testCase.executionMode}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{testCase.executionStatus}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${testCase.status === 'Pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {testCase.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{testCase.lastTest}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (<div className="bg-gray-100 p-4 rounded-lg text-gray-500 text-center">No Test Cases data available.</div>))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">GIT Repository</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="git-repo" className="block text-sm font-medium text-gray-700 mb-1">GIT Repository Link</label>
                <input
                  id="git-repo"
                  type="text"
                  value={testBlock.settings?.git_repository || ''}
                  onChange={(e) => { /* Handle change */ }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Add the connected GIT repository link here"
                />
              </div>
              <div className="flex items-center">
                <input
                  id="ai-generation"
                  type="checkbox"
                  checked={testBlock.settings?.enable_ai_generation || false}
                  onChange={(e) => { /* Handle change */ }}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="ai-generation" className="ml-2 block text-sm text-gray-700">
                  Enable AI generation of test cases/test scripts
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 