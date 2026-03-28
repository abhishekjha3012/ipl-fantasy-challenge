import { PlayerProfile } from '../data/players';

export const extractPlayerNames = (players: (string | PlayerProfile)[]): string[] => {
  if (!Array.isArray(players)) return [];

  return players.map((item) => {
    if (typeof item === 'string') return item;
    return (item?.nickName || 'Unknown');
  }).filter(Boolean) as string[];
};

export const createStatsCardData = (matchData: any[], playerNames: string[]) => {
  const statsCardData: Record<string, any> = {};

  playerNames.forEach(name => {
    const prizeWon = matchData.reduce((sum, match) => sum + (match[name] || 0), 0);
    const lastMatchWin = matchData[matchData.length - 1]?.[name] || 0;
    const wins = matchData.filter(match => match[name] > 0).length;
    const winRate = matchData.length > 0 ? Math.round((wins / matchData.length) * 100) : 0;
    const bestMatch = Math.max(...matchData.map(match => match[name] || 0));
    const avgPerMatch = matchData.length > 0 ? Math.round(prizeWon / matchData.length) : 0;

    statsCardData[name] = {
      prizeWon,
      lastMatchWin,
      winRate,
      bestMatch,
      avgPerMatch,
    };
  });
  return statsCardData;
}