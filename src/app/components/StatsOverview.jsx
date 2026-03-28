import { TrendingUp, TrendingDown, IndianRupee } from 'lucide-react';
import { StatsCard } from './StatsCard';

export function StatsOverview({ playerData }) {
  const totalPrizePool = playerData.reduce((sum, p) => sum + Math.abs(p.prizeWon), 0);
  const biggestWinner = playerData.reduce((max, p) => p.prizeWon > max.prizeWon ? p : max, playerData[0] || { prizeWon: 0, name: 'N/A' });
  const biggestLoser = playerData.reduce((min, p) => p.prizeWon < min.prizeWon ? p : min, playerData[0] || { prizeWon: 0, name: 'N/A' });

  return (
    <div
      className="grid grid-cols-3 gap-2"
      style={{ animation: 'slideUp 0.6s ease-out 0.1s both' }}
    >
      <StatsCard
        label="Prize Pool"
        value={`₹${(totalPrizePool / 1000).toFixed(0)}k`}
        icon={<IndianRupee size={18} className="text-purple-400" />}
        gradient="bg-gradient-to-br from-purple-500 to-pink-500"
        delay={0.1}
      />
      <StatsCard
        label="First"
        value={`₹${(biggestWinner.prizeWon / 1000).toFixed(1)}k`}
        subtext={biggestWinner.name?.split(' ')[0] || 'N/A'}
        icon={<TrendingUp size={18} className="text-green-400" />}
        gradient="bg-gradient-to-br from-green-500 to-emerald-500"
        delay={0.15}
      />
      <StatsCard
        label="Last"
        value={`₹${Math.abs(biggestLoser.prizeWon / 1000).toFixed(1)}k`}
        subtext={biggestLoser.name?.split(' ')[0] || 'N/A'}
        icon={<TrendingDown size={18} className="text-red-400" />}
        gradient="bg-gradient-to-br from-red-500 to-orange-500"
        delay={0.2}
      />
    </div>
  );
}
