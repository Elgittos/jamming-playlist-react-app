import { useState } from 'react';
import { getAccessToken, searchTracks, getArtist } from '../api';

function SpotifyTest() {
  const [tokenStatus, setTokenStatus] = useState('Not tested');
  const [searchResults, setSearchResults] = useState(null);
  const [artistData, setArtistData] = useState(null);

  // Test 1: Get Access Token
  const testToken = async () => {
    try {
      const token = await getAccessToken();
      setTokenStatus('✅ Success! Token received: ' + token.substring(0, 20) + '...');
    } catch (error) {
      setTokenStatus('❌ Error: ' + error.message);
    }
  };

  // Test 2: Search for Tracks
  const testSearch = async () => {
    try {
      const results = await searchTracks('Radiohead');
      setSearchResults(results);
      console.log('Search results:', results);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  // Test 3: Get Artist Data (Radiohead)
  const testArtist = async () => {
    try {
      const artist = await getArtist('4Z8W4fKeB5YxbusRsdQVPb');
      setArtistData(artist);
      console.log('Artist data:', artist);
    } catch (error) {
      console.error('Artist error:', error);
    }
  };

  return (
    <div className="bg-gray-900 text-white p-8 rounded-lg max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">🎵 Spotify API Test Panel</h2>
      
      {/* Test 1: Access Token */}
      <div className="mb-6 p-4 bg-gray-800 rounded">
        <h3 className="text-xl font-semibold mb-2">Test 1: Get Access Token</h3>
        <button 
          onClick={testToken}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold transition-colors"
        >
          Test Token
        </button>
        <p className="mt-2 text-sm">{tokenStatus}</p>
      </div>

      {/* Test 2: Search Tracks */}
      <div className="mb-6 p-4 bg-gray-800 rounded">
        <h3 className="text-xl font-semibold mb-2">Test 2: Search Tracks</h3>
        <button 
          onClick={testSearch}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold transition-colors"
        >
          Search "Radiohead"
        </button>
        {searchResults && (
          <div className="mt-4">
            <p className="text-green-400">✅ Found {searchResults.length} tracks</p>
            <div className="mt-2 max-h-60 overflow-y-auto">
              {searchResults.slice(0, 5).map((track, idx) => (
                <div key={idx} className="text-sm py-1 border-b border-gray-700">
                  🎵 {track.name} - {track.artists[0].name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Test 3: Get Artist */}
      <div className="mb-6 p-4 bg-gray-800 rounded">
        <h3 className="text-xl font-semibold mb-2">Test 3: Get Artist Data</h3>
        <button 
          onClick={testArtist}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded font-semibold transition-colors"
        >
          Get Radiohead Info
        </button>
        {artistData && (
          <div className="mt-4">
            <p className="text-green-400">✅ Artist found!</p>
            <div className="mt-2 text-sm">
              <p><strong>Name:</strong> {artistData.name}</p>
              <p><strong>Followers:</strong> {artistData.followers.total.toLocaleString()}</p>
              <p><strong>Popularity:</strong> {artistData.popularity}/100</p>
              <p><strong>Genres:</strong> {artistData.genres.join(', ')}</p>
              {artistData.images[0] && (
                <img 
                  src={artistData.images[0].url} 
                  alt={artistData.name}
                  className="mt-3 w-32 h-32 rounded-full"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SpotifyTest;
