// Import the necessary modules and components
import { useState } from 'react';
import './App.css'
import BloomLoader from './HomePage/BloomLoader';
import HomePage from './HomePage/HomePage'


function App() {
  const [loading, setLoading] = useState(true);

  const handleLoaderComplete = () => {
    setLoading(false);
  };
  return (
    <>
    {loading ? <BloomLoader onComplete={handleLoaderComplete} /> : <HomePage />}
    </>
  )
}

export default App
