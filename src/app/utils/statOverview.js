import { PLAYERS } from '../data/players';
import { calculateNetTotalForPlayer } from './app';

export const createStatsCardData = (matchData, playerIds) => {
  const statsCardData = {
    totalPrizePool: 0,
    biggestWinner: { name: 'N/A', prizeWon: 0 },
    biggestLoser: { name: 'N/A', prizeWon: 0 },
  };

  let playerNetTotals = [];

  playerIds.forEach((playerId) => { 
    const netTotal = calculateNetTotalForPlayer(matchData, playerId);
    const playerName = PLAYERS.find(player => player.id === playerId)?.name;
    playerNetTotals.push({ 
      name: playerName || 'Unknown', 
      prizeWon : netTotal || 0
    });
  });

  const sortedByNetTotal = playerNetTotals.sort((a, b) => b.prizeWon - a.prizeWon);

  statsCardData.totalPrizePool = sortedByNetTotal.reduce((sum, player) => 
    sum + Math.abs(player.prizeWon), 0);
  statsCardData.biggestWinner = sortedByNetTotal[0];
  statsCardData.biggestLoser = sortedByNetTotal[sortedByNetTotal.length - 1];

  return statsCardData;
}