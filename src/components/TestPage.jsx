import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAuthenticated, getCurrentUser, getRecentlyPlayed, getUserPlaylists } from '../api'
import LoginButton from './LoginButton'

function TestPage() {
  const [user, setUser] = useState(null)
  const [apiData, setApiData] = useState(null)
  const [loading, setLoading] = useState(false)
  const authenticated = isAuthenticated()
  const navigate = useNavigate()

  // Fetch user data when authenticated
  const fetchData = async () => {
    if (!authenticated) return
    
    setLoading(true)
    try {
      const userData = await getCurrentUser()
      setUser(userData)
      
      const [recentTracks, playlists] = await Promise.all([
        getRecentlyPlayed(5),
        getUserPlaylists(5)
      ])
      
      setApiData({
        user: userData,
        recentTracks,
        playlists
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [authenticated])

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-950 to-black p-4 md:p-8">
      {/* Back button */}
      <button 
        onClick={() => navigate('/')}
        className="mb-6 bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-6 rounded-full transition-all"
      >
        ← Back to App
      </button>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-purple-900 p-5 sm:p-8 rounded-2xl shadow-2xl mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">🧪 Spotify API Test Page</h1>
          {user && (
            <p className="text-gray-300 text-lg">Welcome, {user.display_name}! 👋</p>
          )}
          <div className="mt-4">
            <LoginButton />
          </div>
        </div>

        {!authenticated ? (
          <div className="text-center bg-white/10 backdrop-blur-lg rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-white mb-4">Please Login First</h2>
            <p className="text-gray-300 mb-6">Connect with Spotify to test the API</p>
          </div>
        ) : loading ? (
          <div className="text-center text-white text-xl">Loading data...</div>
        ) : apiData ? (
          <div className="space-y-6">
            {/* User Profile */}
            <div className="bg-gradient-to-br from-emerald-900 via-green-950 to-black rounded-2xl shadow-2xl p-6 border border-emerald-800/30">
              <h3 className="text-2xl font-bold text-emerald-400 mb-4">👤 User Profile</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white">
                <div>
                  <p className="text-gray-400">Name:</p>
                  <p className="font-semibold">{apiData.user.display_name}</p>
                </div>
                <div>
                  <p className="text-gray-400">Email:</p>
                  <p className="font-semibold">{apiData.user.email}</p>
                </div>
                <div>
                  <p className="text-gray-400">User ID:</p>
                  <p className="font-semibold text-sm">{apiData.user.id}</p>
                </div>
                <div>
                  <p className="text-gray-400">Followers:</p>
                  <p className="font-semibold">{apiData.user.followers.total}</p>
                </div>
                <div>
                  <p className="text-gray-400">Account Type:</p>
                  <p className="font-semibold">{apiData.user.product}</p>
                </div>
                <div>
                  <p className="text-gray-400">Country:</p>
                  <p className="font-semibold">{apiData.user.country}</p>
                </div>
              </div>
            </div>

            {/* Recently Played */}
            <div className="bg-gradient-to-br from-blue-900 via-indigo-950 to-black rounded-2xl shadow-2xl p-6 border border-blue-800/30">
              <h3 className="text-2xl font-bold text-blue-400 mb-4">🎵 Recently Played (5 tracks)</h3>
              <div className="space-y-3">
                {apiData.recentTracks.map((item, idx) => (
                  <div key={idx} className="bg-white/5 rounded-lg p-4 border-l-4 border-blue-500">
                    <p className="font-semibold text-white">{item.track.name}</p>
                    <p className="text-gray-400">{item.track.artists[0].name} • {item.track.album.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Played: {new Date(item.played_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Playlists */}
            <div className="bg-gradient-to-br from-purple-900 via-fuchsia-950 to-black rounded-2xl shadow-2xl p-6 border border-purple-800/30">
              <h3 className="text-2xl font-bold text-purple-400 mb-4">📂 Your Playlists (5)</h3>
              <div className="space-y-3">
                {apiData.playlists.map((playlist, idx) => (
                  <div key={idx} className="bg-white/5 rounded-lg p-4 border-l-4 border-purple-500">
                    <p className="font-semibold text-white">{playlist.name}</p>
                    <p className="text-gray-400">
                      {playlist.tracks.total} tracks • Owner: {playlist.owner.display_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {playlist.public ? '🌐 Public' : '🔒 Private'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Raw JSON */}
            <details className="bg-gray-900 rounded-2xl shadow-2xl p-6 border border-gray-700">
              <summary className="text-xl font-bold text-orange-400 cursor-pointer hover:text-orange-300">
                📄 View Raw JSON Response
              </summary>
              <pre className="mt-4 text-xs text-gray-300 overflow-auto max-h-96 bg-black rounded-lg p-4">
                {JSON.stringify(apiData, null, 2)}
              </pre>
            </details>
          </div>
        ) : null}
      </div>
    </main>
  )
}

export default TestPage
