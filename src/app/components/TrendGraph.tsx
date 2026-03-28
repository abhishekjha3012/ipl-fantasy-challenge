import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, ChevronDown, X } from 'lucide-react';

interface MatchData {
  match: number;
  [playerName: string]: number;
}

interface TrendGraphProps {
  matchData: MatchData[];
  playerNames: string[];
}

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52D17C',
  '#FF85A2', '#7FCDFF'
];

export function TrendGraph({ matchData, playerNames }: TrendGraphProps) {
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>(playerNames.slice(0, 3));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const togglePlayer = (player: string) => {
    setSelectedPlayers(prev => {
      if (prev.includes(player)) {
        return prev.filter(p => p !== player);
      } else {
        return [...prev, player];
      }
    });
  };

  const selectAll = () => {
    setSelectedPlayers(playerNames);
  };

  const clearAll = () => {
    setSelectedPlayers([]);
  };

  // Calculate cumulative winnings for each player
  const cumulativeData = useMemo(() => {
    return matchData.map((match, index) => {
      const cumulative: MatchData = { match: match.match };
      
      playerNames.forEach(player => {
        let sum = 0;
        for (let i = 0; i <= index; i++) {
          sum += matchData[i][player] || 0;
        }
        cumulative[player] = sum;
      });
      
      return cumulative;
    });
  }, [matchData, playerNames]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-lg p-3 shadow-xl">
          <p className="text-white font-semibold mb-2">Match {label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: ₹{entry.value.toLocaleString('en-IN')}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-white/20"
      style={{ animation: 'slideUp 0.6s ease-out 0.9s both' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="text-blue-400" size={24} />
          <h2 className="text-xl font-bold text-white">Winnings Trend</h2>
        </div>
      </div>

      {/* Player Filter Dropdown */}
      <div className="mb-4 relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl px-4 py-3 flex items-center justify-between text-white transition-all"
        >
          <span className="text-sm">
            {selectedPlayers.length === 0 
              ? 'Select players to view' 
              : `${selectedPlayers.length} player${selectedPlayers.length > 1 ? 's' : ''} selected`}
          </span>
          <ChevronDown size={20} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl z-10 max-h-64 overflow-y-auto">
            <div className="flex items-center justify-between p-3 border-b border-white/10">
              <button
                onClick={selectAll}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium"
              >
                Select All
              </button>
              <button
                onClick={clearAll}
                className="text-xs text-red-400 hover:text-red-300 font-medium"
              >
                Clear All
              </button>
            </div>
            <div className="p-2">
              {playerNames.map((player, index) => (
                <button
                  key={player}
                  onClick={() => togglePlayer(player)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    selectedPlayers.includes(player)
                      ? 'border-blue-400 bg-blue-400'
                      : 'border-white/30'
                  }`}>
                    {selectedPlayers.includes(player) && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="text-white text-sm">{player}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selected Players Pills */}
      {selectedPlayers.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedPlayers.map((player, index) => {
            const colorIndex = playerNames.indexOf(player);
            return (
              <div
                key={player}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20"
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: COLORS[colorIndex] }}
                />
                <span className="text-white text-xs">{player}</span>
                <button
                  onClick={() => togglePlayer(player)}
                  className="text-white/50 hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Chart */}
      {selectedPlayers.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={cumulativeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="match"
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
              label={{ value: 'Match Number', position: 'insideBottom', offset: -5, fill: 'rgba(255,255,255,0.7)' }}
            />
            <YAxis
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
              label={{ value: 'Cumulative Winnings (₹)', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.7)' }}
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            {selectedPlayers.map((player) => {
              const colorIndex = playerNames.indexOf(player);
              return (
                <Line
                  key={player}
                  type="monotone"
                  dataKey={player}
                  stroke={COLORS[colorIndex]}
                  strokeWidth={2}
                  dot={{ fill: COLORS[colorIndex], r: 4 }}
                  activeDot={{ r: 6 }}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-64 flex items-center justify-center text-white/50">
          Select at least one player to view the trend
        </div>
      )}
    </div>
  );
}