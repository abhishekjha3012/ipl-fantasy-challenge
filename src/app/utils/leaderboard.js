export const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
};

export const getMatchesPlayed = (matchData, playerId) => {
    if (!Array.isArray(matchData) || !playerId) return 0;
    let matchesPlayed = 0;
    matchData.forEach((match) => {
      const playerInMatch = match.played.find(id => id === playerId);
      if (playerInMatch) matchesPlayed++;
    });
    return matchesPlayed;
};

export const findBestMatch = (player, perMatchPlayerWinningMinusFee) => {
  const playerId = player.playerId;
  const winningsMinusFee = perMatchPlayerWinningMinusFee[playerId] || [];
  if (winningsMinusFee.length === 0) return 0;
  const bestMatch = Math.max(...winningsMinusFee);
  if (bestMatch <= 0) return 'Yet to happen';
  return `₹${bestMatch.toLocaleString('en-IN')}`;
}

export const findAvgPerMatch = (player, perMatchPlayerWinningMinusFee) => {
  const playerId = player.playerId;
  const winningsMinusFee = perMatchPlayerWinningMinusFee[playerId] || [];
  if (winningsMinusFee.length === 0) return 0;
  const total = winningsMinusFee.reduce((sum, val) => sum + val, 0);
  const avg = total / winningsMinusFee.length;
  return avg.toFixed(2);
}

export const findAverageRank = (playerId, perMatchPlayerRanks) => {
  const ranks = perMatchPlayerRanks.map(match => match.result[playerId]).filter(Boolean) || [];
  const playedMatch = perMatchPlayerRanks.map(match => match.played.includes(playerId)).filter(Boolean).length;
  if (ranks.length === 0) return 'N/A';
  if (ranks.length !== playedMatch) return 'Some matches missing';
  const totalRank = ranks.reduce((sum, val) => sum + val, 0);
  const avgRank = totalRank / playedMatch;
  return avgRank.toFixed(2);
}