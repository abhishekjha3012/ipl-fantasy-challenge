import { Trophy, TrendingUp, TrendingDown, Flame, Sparkles, ChevronDown, Award, Target, BarChart3 } from 'lucide-react';
import { PlayerAvatar } from './PlayerAvatar';
import { useState } from 'react';

interface PlayerData {
  name: string;
  totalMatches: number;
  matchesPlayed: number;
  prizeWon: number;
  lastMatchWin?: number;
  streak?: number;
  winRate?: number;
  bestMatch?: number;
  avgPerMatch?: number;
  recentForm?: number[]; // Last 3-5 matches results
}

interface LeaderboardTableProps {
  players: PlayerData[];
}

export function LeaderboardTable({ players }: LeaderboardTableProps) {
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null);
  
  // Sort by prize won (descending)
  const sortedPlayers = [...players].sort((a, b) => b.prizeWon - a.prizeWon);

  const getStreakIcon = (streak: number | undefined) => {
    if (!streak) return null;
    if (Math.abs(streak) >= 3) {
      return streak > 0 ? (
        <div className="flex items-center gap-1 text-green-400" title={`${streak} win streak`}>
          <Flame size={14} />
          <span className="text-xs font-bold">{streak}</span>
        </div>
      ) : (
        <div className="flex items-center gap-1 text-red-400" title={`${Math.abs(streak)} loss streak`}>
          <Flame size={14} className="rotate-180" />
          <span className="text-xs font-bold">{Math.abs(streak)}</span>
        </div>
      );
    }
    return null;
  };

  const getRecentFormIndicator = (recentForm: number[] | undefined) => {
    if (!recentForm || recentForm.length === 0) return null;
    
    return (
      <div className="flex items-center gap-1" title="Recent form (last matches)">
        {recentForm.map((result, idx) => (
          <div
            key={idx}
            className={`w-2 h-2 rounded-full ${
              result > 1000 ? 'bg-green-400' :
              result > 0 ? 'bg-yellow-400' :
              result > -1000 ? 'bg-orange-400' :
              'bg-red-400'
            }`}
            title={`₹${result.toLocaleString('en-IN')}`}
          />
        ))}
      </div>
    );
  };

  const toggleExpand = (playerName: string) => {
    setExpandedPlayer(expandedPlayer === playerName ? null : playerName);
  };

  return (
    <div 
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-white/20 relative overflow-hidden"
      style={{ animation: 'slideUp 0.6s ease-out 0.3s both' }}
    >
      {/* Sparkle effect for top performer */}
      {sortedPlayers[0]?.prizeWon > 5000 && (
        <div className="absolute top-4 right-4 text-yellow-400 animate-pulse">
          <Sparkles size={20} />
        </div>
      )}
      
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
                index === 1 ? 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-2 border-gray-400/30 shadow-lg shadow-gray-400/10' :
                index === 2 ? 'bg-gradient-to-r from-orange-400/20 to-orange-500/20 border-2 border-orange-400/30 shadow-lg shadow-orange-400/10' :
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
                <PlayerAvatar name={player.name} size="md" />

                {/* Player Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-semibold text-sm truncate">
                      {player.name}
                    </span>
                    {getStreakIcon(player.streak)}
                    {getRecentFormIndicator(player.recentForm)}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/50 mt-0.5 flex-wrap">
                    <span>{player.matchesPlayed}/{player.totalMatches} matches</span>
                    {player.winRate !== undefined && (
                      <span className="text-blue-300">
                        {player.winRate}% win rate
                      </span>
                    )}
                  </div>
                </div>

                {/* Winnings & Expand Arrow */}
                <div className="text-right flex items-center gap-2">
                  <div>
                    <div className="flex items-center gap-1 justify-end">
                      {player.prizeWon > 0 ? (
                        <TrendingUp size={16} className="text-green-400" />
                      ) : (
                        <TrendingDown size={16} className="text-red-400" />
                      )}
                      <span className={`font-bold text-base ${
                        player.prizeWon > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        ₹{Math.abs(player.prizeWon).toLocaleString('en-IN')}
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
                      ₹{player.bestMatch?.toLocaleString('en-IN') || '0'}
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-2 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <BarChart3 size={12} className="text-blue-400" />
                      <span className="text-white/60 text-xs">Avg/Match</span>
                    </div>
                    <div className={`font-bold text-sm ${
                      (player.avgPerMatch || 0) > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      ₹{player.avgPerMatch?.toLocaleString('en-IN') || '0'}
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-2 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Target size={12} className="text-purple-400" />
                      <span className="text-white/60 text-xs">Last Match</span>
                    </div>
                    <div className={`font-bold text-sm ${
                      (player.lastMatchWin || 0) > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {(player.lastMatchWin || 0) > 0 ? '+' : ''}₹{player.lastMatchWin?.toLocaleString('en-IN') || '0'}
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