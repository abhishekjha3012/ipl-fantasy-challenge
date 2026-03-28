import { PRIZE_POOL } from '../data/prize';

export const calculateNetTotalForPlayer = (matchData, playerId) => {
  if (!Array.isArray(matchData) || !playerId) return 0;

  return matchData.reduce((acc, match) => {
    const playedLength = Number(match.played?.length);
    const prizeArray = PRIZE_POOL[playedLength];
    const position = match.result?.[playerId];
    return acc + (prizeArray[position] ?? 0);
  }, 0);
};

export const extractPlayerDetailByKey = (players, key) => {
  if (!Array.isArray(players)) return [];

  return players.map((item) => {
    if (typeof item === 'string') return item;
    return (item?.[key] || 'Unknown');
  }).filter(Boolean);
};

