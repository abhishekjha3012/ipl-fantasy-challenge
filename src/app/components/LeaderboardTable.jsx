import { Trophy, TrendingUp, TrendingDown, 
  Flame, ChevronDown, Award, Target, 
  BarChart3 
} from 'lucide-react';
import { PlayerAvatar } from './PlayerAvatar';
import { useState, useMemo } from 'react';
import { useMatchData } from '../MatchDataContext';
import { getMatchesPlayed, findBestMatch, findAvgPerMatch} from '../utils/leaderboard';

export function LeaderboardTable() {
  const { rawMatchData, perMatchPlayerTotal, overallPlayerTotal, 
    perMatchPlayerWinningMinusFee } = useMatchData();
  const [expandedPlayer, setExpandedPlayer] = useState(null);
  
  // Sort by prize won (descending)
  const sortedPlayers = useMemo(() => {
    // perMatchPlayerWinningMinusFee is an object with playerId as key and array of winnings minus fee as value
    const amPlayer = overallPlayerTotal.find(player => player.playerId === 'AM');
    const otherPlayers = overallPlayerTotal.filter(player => player.playerId !== 'AM');
    
    const sortedList = otherPlayers.sort((a, b) => 
      b.prizeWon - a.prizeWon
    );
    
    // Append AM at the end if found
    if (amPlayer) {
      sortedList.push(amPlayer);
    }
    
    return sortedList;
  }, [overallPlayerTotal]);

  const getRecentFormIndicator = (player) => {
    const totalMatches = rawMatchData.length || 0;
    if(totalMatches === 0) return null;
    const id = player.playerId;
    const recentForm = perMatchPlayerWinningMinusFee[id]?.slice(-5) || [];
    return (
      <div className="flex items-center gap-1" title="Recent form (last matches)">
        {recentForm.map((result, idx) => (
          <div
            key={idx}
            className={`w-2 h-2 rounded-full ${
              result > 0 ? 'bg-green-400' :
              result === 0 ? 'bg-yellow-400' :
              result < 0 ? 'bg-red-400' :
              'bg-red-400'
            }`}
            title={`₹${result.toLocaleString('en-IN')}`}
          />
        ))}
      </div>
    );
  };

  const toggleExpand = (playerName) => {
    setExpandedPlayer(expandedPlayer === playerName ? null : playerName);
  };

  const getWinRate = (player) => {
    const totalMatches = rawMatchData.length || 0;
    if(totalMatches === 0) return 0;
    const id = player.playerId;
    const matchesWon = perMatchPlayerWinningMinusFee[id]?.filter(win => win > 0).length || 0;
    return Math.round((matchesWon / totalMatches) * 100) || 0;
  };

  const getLastMatchWin = (player, perMatchPlayerWinningMinusFee) => {
    const id = player.playerId;
    const winningsMinusFee = perMatchPlayerWinningMinusFee[id] || [];
    if (winningsMinusFee.length === 0) return 0;
    return winningsMinusFee.at(-1) || 0;
  };

  return (
    <div 
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-white/20 relative overflow-hidden"
      style={{ animation: 'slideUp 0.6s ease-out 0.3s both' }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="text-yellow-400" size={24} />
        <h2 className="text-xl font-bold text-white">Leaderboard</h2>
      </div>
      
      <div className="space-y-3">
        {sortedPlayers.map((player, index) => {
          const isExpanded = expandedPlayer === player.name;
          
          return (
            <div 
              key={player.name} 
              className={`relative rounded-xl p-3 transition-all hover:scale-[1.02] active:scale-[0.99] ${
                index === 0 ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/30 shadow-lg shadow-yellow-500/20' :
                index === 1 ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-400/30 shadow-lg shadow-yellow-400/10' :
                index === 2 ? 'bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border-2 border-yellow-400/30 shadow-lg shadow-yellow-400/10' :
                'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
              style={{ animation: `slideUp 0.4s ease-out ${0.4 + index * 0.05}s both` }}
            >
              <div 
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => toggleExpand(player.name)}
              >
                {/* Rank */}
                <div className="flex items-center justify-center w-8">
                  {index === 0 && <span className="text-2xl">🥇</span>}
                  {index === 1 && <span className="text-2xl">🥈</span>}
                  {index === 2 && <span className="text-2xl">🥉</span>}
                  {index > 2 && (
                    <span className="text-white/50 text-sm font-bold">{index + 1}</span>
                  )}
                </div>

                {/* Avatar */}
                <PlayerAvatar name={player.name} />

                {/* Player Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-semibold text-sm truncate">
                      {player.name}
                    </span>
                    {getRecentFormIndicator(player)}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/50 mt-0.5 flex-wrap">
                    <span>{getMatchesPlayed(rawMatchData, player.playerId)} / {rawMatchData.length} matches</span>
                    <span className="text-blue-300">
                      {getWinRate(player)}% win rate
                    </span>
                  </div>
                </div>

                {/* Winnings & Expand Arrow */}
                <div className="text-right flex items-center gap-2">
                  <div>
                    <div className="flex items-center gap-1 justify-end">
                      {perMatchPlayerTotal[player.playerId].at(-1) > 0 ? (
                        <TrendingUp size={16} className="text-green-400" />
                      ) : (
                        <TrendingDown size={16} className="text-red-400" />
                      )}
                      <span className={`font-bold text-base ${
                        perMatchPlayerTotal[player.playerId].at(-1) > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        ₹{perMatchPlayerTotal[player.playerId].at(-1).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                  <ChevronDown 
                    size={16} 
                    className={`text-white/50 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-3 gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="bg-white/5 rounded-lg p-2 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Award size={12} className="text-yellow-400" />
                      <span className="text-white/60 text-xs">Best Match</span>
                    </div>
                    <div className="text-green-400 font-bold text-sm">
                      {findBestMatch(player, perMatchPlayerWinningMinusFee)}
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-2 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <BarChart3 size={12} className="text-blue-400" />
                      <span className="text-white/60 text-xs">Avg/Match</span>
                    </div>
                    <div className={`font-bold text-sm ${
                      (findAvgPerMatch(player, perMatchPlayerWinningMinusFee) || 0) > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      ₹{findAvgPerMatch(player, perMatchPlayerWinningMinusFee)}
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-2 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Target size={12} className="text-purple-400" />
                      <span className="text-white/60 text-xs">Last Match</span>
                    </div>
                    <div className={`font-bold text-sm ${
                      (getLastMatchWin(player, perMatchPlayerWinningMinusFee) || 0) > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {(getLastMatchWin(player, perMatchPlayerWinningMinusFee) || 0) > 0 ? '+' : ''}₹{getLastMatchWin(player, perMatchPlayerWinningMinusFee)?.toLocaleString('en-IN') || '0'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}