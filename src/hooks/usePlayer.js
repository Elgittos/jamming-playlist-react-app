import { useContext } from 'react';
import { PlayerContext } from '../context/PlayerContext';

export function usePlayer() {
  const value = useContext(PlayerContext);
  if (!value) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return value;
}

