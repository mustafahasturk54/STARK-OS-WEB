import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat, Heart } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  cover: string;
}

const sampleTracks: Track[] = [
  { id: '1', title: 'Midnight Dreams', artist: 'Luna Echo', album: 'Nocturnal', duration: '3:42', cover: 'https://images.pexels.com/photos/167092/pexels-photo-167092.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { id: '2', title: 'Ocean Waves', artist: 'Serene Sounds', album: 'Nature Collection', duration: '4:15', cover: 'https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { id: '3', title: 'Urban Pulse', artist: 'City Beats', album: 'Street Symphony', duration: '3:28', cover: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { id: '4', title: 'Forest Whispers', artist: 'Nature\'s Call', album: 'Earth Songs', duration: '5:03', cover: 'https://images.pexels.com/photos/355747/pexels-photo-355747.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { id: '5', title: 'Electric Storm', artist: 'Thunder Bay', album: 'Lightning', duration: '4:37', cover: 'https://images.pexels.com/photos/844297/pexels-photo-844297.jpeg?auto=compress&cs=tinysrgb&w=300' },
];

export default function MediaPlayer() {
  const [currentTrack, setCurrentTrack] = useState<Track>(sampleTracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(222); // 3:42
  const [volume, setVolume] = useState(0.7);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'one' | 'all'>('off');
  const [isLiked, setIsLiked] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, duration]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    const currentIndex = sampleTracks.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % sampleTracks.length;
    setCurrentTrack(sampleTracks[nextIndex]);
    setCurrentTime(0);
    // Update duration based on new track
    const durations = [222, 255, 208, 303, 277];
    setDuration(durations[nextIndex]);
  };

  const prevTrack = () => {
    const currentIndex = sampleTracks.findIndex(track => track.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? sampleTracks.length - 1 : currentIndex - 1;
    setCurrentTrack(sampleTracks[prevIndex]);
    setCurrentTime(0);
    // Update duration based on new track
    const durations = [222, 255, 208, 303, 277];
    setDuration(durations[prevIndex]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setCurrentTime(Math.floor(percent * duration));
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="flex-1 p-6">
        {/* Album Art Section */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <img
              src={currentTrack.cover}
              alt={currentTrack.album}
              className="w-64 h-64 rounded-2xl shadow-2xl object-cover"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </div>

        {/* Track Info */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">{currentTrack.title}</h2>
          <p className="text-lg text-purple-200 mb-1">{currentTrack.artist}</p>
          <p className="text-purple-300">{currentTrack.album}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div 
            className="w-full h-2 bg-white/20 rounded-full cursor-pointer mb-2"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-200"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-purple-200">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-6 mb-6">
          <button
            onClick={() => setIsShuffled(!isShuffled)}
            className={`p-2 rounded-full transition-colors ${
              isShuffled ? 'text-purple-400' : 'text-white/60 hover:text-white'
            }`}
          >
            <Shuffle size={20} />
          </button>
          
          <button
            onClick={prevTrack}
            className="p-2 text-white hover:text-purple-300 transition-colors"
          >
            <SkipBack size={24} />
          </button>
          
          <button
            onClick={togglePlay}
            className="p-4 bg-white rounded-full text-purple-900 hover:scale-105 transition-transform shadow-lg"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          
          <button
            onClick={nextTrack}
            className="p-2 text-white hover:text-purple-300 transition-colors"
          >
            <SkipForward size={24} />
          </button>
          
          <button
            onClick={() => {
              const modes: Array<'off' | 'one' | 'all'> = ['off', 'one', 'all'];
              const currentIndex = modes.indexOf(repeatMode);
              const nextIndex = (currentIndex + 1) % modes.length;
              setRepeatMode(modes[nextIndex]);
            }}
            className={`p-2 rounded-full transition-colors ${
              repeatMode !== 'off' ? 'text-purple-400' : 'text-white/60 hover:text-white'
            }`}
          >
            <Repeat size={20} />
          </button>
        </div>

        {/* Additional Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2 rounded-full transition-colors ${
              isLiked ? 'text-red-400' : 'text-white/60 hover:text-white'
            }`}
          >
            <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
          
          <div className="flex items-center space-x-2">
            <Volume2 size={20} className="text-white/60" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 h-1 bg-white/20 rounded-full appearance-none slider"
            />
          </div>
        </div>
      </div>

      {/* Playlist */}
      <div className="bg-black/20 backdrop-blur-sm p-4 max-h-48 overflow-y-auto">
        <h3 className="text-white font-semibold mb-3">Up Next</h3>
        <div className="space-y-2">
          {sampleTracks.map((track) => (
            <div
              key={track.id}
              className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${
                track.id === currentTrack.id 
                  ? 'bg-white/10 text-white' 
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
              onClick={() => setCurrentTrack(track)}
            >
              <img src={track.cover} alt={track.album} className="w-10 h-10 rounded object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{track.title}</p>
                <p className="text-sm opacity-75 truncate">{track.artist}</p>
              </div>
              <span className="text-sm opacity-60">{track.duration}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}