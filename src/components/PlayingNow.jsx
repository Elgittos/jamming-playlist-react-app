import { useState, useRef, useEffect } from 'react';
import { pausePlayback, resumePlayback, skipToNext, skipToPrevious, getAccessToken } from '../api';
import { usePlayer } from '../contexts/PlayerContext';

function PlayingNow() {
  const { currentTrack, isPlaying, progress, duration } = usePlayer();
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubbingProgress, setScrubbingProgress] = useState(0);
  const progressBarRef = useRef(null);

  const handlePlayPause = async () => {
    try {
      if (isPlaying) {
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

  // Seek to position in track
  const seekToPosition = async (positionMs) => {
    try {
      const token = await getAccessToken();
      await fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${Math.floor(positionMs)}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Seek error:', error);
    }
  };

  // Calculate position from mouse/touch event
  const calculatePosition = (event) => {
    if (!progressBarRef.current || !duration) return 0;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clientX = event.type.includes('touch') 
      ? event.touches[0]?.clientX || event.changedTouches[0]?.clientX
      : event.clientX;
    
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    return percentage * duration;
  };

  // Handle scrubbing start
  const handleScrubStart = (event) => {
    setIsScrubbing(true);
    const position = calculatePosition(event);
    setScrubbingProgress(position);
  };

  // Handle scrubbing move
  const handleScrubMove = (event) => {
    if (!isScrubbing) return;
    
    event.preventDefault();
    const position = calculatePosition(event);
    setScrubbingProgress(position);
  };

  // Handle scrubbing end
  const handleScrubEnd = async (event) => {
    if (!isScrubbing) return;
    
    const position = calculatePosition(event);
    setIsScrubbing(false);
    await seekToPosition(position);
  };

  // Add global mouse/touch listeners for scrubbing
  useEffect(() => {
    if (!isScrubbing) return;

    const handleGlobalMove = (e) => {
      // Only prevent default if we're actually scrubbing
      if (e.type.includes('touch')) {
        e.preventDefault();
      }
      handleScrubMove(e);
    };
    const handleGlobalEnd = (e) => handleScrubEnd(e);

    window.addEventListener('mousemove', handleGlobalMove);
    window.addEventListener('mouseup', handleGlobalEnd);
    window.addEventListener('touchmove', handleGlobalMove, { passive: false });
    window.addEventListener('touchend', handleGlobalEnd);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMove);
      window.removeEventListener('mouseup', handleGlobalEnd);
      window.removeEventListener('touchmove', handleGlobalMove);
      window.removeEventListener('touchend', handleGlobalEnd);
    };
  }, [isScrubbing, duration]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const displayProgress = isScrubbing ? scrubbingProgress : progress;
  const progressPercentage = duration ? (displayProgress / duration) * 100 : 0;

  return (
    <div className="w-full bg-gradient-to-br from-fuchsia-900 via-purple-950 to-black rounded-2xl shadow-2xl p-4 sm:p-6 h-full border border-fuchsia-800/30 flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 sm:mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Playing Now</h2>
        {/* Playing status badge */}
        {currentTrack && (
          <div>
            {isPlaying ? (
              <span className="inline-flex items-center gap-2 text-sm px-3 py-1.5 bg-green-500/20 text-green-400 rounded-full">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Playing
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 text-sm px-3 py-1.5 bg-gray-500/20 text-gray-400 rounded-full">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                Paused
              </span>
            )}
          </div>
        )}
      </div>
      
      {!currentTrack && (
        <p className="text-gray-400 text-center py-8">Click any song to start playing!</p>
      )}

      {currentTrack && (
        <div className="flex-1 flex flex-col justify-center space-y-3">
          {/* Album Art */}
          <div className="flex justify-center flex-1 items-center">
            <img
              src={currentTrack.album.images[0]?.url}
              alt={currentTrack.album.name}
              className="w-full max-w-[200px] sm:max-w-[260px] lg:max-w-[320px] 2xl:max-w-[360px] max-h-[200px] sm:max-h-[260px] lg:max-h-[320px] 2xl:max-h-[360px] rounded-xl shadow-2xl object-contain"
            />
          </div>

          {/* Track Info */}
          <div className="text-center space-y-1.5 w-full">
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white line-clamp-1 px-4">
              {currentTrack.name}
            </h3>
            <p className="text-sm sm:text-base text-gray-300 line-clamp-1 px-4">
              {currentTrack.artists.map(a => a.name).join(', ')}
            </p>
            <p className="text-xs sm:text-sm text-gray-400 line-clamp-1 px-4">
              {currentTrack.album.name}
            </p>
          </div>

          {/* Controls */}
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3 sm:gap-5">
              <button
                onClick={handlePrevious}
                className="p-2.5 rounded-full bg-fuchsia-800/30 hover:bg-fuchsia-700/50 text-white transition-all hover:scale-110 active:scale-95"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                </svg>
              </button>
              
              <button
                onClick={handlePlayPause}
                className="p-3 sm:p-3.5 rounded-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white transition-all hover:scale-110 active:scale-95 shadow-lg"
              >
                {isPlaying ? (
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              
              <button
                onClick={handleNext}
                className="p-2.5 rounded-full bg-fuchsia-800/30 hover:bg-fuchsia-700/50 text-white transition-all hover:scale-110 active:scale-95"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
                </svg>
              </button>
            </div>

            {/* Interactive Progress Bar */}
            <div className="space-y-1.5 w-full max-w-6xl mx-auto touch-none">
              <div 
                ref={progressBarRef}
                className="h-2.5 sm:h-3 bg-gray-700 rounded-full overflow-hidden w-full cursor-pointer relative group"
                onMouseDown={handleScrubStart}
                onTouchStart={handleScrubStart}
                onClick={(e) => {
                  if (!isScrubbing) {
                    const position = calculatePosition(e);
                    seekToPosition(position);
                  }
                }}
              >
                <div 
                  className="h-full bg-gradient-to-r from-fuchsia-600 via-purple-500 to-fuchsia-600 transition-all relative"
                  style={{ width: `${progressPercentage}%`, transitionDuration: isScrubbing ? '0ms' : '500ms' }}
                >
                  {/* Scrubber handle - visible when scrubbing or hovering */}
                  <div 
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full shadow-lg transition-opacity"
                    style={{ opacity: isScrubbing ? 1 : 0 }}
                  />
                </div>
              </div>
              <div className="flex justify-between text-xs sm:text-sm text-gray-400">
                <span>{formatTime(displayProgress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayingNow;