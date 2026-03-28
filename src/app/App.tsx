import { LeaderboardTable } from './components/LeaderboardTable';
import { TrendGraph } from './components/TrendGraph';
import { StatsCard } from './components/StatsCard';
import { RulesModal } from './components/RulesModal';import { Footer } from './components/Footer';import { Trophy, TrendingUp, TrendingDown, IndianRupee, Info } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { PLAYERS, PlayerProfile } from './data/players';
import { fetchTournamentMatches, normalizeTournamentMatchData } from './api/tournamentApi';

const extractPlayerNames = (players: (string | PlayerProfile)[]): string[] => {
  if (!Array.isArray(players)) return [];

  return players.map((item) => {
    if (typeof item === 'string') return item;
    return item?.name || item?.nickName || item?.id || String(item?.num || 'Unknown');
  }).filter(Boolean) as string[];
};

// Generate mock match-by-match data (10 matches so far)
const generateMatchData = (playerNames: string[]) => {
  const matchData: any[] = [];

  for (let match = 1; match <= 10; match++) {
    const matchEntry: any = { match };

    playerNames.forEach(player => {
      // Random win/loss between -3000 to +5000 per match
      const result = Math.floor(Math.random() * 8000) - 3000;
      matchEntry[player] = result;
    });

    matchData.push(matchEntry);
  }

  return matchData;
};

// Calculate winning/losing streaks
const calculateStreak = (matchData: any[], playerName: string): number => {
  let streak = 0;
  for (let i = matchData.length - 1; i >= 0; i--) {
    const result = matchData[i][playerName];
    if (streak === 0) {
      streak = result > 0 ? 1 : result < 0 ? -1 : 0;
    } else if ((streak > 0 && result > 0) || (streak < 0 && result < 0)) {
      streak = streak > 0 ? streak + 1 : streak - 1;
    } else {
      break;
    }
  }
  return streak;
};

// Generate mock data for leaderboard table
const generatePlayerData = (matchData: any[], players: (string | PlayerProfile)[]) => {
  const playerNames = extractPlayerNames(players);

  return playerNames.map(name => {
    const prizeWon = matchData.reduce((sum, match) => sum + (match[name] || 0), 0);
    const lastMatchWin = matchData[matchData.length - 1]?.[name] || 0;
    const streak = calculateStreak(matchData, name);
    const wins = matchData.filter(match => match[name] > 0).length;
    const winRate = matchData.length > 0 ? Math.round((wins / matchData.length) * 100) : 0;
    const bestMatch = Math.max(...matchData.map(match => match[name] || 0));
    const avgPerMatch = matchData.length > 0 ? Math.round(prizeWon / matchData.length) : 0;
    const recentForm = matchData.slice(-5).map(match => match[name]);

    return {
      name,
      totalMatches: matchData.length,
      matchesPlayed: Math.min(matchData.length, Math.max(0, Math.floor(Math.random() * matchData.length) + 1)),
      prizeWon,
      lastMatchWin,
      streak,
      winRate,
      bestMatch,
      avgPerMatch,
      recentForm,
    };
  });
};

export default function App() {
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [rawMatchData, setRawMatchData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const playerNames = extractPlayerNames(PLAYERS);

  const matchData = useMemo(() => {
    if (rawMatchData.length > 0) {
      return normalizeTournamentMatchData(rawMatchData, playerNames);
    }
    return generateMatchData(playerNames);
  }, [rawMatchData, playerNames]);

  const playerData = generatePlayerData(matchData, PLAYERS);

  // Calculate stats
  const totalPrizePool = playerData.reduce((sum, p) => sum + Math.abs(p.prizeWon), 0);
  const biggestWinner = playerData.reduce((max, p) => p.prizeWon > max.prizeWon ? p : max, playerData[0] || { prizeWon: 0, name: 'N/A' });
  const biggestLoser = playerData.reduce((min, p) => p.prizeWon < min.prizeWon ? p : min, playerData[0] || { prizeWon: 0, name: 'N/A' });

  const totalMatches = matchData.length;
  const completedMatches = totalMatches > 0 ? totalMatches : 0;

  useEffect(() => {
    let alive = true;

    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchTournamentMatches();
        if (alive && Array.isArray(data)) {
          setRawMatchData(data);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setError(`Could not load tournament results: ${message}`);
      } finally {
        if (alive) setIsLoading(false);
      }
    };

    loadData();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex justify-center overflow-auto relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Mobile-centric container */}
      <div className="w-full max-w-md min-h-screen p-4 space-y-4 pb-20 relative z-10">
        {/* Header */}
        <div 
          className="text-center pt-6 pb-2 relative"
          style={{ animation: 'slideUp 0.6s ease-out 0s both' }}
        >
          {/* Info Icon - Top Right */}
          <button
            onClick={() => setIsRulesOpen(true)}
            className="absolute top-6 right-0 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full p-2 transition-all hover:scale-110 active:scale-95"
            aria-label="View league rules"
          >
            <Info size={20} className="text-white" />
          </button>

          <div className="flex items-center justify-center gap-3 mb-2">
            <Trophy className="text-yellow-400 drop-shadow-lg" size={36} />
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">IPL Fantasy</h1>
          </div>
          <p className="text-blue-200 text-sm">League Dashboard 2026</p>
          <div className="mt-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 inline-block border border-white/20">
            <p className="text-white text-xs flex flex-col sm:flex-row items-center sm:gap-2 justify-center">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="font-semibold">{isLoading ? 'Loading matches...' : `Match ${completedMatches}`}</span>
              <span>of {totalMatches} completed</span>
            </p>
            {error && <p className="text-red-300 text-xs mt-1">{error} (using fallback generated data)</p>}
          </div>
        </div>

        {/* Stats Cards */}
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
            subtext={biggestWinner.name.split(' ')[0]}
            icon={<TrendingUp size={18} className="text-green-400" />}
            gradient="bg-gradient-to-br from-green-500 to-emerald-500"
            delay={0.15}
          />
          <StatsCard
            label="Last"
            value={`₹${Math.abs(biggestLoser.prizeWon / 1000).toFixed(1)}k`}
            subtext={biggestLoser.name.split(' ')[0]}
            icon={<TrendingDown size={18} className="text-red-400" />}
            gradient="bg-gradient-to-br from-red-500 to-orange-500"
            delay={0.2}
          />
        </div>

        {/* Leaderboard Table */}
        <LeaderboardTable players={playerData} />

        {/* Trend Graph */}
        <TrendGraph matchData={matchData} playerNames={playerNames} />

        {/* Footer */}
        <Footer />
      </div>

      {/* Rules Modal */}
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
    </div>
  );
}