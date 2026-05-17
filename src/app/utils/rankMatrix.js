import { INITIAL_PLAYER_MATRIX } from '../data/emptyData';

export const calculateEachPlayerMatrix = (matchData, playerIds) => {
  const rankMatrix = INITIAL_PLAYER_MATRIX;

  matchData.forEach(match => {
    const resultEntries = Object.entries(match.result || {});
    const playedPlayerIds = new Set(resultEntries.map(([id]) => id));

    playerIds.forEach((playerId) => {
      if (playedPlayerIds.has(playerId)) {
        // Player played in this match
        const rankValue = match.result[playerId];
        const rank = String(rankValue);
        if (rankMatrix[playerId] && rankMatrix[playerId][rank] !== undefined) {
          rankMatrix[playerId][rank]++;
        }
      } else {
        // Player didn't play in this match
        if (rankMatrix[playerId] && rankMatrix[playerId]['0'] !== undefined) {
          rankMatrix[playerId]['0']++;
        }
      }
    });
  });

  return rankMatrix;
};
