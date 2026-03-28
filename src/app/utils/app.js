import { PRIZE_POOL, ENTRY_FEE, 
  LEAGUE_MATCHES, KNOCKOUT_MATCHES, 
  FINAL_MATCHES 
} from '../data/prize';

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

const extractWinningAmountForPlayerInMatch = (match, playerId) => {
  const playedLength = Number(match.played?.length);
  const prizeArray = PRIZE_POOL[playedLength];
  const position = match.result?.[playerId];  
  const winningAmount = prizeArray?.[position];
  return winningAmount || 0;
}

const extractEntryFeeForPlayerInMatch = (match, playerId) => {
  const didplayerPlay = match.played?.includes(playerId);
  if (!didplayerPlay) return 0;
  let matchType = 'league'; // Default to league if type is missing
  switch (match.number) {
    case LEAGUE_MATCHES.includes(match.number):
      matchType = 'league';
      break;
    case KNOCKOUT_MATCHES.includes(match.number):
      matchType = 'knockout';
      break;
    case FINAL_MATCHES.includes(match.number):
      matchType = 'final';
      break;  
    default:
      matchType = 'league';
  }
  const entryFee = ENTRY_FEE[matchType];
  return entryFee;
}

export const calculatePerMatchPlayerWinning = (matchData, playerIds) => {
  if (!Array.isArray(matchData) || !Array.isArray(playerIds)) return 0;
  let result = {};
  playerIds.forEach((playerId) => {
    const playerWinningArray = [];
    matchData.forEach((match) => {
      const winningAmount = extractWinningAmountForPlayerInMatch(match, playerId);
      playerWinningArray.push(winningAmount ?? 0);
    });
    result[playerId] = playerWinningArray;
  });
  return result;
};

export const calculatePerMatchPlayeWinningMinusEntryFee = (matchData, playerIds) => {
  if (!Array.isArray(matchData) || !Array.isArray(playerIds)) return 0;
  let result = {};
  playerIds.forEach((playerId) => {
    const playerWinningArrayMinusEntryFee = [];
    matchData.forEach((match) => {
      const winningAmount = extractWinningAmountForPlayerInMatch(match, playerId);
      const entryFee = extractEntryFeeForPlayerInMatch(match, playerId);
      playerWinningArrayMinusEntryFee.push((winningAmount ?? 0) - entryFee);
    });
    result[playerId] = playerWinningArrayMinusEntryFee;
  });
  return result;
}

export const calculatePerMatchPlayerTotal = (matchData, playerIds) => {
  if (!Array.isArray(matchData) || !Array.isArray(playerIds)) return 0;
  let result = {};
  playerIds.forEach((playerId) => {
    let total = 0;
    matchData.forEach((match) => {
      const winningAmount = extractWinningAmountForPlayerInMatch(match, playerId);
      const entryFee = extractEntryFeeForPlayerInMatch(match, playerId);
      total += (winningAmount ?? 0) - entryFee;
    });
    result[playerId] = total;
  });
  return result;
};
