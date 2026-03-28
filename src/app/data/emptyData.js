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