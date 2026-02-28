import React from 'react';
import { Music, Heart, Mic } from 'lucide-react';
import type { Song } from '../data/songs';

interface SongCardProps {
  song: Song;
  onClick: () => void;
}

const genreIcons = {
  ranchera: Mic,
  bolero: Heart,
  balada: Music
};

export function SongCard({ song, onClick }: SongCardProps) {
  const Icon = genreIcons[song.genre];
  
  return (
    <button
      onClick={onClick}
      className="w-full bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-98 border-2 border-transparent hover:border-wine/30"
    >
      <div className="flex items-start gap-6">
        <div className="flex-shrink-0 w-16 h-16 bg-wine/10 rounded-xl flex items-center justify-center">
          <Icon className="w-8 h-8 text-wine" strokeWidth={2} />
        </div>
        
        <div className="flex-1 text-left">
          <h3 className="text-[24px] mb-2 text-warm-black leading-tight">
            {song.title}
          </h3>
          <p className="text-[18px] text-warm-gray mb-1">
            {song.artist}
          </p>
          <p className="text-[16px] text-warm-gray-light">
            {song.year}
          </p>
        </div>
      </div>
    </button>
  );
}
