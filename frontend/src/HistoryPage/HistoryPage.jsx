import React, { useState, useEffect, useCallback } from 'react';
import { getHistory, deleteHistory, exportHistory } from '../api/apiService';
import { useNavigate } from 'react-router-dom';
import './HistoryPage.css'; // Keep this for the fade-in animation
import { Trash2, MailOpen } from 'lucide-react';

// --- No changes needed for this component ---
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-400"></div>
  </div>
);

// --- No changes needed for this component ---
const MessageDisplay = ({ message }) => {
  if (!message) return null;
  const isError = message.toLowerCase().includes('failed');
  return (
    <div className={`p-4 mb-6 rounded-md text-center font-medium shadow-md transition-all duration-300
      ${isError ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-green-100 text-green-700 border border-green-300'}`}>
      {message}
    </div>
  );
};

const HistoryPage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchHistory = useCallback(async () => {
    try {
      setMessage('');
      setLoading(true);
      const data = await getHistory();
      // Sort history from newest to oldest
      setHistory(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      setMessage('Failed to load your history. Please try refreshing the page.');

    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleClearHistory = async () => {
    // A more user-friendly confirmation dialog
    if (window.confirm('Are you absolutely sure you want to delete your entire analysis history? This action cannot be undone.')) {
      try {
        setLoading(true); // Provide visual feedback during deletion
        const res = await deleteHistory();
        setMessage(res.msg || 'History cleared successfully!');
        setHistory([]);
      } catch (error) {
        setMessage('Failed to clear history. Please try again.');

      } finally {
        setLoading(false);
      }
    }
  };

  const handleExportHistory = async () => {
    try {
      setMessage('Initiating export... Please wait.');
      const res = await exportHistory();
      setMessage(res.msg || 'History export initiated! Please check your email inbox (and spam folder).');
    } catch (error) {
      setMessage('Failed to export history. Please try again.');

    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    // Responsive padding for the entire page
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header with responsive typography */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-pink-500 mb-2 tracking-tight">Your Skin Analysis History</h1>
          <p className="text-md sm:text-lg text-gray-600 max-w-2xl mx-auto">Review, manage, and export your previous predictions.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button onClick={() => navigate('/dashboard')} className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full font-semibold hover:bg-pink-200 transition text-sm shadow-sm">
              📊 View Dashboard
            </button>
            <button onClick={() => navigate('/recommendations')} className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-semibold hover:bg-purple-200 transition text-sm shadow-sm">
              🧬 Recommendations
            </button>
            <button onClick={() => navigate('/routine')} className="px-4 py-2 bg-teal-100 text-teal-700 rounded-full font-semibold hover:bg-teal-200 transition text-sm shadow-sm">
              🗓️ My Routine
            </button>
          </div>
        </div>

        {/* Message Display - already responsive */}
        <MessageDisplay message={message} />

        {/* Action Buttons: Stacks on mobile, row on larger screens */}
        <div className="flex flex-col sm:flex-row justify-end items-center gap-3 sm:gap-4 mb-8 md:mb-12">
          <button
            onClick={handleExportHistory}
            disabled={history.length === 0 || loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 sm:py-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:bg-gray-300 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed"
          >
            <MailOpen className="text-lg" />
            <span>Export to Email</span>
          </button>
          <button
            onClick={handleClearHistory}
            disabled={history.length === 0 || loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 sm:py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-full transition-colors disabled:bg-gray-300/70 disabled:text-gray-500 disabled:cursor-not-allowed"
          >
            <Trash2 className="text-md" />
            <span>Clear All History</span>
          </button>
        </div>

        {/* Content Area */}
        {history.length === 0 && !loading ? (
          // Empty State Card
          <div className="text-center p-8 sm:p-12 bg-white border-2 border-dashed border-pink-200 rounded-2xl shadow-sm">
            <h3 className="text-2xl font-semibold text-pink-600">No History Found</h3>
            <p className="text-gray-500 mt-2">Your past skin analyses will appear here once you upload a photo.</p>
          </div>
        ) : (
          // Grid layout for history items, responsive columns
          <div className="grid gap-6 md:gap-8">
            {history.map((item, index) => (
              <div
                key={item._id}
                className="history-item-fade-in bg-white border border-gray-200/80 shadow-md hover:shadow-lg hover:border-pink-200 rounded-2xl p-4 sm:p-5 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  {/* Responsive Image */}
                  <img
                    src={item.imageUrl}
                    alt="Analyzed skin"
                    className="w-full h-48 sm:w-32 sm:h-32 md:w-36 md:h-36 object-cover rounded-xl border-2 border-pink-100 shadow-sm flex-shrink-0"
                  />
                  <div className="flex-1 w-full">
                    {/* Header of the card item */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center w-full mb-2">
                      <span className="text-xl font-bold text-pink-500 order-2 sm:order-1">{item.prediction}</span>
                      <span className="text-xs sm:text-sm font-medium text-white bg-pink-400 px-3 py-1 rounded-full shadow-sm order-1 sm:order-2 self-start sm:self-center mb-2 sm:mb-0">
                        {(item.confidence * 100).toFixed(1)}% Confidence
                      </span>
                    </div>
                    {/* Details section */}
                    <p className="text-sm text-gray-500 mb-3">
                      Analyzed on:{" "}
                      <span className="font-medium text-gray-700">
                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </p>
                    <p className="text-gray-700 leading-relaxed text-sm md:text-base">{item.info}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;