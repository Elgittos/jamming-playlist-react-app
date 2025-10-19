import { useState, useEffect } from 'react';
import { getPlaybackState, pausePlayback, resumePlayback, skipToNext, skipToPrevious } from '../api';

function PlayingNow() {
  const [playbackState, setPlaybackState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlayback() {
      try {
        const state = await getPlaybackState();
        setPlaybackState(state);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching playback:', err);
        setLoading(false);
      }
    }

    fetchPlayback();
    const interval = setInterval(fetchPlayback, 2000); // Update every 2 seconds
    return () => clearInterval(interval);
  }, []);

  const handlePlayPause = async () => {
    try {
      if (playbackState?.is_playing) {
        await pausePlayback();
      } else {
        await resumePlayback();
      }
    } catch (error) {
      console.error('Play/pause error:', error);
    }
  };

  const handleNext = async () => {
    try {
      await skipToNext();
    } catch (error) {
      console.error('Next error:', error);
    }
  };

  const handlePrevious = async () => {
    try {
      await skipToPrevious();
    } catch (error) {
      console.error('Previous error:', error);
    }
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = playbackState?.progress_ms && playbackState?.item?.duration_ms
    ? (playbackState.progress_ms / playbackState.item.duration_ms) * 100
    : 0;

  return (
    <div className="w-full bg-gradient-to-br from-fuchsia-900 via-purple-950 to-black rounded-2xl shadow-2xl p-10 h-full border border-fuchsia-800/30 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white">Playing Now</h2>
        {/* Playing status badge moved to header */}
        {!loading && playbackState?.item && (
          <div>
            {playbackState.is_playing ? (
              <span className="flex items-center gap-2 text-sm px-4 py-2 bg-green-500/20 text-green-400 rounded-full">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Playing
              </span>
            ) : (
              <span className="flex items-center gap-2 text-sm px-4 py-2 bg-gray-500/20 text-gray-400 rounded-full">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                Paused
              </span>
            )}
          </div>
        )}
      </div>
      
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-400"></div>
        </div>
      )}

      {!loading && !playbackState?.item && (
        <p className="text-gray-400 text-center py-12">Click any song to start playing!</p>
      )}

      {!loading && playbackState?.item && (
        <div className="flex-1 flex flex-col justify-center space-y-4">
          {/* Large Album Art - takes most space */}
          <div className="flex justify-center flex-1 items-center">
            <img
              src={playbackState.item.album.images[0]?.url}
              alt={playbackState.item.album.name}
              className="max-w-full max-h-full w-auto h-auto rounded-xl shadow-2xl object-contain"
              style={{ maxHeight: '400px', maxWidth: '400px' }}
            />
          </div>

          {/* Compact Track Info Below */}
          <div className="text-center space-y-2 w-full">
            <h3 className="text-2xl font-bold text-white line-clamp-1 px-4">
              {playbackState.item.name}
            </h3>
            <p className="text-lg text-gray-300 line-clamp-1">
              {playbackState.item.artists.map(a => a.name).join(', ')}
            </p>
            <p className="text-sm text-gray-400 line-clamp-1">
              {playbackState.item.album.name}
            </p>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={handlePrevious}
                className="p-3 rounded-full bg-fuchsia-800/30 hover:bg-fuchsia-700/50 text-white transition-all hover:scale-110"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                </svg>
              </button>
              
              <button
                onClick={handlePlayPause}
                className="p-4 rounded-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white transition-all hover:scale-110 shadow-lg"
              >
                {playbackState.is_playing ? (
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              
              <button
                onClick={handleNext}
                className="p-3 rounded-full bg-fuchsia-800/30 hover:bg-fuchsia-700/50 text-white transition-all hover:scale-110"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
                </svg>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2 w-full max-w-6xl mx-auto">
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden w-full">
                <div 
                  className="h-full bg-gradient-to-r from-fuchsia-600 via-purple-500 to-fuchsia-600 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>{formatTime(playbackState.progress_ms || 0)}</span>
                <span>{formatTime(playbackState.item.duration_ms)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayingNow;