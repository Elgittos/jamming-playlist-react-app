import { useEffect, useMemo, useRef, useState } from 'react';
import { usePlayer } from '../hooks/usePlayer';

function PlayingNow({ theme = 'original' }) {
  const {
    isAuthed,
    playbackState,
    isPlaybackLoading,
    isPlaying,
    progressMs,
    durationMs,
    togglePlayPause,
    next,
    previous,
    seekToMs
  } = usePlayer();

  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubMs, setScrubMs] = useState(0);
  const progressBarRef = useRef(null);
  const activePointerIdRef = useRef(null);

  const sessionTrackIdsRef = useRef(new Set());
  const [sessionUniqueTracks, setSessionUniqueTracks] = useState(0);

  const isLight = theme === 'light';

  useEffect(() => {
    const id = playbackState?.item?.id;
    if (!id) return;
    if (sessionTrackIdsRef.current.has(id)) return;
    sessionTrackIdsRef.current.add(id);
    setSessionUniqueTracks(sessionTrackIdsRef.current.size);
  }, [playbackState?.item?.id]);

  const displayProgressMs = isScrubbing ? scrubMs : progressMs;
  const progressPercent = useMemo(() => {
    if (!durationMs) return 0;
    return Math.max(0, Math.min(100, (displayProgressMs / durationMs) * 100));
  }, [displayProgressMs, durationMs]);

  const loading = isPlaybackLoading;

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getMsFromClientX = (clientX) => {
    const el = progressBarRef.current;
    if (!el || !durationMs) return 0;

    const rect = el.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    const clampedRatio = Math.max(0, Math.min(1, ratio));
    return Math.round(clampedRatio * durationMs);
  };

  const handleScrubStart = (event) => {
    if (!durationMs) return;

    event.preventDefault();
    activePointerIdRef.current = event.pointerId;
    progressBarRef.current?.setPointerCapture?.(event.pointerId);
    setIsScrubbing(true);
    setScrubMs(getMsFromClientX(event.clientX));
  };

  const handleScrubMove = (event) => {
    if (!isScrubbing) return;
    if (activePointerIdRef.current !== event.pointerId) return;
    event.preventDefault();
    setScrubMs(getMsFromClientX(event.clientX));
  };

  const handleScrubEnd = async (event) => {
    if (!isScrubbing) return;
    if (activePointerIdRef.current !== event.pointerId) return;

    event.preventDefault();
    const finalMs = getMsFromClientX(event.clientX);
    setScrubMs(finalMs);
    setIsScrubbing(false);
    activePointerIdRef.current = null;

    try {
      // Spec requirement: seek and resume playback on release
      await seekToMs(finalMs, { resume: true });
    } catch (error) {
      console.error('Seek error:', error);
    }
  };

  useEffect(() => {
    if (!isScrubbing) return;
    // Keep scrub preview stable if track changes under us
    if (!durationMs) {
      setIsScrubbing(false);
    }
  }, [durationMs, isScrubbing]);

  const handleKeyDown = async (event) => {
    if (!durationMs && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) return;

    if (event.key === ' ' || event.code === 'Space') {
      event.preventDefault();
      try {
        await togglePlayPause();
      } catch (error) {
        console.error('Play/pause error:', error);
      }
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      try {
        await seekToMs((progressMs || 0) - 5000, { resume: true });
      } catch (error) {
        console.error('Seek error:', error);
      }
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      try {
        await seekToMs((progressMs || 0) + 5000, { resume: true });
      } catch (error) {
        console.error('Seek error:', error);
      }
    }
  };

  const containerClasses = useMemo(() => {
    if (theme === 'dark') {
      return 'bg-gradient-to-br from-zinc-950/85 via-zinc-950 to-black border border-white/10';
    }
    if (theme === 'light') {
      return 'bg-white/75 border border-zinc-200';
    }
    return 'bg-gradient-to-br from-fuchsia-900 via-purple-950 to-black border border-fuchsia-800/30';
  }, [theme]);

  const primaryText = isLight ? 'text-zinc-900' : 'text-white';
  const secondaryText = isLight ? 'text-zinc-600' : 'text-gray-300';
  const tertiaryText = isLight ? 'text-zinc-500' : 'text-gray-400';

  return (
    <div
      className={`w-full ${containerClasses} rounded-2xl shadow-2xl p-3 sm:p-4 lg:p-5 h-full flex flex-col backdrop-blur`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
        <h2 className={`text-lg sm:text-xl lg:text-2xl font-bold ${primaryText}`}>Playing Now</h2>
        {/* Playing status badge moved to header */}
        {!loading && playbackState?.item && (
          <div>
            {isPlaying ? (
              <span className="inline-flex items-center gap-2 text-xs sm:text-sm px-3 py-1.5 bg-green-500/20 text-green-400 rounded-full">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Playing
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 text-xs sm:text-sm px-3 py-1.5 bg-gray-500/20 text-gray-400 rounded-full">
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
        <p className={`${tertiaryText} text-center py-8`}>
          {isAuthed ? 'Click any song to start playing!' : 'Login to Spotify to start playing.'}
        </p>
      )}

      {!loading && playbackState?.item && (
        <div className="flex-1 flex flex-col justify-center gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center sm:items-start">
            {/* Album Art */}
            <div className="flex-shrink-0">
              <img
                src={playbackState.item.album.images[0]?.url}
                alt={playbackState.item.album.name}
                className="w-[160px] h-[160px] sm:w-[180px] sm:h-[180px] lg:w-[200px] lg:h-[200px] rounded-2xl shadow-2xl object-cover"
              />
            </div>

            {/* Track info + context */}
            <div className="flex-1 min-w-0 w-full">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className={`text-base sm:text-lg lg:text-xl font-bold ${primaryText} truncate`}>{playbackState.item.name}</h3>
                  {playbackState.item.explicit && (
                    <span className={`text-[11px] px-2 py-0.5 rounded-full border ${isLight ? 'bg-zinc-100 text-zinc-700 border-zinc-200' : 'bg-white/10 text-white/70 border-white/10'}`}>
                      Explicit
                    </span>
                  )}
                </div>

                <p className={`text-sm sm:text-base ${secondaryText} truncate`}>
                  {playbackState.item.artists.map((a) => a.name).join(', ')}
                </p>

                <p className={`text-xs sm:text-sm ${tertiaryText} truncate`}>
                  {playbackState.item.album.name}
                </p>

                {/* Secondary context (non-intrusive) */}
                <div className={`text-xs ${tertiaryText} flex flex-wrap gap-x-3 gap-y-1`}> 
                  <span>
                    Year:{' '}
                    {playbackState.item.album.release_date ? String(playbackState.item.album.release_date).slice(0, 4) : '—'}
                  </span>
                  <span>
                    Track: {playbackState.item.track_number ?? '—'} / {playbackState.item.album.total_tracks ?? '—'}
                  </span>
                  <span>
                    This session: {sessionUniqueTracks} tracks
                  </span>
                  {playbackState.device?.name && (
                    <span>
                      Device: {playbackState.device.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-4 sm:gap-6">
              <button
                onClick={previous}
                className={`p-3 rounded-full transition-all hover:scale-110 ${isLight ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900' : 'bg-fuchsia-800/30 hover:bg-fuchsia-700/50 text-white'}`}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                </svg>
              </button>
              
              <button
                onClick={togglePlayPause}
                className="p-4 rounded-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white transition-all hover:scale-110 shadow-lg"
              >
                {isPlaying ? (
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
                onClick={next}
                className={`p-3 rounded-full transition-all hover:scale-110 ${isLight ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900' : 'bg-fuchsia-800/30 hover:bg-fuchsia-700/50 text-white'}`}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
                </svg>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2 w-full max-w-6xl mx-auto">
              <div
                ref={progressBarRef}
                role="slider"
                aria-label="Seek"
                aria-valuemin={0}
                aria-valuemax={durationMs || 0}
                aria-valuenow={Math.floor(displayProgressMs)}
                className={`h-4 rounded-full overflow-hidden w-full touch-none select-none cursor-pointer ${isLight ? 'bg-zinc-200' : 'bg-gray-700/90'}`}
                onPointerDown={handleScrubStart}
                onPointerMove={handleScrubMove}
                onPointerUp={handleScrubEnd}
                onPointerCancel={handleScrubEnd}
              >
                <div
                  className="h-full bg-gradient-to-r from-fuchsia-600 via-purple-500 to-fuchsia-600"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className={`flex justify-between text-sm ${tertiaryText}`}>
                <span>{formatTime(displayProgressMs || 0)}</span>
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