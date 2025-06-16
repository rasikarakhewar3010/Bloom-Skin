import React, { useState, useEffect, useCallback } from 'react';
import { getHistory, deleteHistory, exportHistory } from '../api/apiService';
import './HistoryPage.css'; // Keep this for animations if needed
import { FaTrashAlt, FaEnvelopeOpenText } from 'react-icons/fa';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-400 border-b-4"></div>
  </div>
);

const MessageDisplay = ({ message }) => {
  if (!message) return null;
  const isError = message.toLowerCase().includes('failed');
  return (
    <div className={`p-4 mb-6 rounded-md text-center font-medium shadow transition-all duration-300
      ${isError ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-green-100 text-green-700 border border-green-300'}`}>
      {message}
    </div>
  );
};

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchHistory = useCallback(async () => {
    try {
      setMessage('');
      setLoading(true);
      const data = await getHistory();
      setHistory(data);
    } catch (error) {
      setMessage('Failed to load your history. Please try refreshing the page.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to delete all your history?')) {
      try {
        const res = await deleteHistory();
        setMessage(res.msg || 'History cleared successfully!');
        setHistory([]);
      } catch (error) {
        setMessage('Failed to clear history.');
        console.error(error);
      }
    }
  };

  const handleExportHistory = async () => {
    try {
      const res = await exportHistory();
      setMessage(res.msg || 'History export initiated! Check your email.');
    } catch (error) {
      setMessage('Failed to export history.');
      console.error(error);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white min-h-screen p-4 sm:p-6 lg:p-10">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-pink-500 mb-2 tracking-tight">Your Skin Analysis History</h1>
          <p className="text-lg text-gray-600">Review and manage your previous predictions</p>
        </div>

        {/* Message */}
        <MessageDisplay message={message} />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mb-10">
          <button
            onClick={handleExportHistory}
            disabled={history.length === 0}
            className="flex items-center gap-2 px-5 py-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-full shadow transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <FaEnvelopeOpenText className="text-lg" />
            Export to Email
          </button>
          <button
            onClick={handleClearHistory}
            disabled={history.length === 0}
            className="flex items-center gap-2 px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-full transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <FaTrashAlt className="text-md" />
            Clear All History
          </button>
        </div>

        {/* Empty State */}
        {history.length === 0 ? (
          <div className="text-center p-10 bg-pink-50 border border-pink-200 rounded-xl">
            <h3 className="text-2xl font-semibold text-pink-600">No History Found</h3>
            <p className="text-gray-500 mt-2">Start analyzing a new photo to generate history.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {history.map((item, index) => (
              <div
                key={item._id}
                className="history-item-fade-in flex flex-col sm:flex-row items-center bg-white border border-pink-100 shadow-sm rounded-xl p-5 transition-all"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <img
                  src={item.imageUrl}
                  alt="Analyzed skin"
                  className="w-36 h-36 object-cover rounded-md mb-4 sm:mb-0 sm:mr-6 border border-pink-200 shadow-sm"
                />
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-center flex-wrap mb-2">
                    <span className="text-xl font-semibold text-pink-500">{item.prediction}</span>
                    <span className="text-sm font-medium text-white bg-pink-400 px-3 py-1 rounded-full shadow">
                      {(item.confidence * 100).toFixed(1)}% Confidence
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    Analyzed on:{" "}
                    <span className="font-medium text-gray-700">
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </p>
                  <p className="text-gray-700 leading-relaxed">{item.info}</p>
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
