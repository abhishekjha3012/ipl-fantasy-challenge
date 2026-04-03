import { useMemo } from 'react';
import { TrendingUp, TrendingDown, IndianRupee } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { useMatchData } from '../MatchDataContext';
import { createStatsCardData } from '../utils/statOverview';
import { extractPlayerDetailByKey } from '../utils/app';
import { PLAYERS } from '../data/players';
import { EMPTY_STAT_CARD_DATA } from '../data/emptyData';

export function StatsOverview() {
  const { rawMatchData } = useMatchData();

  const playerIds = useMemo(() => 
    extractPlayerDetailByKey(PLAYERS, 'id'),
  [PLAYERS]);

  const statsCardData = useMemo(() => {
    if (rawMatchData.length > 0) {
      return createStatsCardData(rawMatchData, playerIds);
    }
    return EMPTY_STAT_CARD_DATA;
  }, [rawMatchData]);

  return (
    <div
      className="grid grid-cols-3 gap-2"
      style={{ animation: 'slideUp 0.6s ease-out 0.1s both' }}
    >
      <StatsCard
        label="Prize Pool"
        value={`₹${(statsCardData?.totalPrizePool || 0)}`}
        icon={<IndianRupee size={18} className="text-purple-400" />}
        gradient="bg-gradient-to-br from-purple-500 to-pink-500"
        delay={0.1}
      />
      <StatsCard
        label="First"
        value={`₹${(statsCardData?.biggestWinner?.prizeWon|| 0)}`}
        subtext={statsCardData?.biggestWinner?.nickName}
        icon={<TrendingUp size={18} className="text-green-400" />}
        gradient="bg-gradient-to-br from-green-500 to-emerald-500"
        delay={0.15}
      />
      <StatsCard
        label="Last"
        value={`₹${(statsCardData?.biggestLoser?.prizeWon || 0)}`}
        subtext={statsCardData?.biggestLoser?.nickName}
        icon={<TrendingDown size={18} className="text-red-400" />}
        gradient="bg-gradient-to-br from-red-500 to-orange-500"
        delay={0.2}
      />
    </div>
  );
}
