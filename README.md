# Jamming Playlist App 🎵

A modern, responsive music search and playback application built with React, featuring multiple audio source integrations including Openverse (open-licensed music), Royal Free Music (royalty-free tracks), and Spotify.

## Features

- **Multi-Source Audio Integration**: Switch between Openverse, Royal Free Music, and Spotify
- **Open-Licensed Music**: Default to Openverse for Public Domain and Creative Commons music
- **Smart Search**: Debounced search with real-time suggestions
- **Responsive Design**: Optimized for mobile (360px+), tablets, laptops, and large desktops
- **Audio Playback**: Direct HTML5 audio for Openverse/Royal Free, Spotify Web Playback SDK for Spotify
- **License Filtering**: Automatic filtering for open licenses (PD/CC) on Openverse
- **Genre Browsing**: Explore music by genre (Pop, Rap, Rock, Disco, Bachata)
- **Playlist Management**: Create and manage Spotify playlists
- **Caching & Performance**: Smart caching, request cancellation, and retry logic

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Styling
- **React Router** - Navigation
- **Spotify Web API** - Music data and playback (optional)
- **Openverse API** - Open-licensed audio (default)
- **Royal Free Music API** - Royalty-free music

## Prerequisites

- Node.js 18+ and npm
- (Optional) Spotify Developer account for Spotify integration

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Elgittos/jamming-playlist-react-app.git
cd jamming-playlist-react-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will open at `http://127.0.0.1:5173`

## Configuration

### Audio Source Selection

The app supports three audio sources:

1. **Openverse** (Default) - Open-licensed music (Public Domain & Creative Commons)
2. **Royal Free Music** - Royalty-free, fully playable music
3. **Spotify** (Optional, disabled by default) - Requires authentication

#### Changing Default Source

Edit `src/audio/config.js`:

```javascript
export const audioConfig = {
  defaultSource: AudioSourceType.OPENVERSE, // or ROYALFREE, SPOTIFY
  
  sources: {
    [AudioSourceType.OPENVERSE]: { enabled: true },
    [AudioSourceType.ROYALFREE]: { enabled: true },
    [AudioSourceType.SPOTIFY]: { enabled: false }, // Set to true to enable
  },
};
```

#### Runtime Source Switching

Users can switch sources using the dropdown in the app header. The selection persists in localStorage.

### Spotify Setup (Optional)

If you want to enable Spotify integration:

1. Create a Spotify Developer account at https://developer.spotify.com
2. Create a new app and get your Client ID
3. Add `http://127.0.0.1:5173/callback` to Redirect URIs
4. Update `src/api.js` with your Client ID:

```javascript
const CLIENT_ID = 'your_client_id_here';
```

5. Enable Spotify in config:

```javascript
// src/audio/config.js
[AudioSourceType.SPOTIFY]: { enabled: true },
```

See [SPOTIFY_API_SETUP_GUIDE.md](./SPOTIFY_API_SETUP_GUIDE.md) for detailed instructions.

## Usage

### Searching for Music

1. Use the search bar in the header
2. Type keywords, genres, or artist names
3. Results appear as you type (debounced)
4. Click any result to play immediately

### Switching Audio Sources

1. Use the "Audio Source" dropdown in the header
2. Select from available sources:
   - **Openverse (Open Licensed)** - Free, open-licensed music
   - **Royal Free Music** - Royalty-free tracks
   - **Spotify** - Full Spotify catalog (requires login)

### Browsing by Genre

Scroll down to explore curated genre sections:
- Pop, Rap, Rock, Disco, Bachata
- Each genre section fetches music from the active source
- Click any song card to play

### Playing Music

- **Openverse/Royal Free**: Plays directly in the browser using HTML5 audio
- **Spotify**: Requires Spotify Premium and an active device (web player loads automatically)

### Managing Playlists (Spotify Only)

1. Click "Test Login" to authenticate with Spotify
2. View your playlists in the Playlists Menu
3. Select a playlist to view tracks
4. Create new playlists and add tracks

## Architecture

### Audio Source System

The app uses a pluggable architecture with source adapters:

```
AudioProvider (Context)
├── OpenverseSource
├── RoyalFreeSource
└── SpotifySource
```

Each source implements:
- `search(params)` - Search for audio
- `getById(id)` - Get audio by ID
- Returns normalized schema

