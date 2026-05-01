export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  color: string;
}

export const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cyber Neon Pulse',
    artist: 'AI Synth Orchestrator',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    color: '#06b6d4', // cyan-500
  },
  {
    id: '2',
    title: 'Synthwave Drift',
    artist: 'Digital Dreamscape',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    color: '#ec4899', // pink-500
  },
  {
    id: '3',
    title: 'Deep AI Echoes',
    artist: 'Neural Network Beats',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    color: '#84cc16', // lime-500
  },
];
