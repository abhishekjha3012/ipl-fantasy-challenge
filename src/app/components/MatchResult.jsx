import { Trophy } from 'lucide-react';
import { PLAYERS } from '../data/players';
import { useMatchData } from '../MatchDataContext';

export function MatchResult() {
     const { rawMatchData } = useMatchData();
  if (!Array.isArray(rawMatchData) || rawMatchData.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-white/20">
        <div className="text-white text-center">No match data available</div>
      </div>
    );
  }

  // Create a map of playerId to name for quick lookup
  const playerIdToName = PLAYERS.reduce((acc, player) => {
    acc[player.id] = player.name;
    return acc;
  }, {});

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-white/20 relative overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="text-yellow-400" size={24} />
        <h2 className="text-xl font-bold text-white">Match Results</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-white">
          <thead>
            <tr className="border-b border-white/20">
              <th className="text-left py-2 px-2">#</th>
              <th className="text-left py-2 px-2">Match</th>
              <th className="text-center py-2 px-1">🥇 1st</th>
              <th className="text-center py-2 px-1">🥈 2nd</th>
              <th className="text-center py-2 px-1">🥉 3rd</th>
              <th className="text-center py-2 px-1">4th</th>
              <th className="text-center py-2 px-1">5th</th>
              <th className="text-center py-2 px-1">6th</th>
              <th className="text-center py-2 px-1">7th</th>
              <th className="text-center py-2 px-1">8th</th>
              <th className="text-center py-2 px-1">9th</th>
              <th className="text-center py-2 px-1">10th</th>
            </tr>
          </thead>
          <tbody>
            {rawMatchData.map((match, index) => {
              // Sort players by absolute value ascending, but put 0s last
              const sortedResults = Object.entries(match.result || {})
                .sort(([, a], [, b]) => {
                  const absA = Math.abs(Number(a));
                  const absB = Math.abs(Number(b));
                  if (absA === 0 && absB === 0) return 0;
                  if (absA === 0) return 1; // 0 comes after non-zero
                  if (absB === 0) return -1; // non-zero comes before 0
                  return absA - absB;
                })
                .slice(0, 10); // Take top 10

              return (
                <tr key={match.number || index} className="border-b border-white/10 hover:bg-white/5">
                  <td className="py-3 px-2 font-semibold">
                    {match.number || (index + 1)}
                  </td>
                  <td className="py-3 px-2">
                    {match.match || 'Unknown Match'}
                  </td>
                  {Array.from({ length: 10 }, (_, rankIndex) => {
                    const playerEntry = sortedResults[rankIndex];
                    if (!playerEntry) {
                      return <td key={rankIndex} className="py-3 px-1 text-center text-white/30">-</td>;
                    }
                    const [playerId, score] = playerEntry;
                    const playerName = playerIdToName[playerId] || playerId;
                    return (
                      <td key={rankIndex} className="py-3 px-1 text-center">
                        <div className="text-xs font-medium truncate">
                          {playerName}
                        </div>
                        <div className="text-xs text-white/60">
                          {score}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}