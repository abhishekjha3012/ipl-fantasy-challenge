import { PRIZE_POOL, ENTRY_FEE, 
  LEAGUE_MATCHES, KNOCKOUT_MATCHES, 
  FINAL_MATCHES, WINNER_TAKES_ALL_PRIZE_POOL 
} from '../data/prize';

import { PLAYERS } from '../data/players';

export const calculateNetTotalForPlayer = (matchData, playerId) => {
  if (!Array.isArray(matchData) || !playerId) return 0;

  return matchData.reduce((acc, match) => {
    const winningAmount = extractWinningAmountForPlayerInMatch(match, playerId);
    const entryFee = extractEntryFeeForPlayerInMatch(match, playerId);
    return acc + (winningAmount ?? 0) - entryFee;
  }, 0);
};

export const extractPlayerDetailByKey = (players, key) => {
  if (!Array.isArray(players)) return [];

  return players.map((item) => {
    if (typeof item === 'string') return item;
    return (item?.[key] || 'Unknown');
  }).filter(Boolean);
};

const getPrizeForWinnerTakesAllMatch = (match, playerId) => {
  const whoWonTakeAll = Object.keys(match.result).find(key => match.result[key] === -1);
  if(whoWonTakeAll === playerId) {
    const playedLength = Number(match.played?.length);
    return WINNER_TAKES_ALL_PRIZE_POOL[playedLength];
  } else {
    return 0;
  }
};

const extractWinningAmountForPlayerInMatch = (match, playerId) => {
  const didWinnerTakesAll = Object.values(match.result).includes(-1);
  if(didWinnerTakesAll) {
    const winnerTakesAllPrize = getPrizeForWinnerTakesAllMatch(match, playerId);
    return winnerTakesAllPrize; 
  } 

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
    const playerWinningTotaArray = [];
    let total = 0;
    matchData.forEach((match) => {
      const winningAmount = extractWinningAmountForPlayerInMatch(match, playerId);
      const entryFee = extractEntryFeeForPlayerInMatch(match, playerId);
      total += (winningAmount ?? 0) - entryFee;
      playerWinningTotaArray.push(total);
    });
    result[playerId] = playerWinningTotaArray;
  });
  return result;
};

export const calculateTotalPlayerWinning = (matchData, playerIds) => {
  if (!Array.isArray(matchData) || !Array.isArray(playerIds)) return 0;
  let playerNetTotals = [];
  
  playerIds.forEach((playerId) => { 
    const netTotal = calculateNetTotalForPlayer(matchData, playerId);
    const playerName = PLAYERS.find(player => player.id === playerId)?.name;
    const playerNickname = PLAYERS.find(player => player.id === playerId)?.nickName;
    playerNetTotals.push({ 
      name: playerName || 'Unknown', 
      nickName: playerNickname || 'Unknown',
      prizeWon : netTotal || 0,
      playerId: playerId,
    });
  });

  return playerNetTotals;
};
