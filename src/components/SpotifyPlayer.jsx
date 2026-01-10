import { useEffect, useState } from 'react';
import { getAccessToken } from '../api';

function SpotifyPlayer() {
  const [isReady, setIsReady] = useState(false);
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = async () => {
      try {
        const token = await getAccessToken();

        const spotifyPlayer = new window.Spotify.Player({
          name: 'Jamming Web Player',
          getOAuthToken: cb => { cb(token); },
          volume: 0.8
        });

        spotifyPlayer.addListener('ready', ({ device_id }) => {
          console.log('✅ Web Player Ready! Device ID:', device_id);
          window.spotifyDeviceId = device_id;
          setIsReady(true);
        });

        spotifyPlayer.addListener('not_ready', ({ device_id }) => {
          console.log('Device went offline:', device_id);
          setIsReady(false);
        });

        spotifyPlayer.addListener('initialization_error', ({ message }) => {
          console.error('Init Error:', message);
        });

        spotifyPlayer.addListener('authentication_error', ({ message }) => {
          console.error('Auth Error:', message);
        });

        spotifyPlayer.addListener('account_error', ({ message }) => {
          console.error('Account Error:', message);
        });

        spotifyPlayer.addListener('playback_error', ({ message }) => {
          console.error('Playback Error:', message);
        });

        const connected = await spotifyPlayer.connect();
        if (connected) {
          console.log('✅ Connected to Spotify!');
          setPlayer(spotifyPlayer);
        }
      } catch (error) {
        console.error('Error setting up player:', error);
      }
    };

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, []);

  if (!isReady) {
    return (
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-50 bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full text-sm flex items-center gap-2 backdrop-blur-sm border border-yellow-500/30 max-w-[calc(100vw-2rem)]">
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        <span className="truncate">Connecting Web Player...</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-50 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm flex items-center gap-2 backdrop-blur-sm border border-green-500/30 max-w-[calc(100vw-2rem)]">
      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0"></span>
      <span className="truncate">Web Player Ready!</span>
    </div>
  );
}

export default SpotifyPlayer;
