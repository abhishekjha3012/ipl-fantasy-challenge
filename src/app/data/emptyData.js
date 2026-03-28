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