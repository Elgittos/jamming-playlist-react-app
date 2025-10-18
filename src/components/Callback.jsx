import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleCallback } from '../api';

function Callback() {
  const [status, setStatus] = useState('Processing...');
  const navigate = useNavigate();

  useEffect(() => {
    async function processCallback() {
      try {
        await handleCallback();
        setStatus('✅ Authentication successful! Redirecting...');
        
        // Redirect to home page after successful auth
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } catch (error) {
        setStatus('❌ Authentication failed: ' + error.message);
        console.error('Callback error:', error);
      }
    }

    processCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-violet-950 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Authenticating with Spotify</h1>
        <p className="text-gray-700">{status}</p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}

export default Callback;