### Normalized Audio Schema

All sources return data in this format:

```javascript
{
  id: string,
  title: string,
  artist: string,
  license: 'PD' | 'CC' | 'Other',
  audioUrl: string,      // Direct playable URL
  thumbnailUrl?: string,
  source: 'openverse' | 'royalfree' | 'spotify',
  duration?: string,
  durationMs?: number,
  uri?: string,          // Spotify-specific
}
```

### Hooks

- **useAudio()** - Access audio provider context
- **useAudioSearch()** - Search with debouncing, caching, cancellation
- **useAudioPlayer()** - HTML5 audio playback control

## License Policy

### Openverse
- **Default source** for open-licensed music
- Filters to Public Domain (PD) and Creative Commons (CC) only
- Includes: CC0, PDM, CC-BY, CC-BY-SA, CC-BY-NC, etc.
- Respects creator attribution requirements

### Royal Free Music
- Royalty-free music, free to use
- Guarantees fully playable audio URLs
- License type: "Other" (royalty-free but not necessarily PD/CC)

### Spotify
- **Disabled by default** to avoid licensing issues
- Requires user authentication
- Subject to Spotify's Terms of Service
- Filters out non-playable tracks automatically
- No direct audio URLs (uses Spotify Web Playback SDK)

## Responsive Design

The app is optimized for all screen sizes:

- **Mobile** (360px - 768px): Single column, stacked layout
- **Tablet** (769px - 1024px): Two-column grid
- **Laptop** (1025px - 1440px): Multi-column, optimized spacing
- **Desktop** (1441px+): Wide layout with maximum content visibility

Features:
- Fluid typography using CSS `clamp()`
- Responsive grids with `grid-template-columns: repeat(auto-fit, minmax(...))`
- Touch-friendly controls (48px+ tap targets)
- Keyboard navigation support
- Screen reader accessible (ARIA labels, focus-visible)

## Performance

- **Debouncing**: 300ms delay on search input
- **Caching**: 5-minute TTL, max 100 cached queries per source
- **Request Cancellation**: Abort previous search on new input
- **Retry Logic**: Exponential backoff (max 3 retries)
- **Lazy Loading**: Dynamic imports for Spotify API

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Project Structure

```
src/
├── audio/                    # Audio source system
│   ├── sources/
│   │   ├── OpenverseSource.js
│   │   ├── RoyalFreeSource.js
│   │   └── SpotifySource.js
│   ├── AudioProvider.jsx    # Context provider
│   ├── hooks.js             # Audio hooks
│   ├── config.js            # Source configuration
│   ├── types.js             # TypeDefs
│   └── context.js           # React context
├── components/              # React components
│   ├── AudioSourceSelector.jsx
│   ├── GenreSection.jsx
│   ├── SearchBar.jsx
│   ├── SongCard.jsx
│   └── ...
├── api.js                   # Spotify API client
├── App.jsx                  # Main app component
├── main.jsx                 # Entry point
└── index.css                # Global styles
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## Troubleshooting

### Openverse Returns No Results
- Check your internet connection
- Verify the Openverse API is accessible: https://api.openverse.org/v1/audio/
- Try different search terms (e.g., "jazz", "classical", "ambient")

### Royal Free Music Not Working
- This is a placeholder API - replace with actual Royal Free Music endpoint
- Update `baseUrl` in `src/audio/config.js`

### Spotify Login Fails
- Ensure Client ID is correct in `src/api.js`
- Verify redirect URI is added in Spotify Dashboard
- Check that Spotify is enabled in `src/audio/config.js`
- Make sure you're accessing via `http://127.0.0.1:5173` (not localhost)

### Audio Won't Play
- **Openverse/Royal Free**: Check browser console for CORS or audio errors
- **Spotify**: Ensure you have Spotify Premium and an active device
- Check browser audio permissions

## Resources

- [Openverse API Documentation](https://api.openverse.org/v1/)
- [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)

## License

This project is open source. Music sources have their own licenses:
- Openverse: Varies by track (PD/CC)
- Royal Free Music: Royalty-free
- Spotify: Subject to Spotify Terms of Service

## Acknowledgments

- Openverse for providing access to openly licensed music
- Spotify for their comprehensive music API
- The React and Tailwind CSS communities
