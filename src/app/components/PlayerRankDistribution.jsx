import { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BarChart3, ChevronDown } from 'lucide-react';
import { useMatchData } from '../MatchDataContext';
import { PLAYERS } from '../data/players';
import { COLORS } from '../data/emptyData';

export function PlayerRankDistribution() {
  const { rankMatrix } = useMatchData();
  const [selectedPlayers, setSelectedPlayers] = useState([null, null]);
  const [isDropdownOpen, setIsDropdownOpen] = useState([false, false]);

  const playerIds = useMemo(() => Object.keys(rankMatrix).sort(), [rankMatrix]);
  const playerNameById = useMemo(
    () => Object.fromEntries(PLAYERS.map((player) => [player.id, player.nickName])),
    [],
  );

  const chartData = useMemo(() => {
    const ranks = ['-1','0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    return ranks.map((rank) => {
      const dataPoint = { rank };
      selectedPlayers.forEach((playerId, idx) => {
        if (playerId && rankMatrix[playerId]) {
          dataPoint[playerId] = rankMatrix[playerId][rank] || 0;
        }
      });
      return dataPoint;
    });
  }, [rankMatrix, selectedPlayers]);

  const handlePlayerSelect = (index, playerId) => {
    const newSelection = [...selectedPlayers];
    newSelection[index] = playerId;
    setSelectedPlayers(newSelection);
    const newDropdownState = [...isDropdownOpen];
    newDropdownState[index] = false;
    setIsDropdownOpen(newDropdownState);
  };

  const toggleDropdown = (index) => {
    const newState = [...isDropdownOpen];
    newState[index] = !newState[index];
    setIsDropdownOpen(newState);
  };

  return (
    <div
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-white/20"
      style={{ animation: 'slideUp 0.6s ease-out 0.9s both' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="text-cyan-300" size={24} />
          <div>
            <h2 className="text-xl font-bold text-white">Rank Distribution</h2>
            <p className="text-sm text-white/60">Compare player rank distributions</p>
          </div>
        </div>
      </div>

      {/* Player Selection Dropdowns */}
      <div className="flex gap-3 mb-4">
        {[0, 1].map((index) => (
          <div key={index} className="relative flex-1">
            <button
              onClick={() => toggleDropdown(index)}
              className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white flex justify-between items-center"
            >
              <span className="text-sm">
                {selectedPlayers[index]
                  ? `${playerNameById[selectedPlayers[index]] ?? selectedPlayers[index]} (${selectedPlayers[index]})`
                  : `Select Player ${index + 1}`}
              </span>
              <ChevronDown size={16} className={`${isDropdownOpen[index] ? 'rotate-180' : ''} transition-transform`} />
            </button>

            {isDropdownOpen[index] && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl z-10 max-h-64 overflow-y-auto">
                <div className="p-2">
                  {playerIds.map((playerId) => (
                    <button
                      key={playerId}
                      onClick={() => handlePlayerSelect(index, playerId)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedPlayers[index] === playerId
                          ? 'bg-blue-400/30 text-white'
                          : 'hover:bg-white/5 text-white/80 hover:text-white'
                      }`}
                    >
                      {playerNameById[playerId] ?? playerId}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Chart */}
      {selectedPlayers.some(p => p !== null) && playerIds.length > 0 ? (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 12, right: 8, left: 0, bottom: 4 }} barCategoryGap="30%" barGap="2%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
              <XAxis dataKey="rank" stroke="rgba(255,255,255,0.6)" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
              <YAxis stroke="rgba(255,255,255,0.6)" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(15, 23, 42, 0.95)',
                  borderColor: 'rgba(255,255,255,0.12)',
                  color: '#fff',
                }}
                cursor={{ fill: 'rgba(255,255,255,0.08)' }}
              />
              <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }} />
              {selectedPlayers.map((playerId, idx) => {
                if (!playerId) return null;
                return (
                  <Bar
                    key={playerId}
                    dataKey={playerId}
                    name={playerNameById[playerId] ?? playerId}
                    fill={COLORS[idx % COLORS.length]}
                    radius={[8, 8, 0, 0]}
                  />
                );
              })}
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-72 flex items-center justify-center text-white/50">
          Select at least one player to view rank distribution
        </div>
      )}
    </div>
  );
}
