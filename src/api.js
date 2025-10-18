// Spotify API Configuration - Authorization Code with PKCE Flow
const CLIENT_ID = 'c1e8cce16c75485286206a1929bfbe7f';
const REDIRECT_URI = 'http://127.0.0.1:5173/callback'; // Matches Spotify Dashboard
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

// Scopes define what permissions your app needs
const SCOPES = [
  'user-read-private',
  'user-read-email',
  'playlist-read-private',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-read-recently-played',
  'user-top-read',
  'user-library-read'
].join(' ');

let accessToken = null;
let refreshToken = null;
let tokenExpirationTime = null;

/**
 * Generate a random string for PKCE code verifier
 */
function generateRandomString(length) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], '');
}

/**
 * Generate SHA256 hash of the code verifier for PKCE
 */
async function sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
}

/**
 * Base64 encode the hash for PKCE code challenge
 */
function base64encode(input) {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

/**
 * Redirect user to Spotify authorization page
 * This initiates the OAuth flow
 */
export async function redirectToSpotifyAuth() {
  const codeVerifier = generateRandomString(64);
  
  // Store code verifier in localStorage for later use
  localStorage.setItem('code_verifier', codeVerifier);
  
  // Generate code challenge from verifier
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);
  
  // Build authorization URL
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
  });
  
  // Redirect to Spotify authorization
  window.location.href = `${AUTH_ENDPOINT}?${params.toString()}`;
}

/**
 * Exchange authorization code for access token
 * Call this after user is redirected back from Spotify
 */
export async function handleCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  
  if (!code) {
    throw new Error('No authorization code found in URL');
  }
  
  const codeVerifier = localStorage.getItem('code_verifier');
  
  if (!codeVerifier) {
    throw new Error('No code verifier found in localStorage');
  }
  
  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Store tokens
    accessToken = data.access_token;
    refreshToken = data.refresh_token;
    tokenExpirationTime = Date.now() + (data.expires_in - 60) * 1000;
    
    // Store in localStorage for persistence
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('token_expiration', tokenExpirationTime.toString());
    
    // Clean up code verifier
    localStorage.removeItem('code_verifier');
    
    console.log('✅ Access token received successfully!');
    
    return accessToken;
  } catch (error) {
    console.error('❌ Error exchanging code for token:', error);
    throw error;
  }
}

/**
 * Refresh the access token using refresh token
 */
async function refreshAccessToken() {
  const storedRefreshToken = refreshToken || localStorage.getItem('refresh_token');
  
  if (!storedRefreshToken) {
    throw new Error('No refresh token available');
  }
  
  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: 'refresh_token',
        refresh_token: storedRefreshToken,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Update tokens
    accessToken = data.access_token;
    tokenExpirationTime = Date.now() + (data.expires_in - 60) * 1000;
    
    // Update localStorage
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('token_expiration', tokenExpirationTime.toString());
    
    console.log('✅ Access token refreshed successfully!');
    
    return accessToken;
  } catch (error) {
    console.error('❌ Error refreshing token:', error);
    // If refresh fails, clear tokens and require re-auth
    logout();
    throw error;
  }
}

/**
 * Get valid access token (from cache or refresh if needed)
 */
export async function getAccessToken() {
  // Try to get from memory first
  if (accessToken && tokenExpirationTime && Date.now() < tokenExpirationTime) {
    console.log('Using cached access token');
    return accessToken;
  }
  
  // Try to restore from localStorage
  const storedToken = localStorage.getItem('access_token');
  const storedExpiration = localStorage.getItem('token_expiration');
  
  if (storedToken && storedExpiration) {
    const expiration = parseInt(storedExpiration);
    
    if (Date.now() < expiration) {
      accessToken = storedToken;
      tokenExpirationTime = expiration;
      console.log('Using stored access token');
      return accessToken;
    }
  }
  
  // Token expired, try to refresh
  try {
    return await refreshAccessToken();
  } catch (error) {
    console.error('Token refresh failed, need to re-authenticate');
    throw new Error('Please login to Spotify');
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  const token = localStorage.getItem('access_token');
  const expiration = localStorage.getItem('token_expiration');
  
  if (!token || !expiration) {
    return false;
  }
  
  return Date.now() < parseInt(expiration);
}

/**
 * Logout - clear all tokens
 */
export function logout() {
  accessToken = null;
  refreshToken = null;
  tokenExpirationTime = null;
  
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('token_expiration');
  localStorage.removeItem('code_verifier');
  
  console.log('✅ Logged out successfully');
}

/**
 * Get current user's profile
 */
export async function getCurrentUser() {
  try {
    const token = await getAccessToken();
    
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Error getting user profile:', error);
    throw error;
  }
}

/**
 * Get user's recently played tracks
 * @param {number} limit - Number of tracks to return (default: 20, max: 50)
 */
export async function getRecentlyPlayed(limit = 20) {
  try {
    const token = await getAccessToken();
    
    const response = await fetch(`https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error('❌ Error getting recently played:', error);
    throw error;
  }
}

/**
 * Get user's playlists
 * @param {number} limit - Number of playlists to return (default: 20, max: 50)
 */
export async function getUserPlaylists(limit = 20) {
  try {
    const token = await getAccessToken();
    
    const response = await fetch(`https://api.spotify.com/v1/me/playlists?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error('❌ Error getting playlists:', error);
    throw error;
  }
}

/**
 * Create a new playlist
 * @param {string} userId - User's Spotify ID
 * @param {string} name - Playlist name
 * @param {string} description - Playlist description
 * @param {boolean} isPublic - Whether playlist is public (default: true)
 */
export async function createPlaylist(userId, name, description = '', isPublic = true) {
  try {
    const token = await getAccessToken();
    
    const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        description: description,
        public: isPublic
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Error creating playlist:', error);
    throw error;
  }
}

/**
 * Add tracks to a playlist
 * @param {string} playlistId - Playlist ID
 * @param {string[]} trackUris - Array of track URIs (spotify:track:...)
 */
export async function addTracksToPlaylist(playlistId, trackUris) {
  try {
    const token = await getAccessToken();
    
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uris: trackUris
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Error adding tracks to playlist:', error);
    throw error;
  }
}

/**
 * Search for tracks, artists, and albums
 * @param {string} query - Search query
 * @param {number} limit - Number of results per type (default: 4)
 */
export async function searchSpotify(query, limit = 4) {
  try {
    const token = await getAccessToken();
    
    // Search for tracks, artists, and albums
    const params = new URLSearchParams({
      q: query,
      type: 'track,artist,album',
      limit: limit.toString()
    });
    
    const response = await fetch(`https://api.spotify.com/v1/search?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Error searching Spotify:', error);
    throw error;
  }
}

/**
 * Search for top tracks by genre
 * @param {string} genre - Genre name
 * @param {number} limit - Number of results (default: 10)
 */
export async function searchByGenre(genre, limit = 10) {
  try {
    const token = await getAccessToken();
    
    // Search for popular tracks in the genre
    const params = new URLSearchParams({
      q: `genre:${genre}`,
      type: 'track',
      limit: limit.toString(),
      market: 'US'
    });
    
    const response = await fetch(`https://api.spotify.com/v1/search?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.tracks.items;
  } catch (error) {
    console.error(`❌ Error searching genre ${genre}:`, error);
    throw error;
  }
}