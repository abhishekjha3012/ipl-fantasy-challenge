import { PLAYERS } from './players.js';

export const EMPTY_MATCH_DATA = [];

export const INITIAL_PLAYER_TOTALS = PLAYERS.reduce((acc, player) => {
  acc[player.id] = 0;
  return acc;
}, {});

export const EMPTY_STAT_CARD_DATA = {
    totalPrizePool: 0,
    biggestWinner: { name: 'N/A', prizeWon: 0 },
    biggestLoser: { name: 'N/A', prizeWon: 0 },
}

export const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52D17C',
  '#FF85A2', '#7FCDFF'
];


export const AVATAR_GRADIENTS = [
  'from-pink-500 to-rose-500',
  'from-purple-500 to-indigo-500',
  'from-blue-500 to-cyan-500',
  'from-green-500 to-emerald-500',
  'from-yellow-500 to-orange-500',
  'from-red-500 to-pink-500',
  'from-indigo-500 to-purple-500',
  'from-cyan-500 to-blue-500',
  'from-emerald-500 to-teal-500',
  'from-orange-500 to-red-500',
  'from-fuchsia-500 to-pink-500',
  'from-teal-500 to-cyan-500',
];