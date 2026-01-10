# Spotify API Setup Guide - Authorization Code with PKCE

## 🎯 Overview
This guide shows how to set up Spotify authentication using **Authorization Code with PKCE** flow for a client-side React app. This allows users to login and access their personal Spotify data.

---

## ⚙️ Step 1: Configure Your Spotify App

### 1.1 Update Redirect URI in Spotify Dashboard

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click on your app: **My App**
3. Click **Settings**
4. Under **Redirect URIs**, add:
   ```
   http://localhost:5173/callback
   ```
  Also add your Netlify production callback (replace with your real URL):
  ```
  https://YOUR-SITE.netlify.app/callback
  ```
5. Click **Add**
6. Click **Save** at the bottom

### 1.2 Verify Your Credentials

- **Client ID:** `c1e8cce16c75485286206a1929bfbe7f`
- **Redirect URI (dev):** `http://localhost:5173/callback`
- **Redirect URI (prod):** `https://YOUR-SITE.netlify.app/callback`
- **No Client Secret needed** (PKCE doesn't use it!)

---

## 🌐 Deploy on Netlify (without breaking localhost)

### A) SPA routing (required)

This repo includes a Netlify SPA redirect rule in [public/_redirects](public/_redirects) so routes like `/callback` work in production.

### B) Set environment variables on Netlify (recommended)

In Netlify → **Site settings** → **Environment variables**, add:

- `VITE_SPOTIFY_CLIENT_ID` = your Spotify Client ID

You generally do NOT need to set `VITE_SPOTIFY_REDIRECT_URI`, because the app defaults to `${window.location.origin}/callback`.

### C) Important note about deploy previews

Spotify requires an exact match for the redirect URL. Netlify deploy previews have unique URLs, so OAuth may fail on preview deploys unless you register those URLs in Spotify.
For a smooth workflow, test Spotify login on your production domain.

---

## 📦 Step 2: Install React Router

Since we need a `/callback` route, install React Router:

```bash
npm install react-router-dom
```

---

## 🔧 Step 3: Set Up Routing

Update your `main.jsx`:

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Callback from './components/Callback.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
```

---

## 🚀 Step 4: Add Login Button to Your App

Update `App.jsx`:

```jsx
import { isAuthenticated } from './api';
import LoginButton from './components/LoginButton';
import RecentlyPlayed from './components/RecentlyPlayed';

function App() {
  const authenticated = isAuthenticated();

  return (
    <main className="min-h-screen bg-violet-950 flex flex-col gap-8 p-4 md:p-6 lg:p-8">
      <div className="bg-indigo-950 p-10 flex justify-between items-center">
        <h1 className="text-4xl font-bold text-white">Jamming Playlist App</h1>
        <LoginButton />
      </div>

      {authenticated ? (
        <>
          <RecentlyPlayed />
          {/* Your other components */}
        </>
      ) : (
        <div className="text-center text-white p-20">
          <h2 className="text-3xl font-bold mb-4">Welcome to Jamming!</h2>
          <p className="text-xl mb-8">Login with Spotify to get started</p>
          <LoginButton />
        </div>
      )}
    </main>
  );
}

export default App;
```

---

## ✅ Step 5: Test the Authentication Flow

### 5.1 Start Your Dev Server
```bash
npm run dev
```

### 5.2 Test Login Flow

1. **Visit** `http://localhost:5173`
2. **Click** "Login with Spotify" button
3. **Redirect** to Spotify login page
4. **Login** with your Spotify account
5. **Authorize** the app
6. **Redirect back** to `http://localhost:5173/callback`
7. **Auto-redirect** to home page (authenticated!)

### 5.3 Expected Behavior

✅ **Before Login:**
- See "Login with Spotify" button
- No user data displayed

✅ **During Login:**
- Redirected to Spotify
- See authorization screen
- Click "Agree"

✅ **After Login:**
- Redirected to `/callback` (brief loading screen)
- Redirected to `/` (home)
- See "Logout" button
- Can access user data!

---

## 🧪 Step 6: Test API Calls

Update `RecentlyPlayed.jsx` to use real user data:

```jsx
import { useEffect, useState } from 'react';
import { getRecentlyPlayed, isAuthenticated } from '../api';
import SongCard from './SongCard';

function RecentlyPlayed() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRecentlyPlayed() {
      if (!isAuthenticated()) {
        setLoading(false);
        return;
      }

      try {
        const recentTracks = await getRecentlyPlayed(10);
        
        const formattedTracks = recentTracks.map(item => ({
          id: item.track.id,
          title: item.track.name,
          artist: item.track.artists[0].name,
          album: item.track.album.name,
          albumArt: item.track.album.images[0]?.url || 'https://via.placeholder.com/200'
        }));
        
        setTracks(formattedTracks);
      } catch (err) {
        console.error('Error fetching recently played:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentlyPlayed();
  }, []);

  if (!isAuthenticated()) {
    return null; // Don't show if not logged in
  }

  if (loading) {
    return (
      <div className="bg-fuchsia-950 p-6">
        <p className="text-white text-center">Loading your recently played tracks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-fuchsia-950 p-6">
        <p className="text-red-400 text-center">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-fuchsia-950 p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Your Recently Played</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth">
        {tracks.map((track) => (
          <SongCard key={track.id} song={track} />
        ))}
      </div>
    </div>
  );
}

export default RecentlyPlayed;
```

---

## 🔍 Step 7: Verify Everything Works

### Check Console Messages

✅ **On Login:**
```
✅ Access token received successfully!
```

✅ **On API Calls:**
```
Using cached access token
```

✅ **On Token Refresh:**
```
✅ Access token refreshed successfully!
```

### Check Network Tab

1. Open DevTools → Network
2. Login to Spotify
3. Look for:
   - `authorize` (redirect to Spotify)
   - `api/token` (POST, returns 200 with access_token)
   - `me/player/recently-played` (GET, returns your tracks)

### Check localStorage

Open DevTools → Application → Local Storage → `http://localhost:5173`

Should see:
- `access_token`
- `refresh_token`
- `token_expiration`

---

## 📋 Available API Functions

All functions are in `src/api.js`:

### Authentication
| Function | Description |
|----------|-------------|
| `redirectToSpotifyAuth()` | Start login flow |
| `handleCallback()` | Process callback after login |
| `isAuthenticated()` | Check if user is logged in |
| `logout()` | Clear tokens and logout |
| `getAccessToken()` | Get/refresh access token |

### User Data
| Function | Description |
|----------|-------------|
| `getCurrentUser()` | Get user profile |
| `getRecentlyPlayed(limit)` | Get recently played tracks |
| `getUserPlaylists(limit)` | Get user's playlists |

### Playlist Management
| Function | Description |
|----------|-------------|
| `createPlaylist(userId, name, desc, isPublic)` | Create new playlist |
| `addTracksToPlaylist(playlistId, trackUris)` | Add tracks to playlist |

---

## 🎵 Step 8: Test Real Features

### Test 1: Get User Profile
```jsx
import { getCurrentUser } from '../api';

const user = await getCurrentUser();
console.log('User:', user.display_name);
console.log('Email:', user.email);
console.log('Followers:', user.followers.total);
```

### Test 2: Get User's Playlists
```jsx
import { getUserPlaylists } from '../api';

const playlists = await getUserPlaylists(10);
console.log('Playlists:', playlists);
```

### Test 3: Create a Playlist
```jsx
import { getCurrentUser, createPlaylist } from '../api';

const user = await getCurrentUser();
const newPlaylist = await createPlaylist(
  user.id, 
  'My Jamming Playlist',
  'Created with Jamming App'
);
console.log('Created:', newPlaylist);
```

---

## ❌ Common Issues & Solutions

### Issue 1: "Invalid redirect URI"
**Solution:** Make sure `http://localhost:5173/callback` is added in Spotify Dashboard

### Issue 2: "Code verifier not found"
**Solution:** localStorage might be cleared. Try login again.

### Issue 3: Stuck on callback page
**Solution:** Check that React Router is properly set up in `main.jsx`

### Issue 4: "Please login to Spotify" error
**Solution:** Token expired or invalid. Click logout and login again.

### Issue 5: Refresh token expired
**Solution:** User needs to re-authorize. This happens rarely (token lasts ~1 hour, refresh token lasts much longer)

---

## 🔒 Security Notes

✅ **PKCE is secure** - No client secret exposed
✅ **Tokens in localStorage** - Safe for this use case
✅ **Refresh token** - Automatically renews access token
✅ **Scopes** - Only request permissions you need

⚠️ **For production:**
- Change `REDIRECT_URI` to your production URL
- Consider using httpOnly cookies for extra security
- Implement proper error boundaries

---

## 🎯 Quick Verification Checklist

- [ ] Redirect URI added in Spotify Dashboard
- [ ] React Router installed and configured
- [ ] Login button appears on home page
- [ ] Clicking login redirects to Spotify
- [ ] After authorizing, redirected back to app
- [ ] "Logout" button appears when authenticated
- [ ] Recently played tracks load
- [ ] Console shows no errors
- [ ] localStorage has tokens
- [ ] Token auto-refreshes when expired

---

## 🚀 Next Steps

1. ✅ **Authentication working** - Users can login!
2. 🎵 **Fetch real data** - Recently played, playlists, etc.
3. 🔍 **Add search** - Search for songs to add to playlist
4. ➕ **Create playlists** - Let users create and manage playlists
5. 💾 **Save to Spotify** - Save playlists directly to user's Spotify

---

## 📚 Useful Resources

- [PKCE Flow Documentation](https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow)
- [Spotify API Reference](https://developer.spotify.com/documentation/web-api/reference)
- [Authorization Scopes](https://developer.spotify.com/documentation/web-api/concepts/scopes)
- [API Console](https://developer.spotify.com/console)

**Happy coding! 🎵**
