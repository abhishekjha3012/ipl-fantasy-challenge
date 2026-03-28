import { LeaderboardTable } from './components/LeaderboardTable';
import { TrendGraph } from './components/TrendGraph';
import { StatsOverview } from './components/StatsOverview';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { useState, useEffect, useMemo } from 'react';
import { fetchTournamentMatches } from './api/tournamentApi';
import { useMatchData } from './MatchDataContext';
import { calculatePerMatchPlayerWinning, calculatePerMatchPlayerTotal, extractPlayerDetailByKey } from './utils/app';
import { PLAYERS } from './data/players';
import { INITIAL_PLAYER_TOTALS } from './data/emptyData';

// Generate mock match-by-match data (10 matches so far)
// const generateMatchData = (playerNames: string[]) => {
//   const matchData: any[] = [];

//   for (let match = 1; match <= 10; match++) {
//     const matchEntry: any = { match };

//     playerNames.forEach(player => {
//       // Random win/loss between -3000 to +5000 per match
//       const result = Math.floor(Math.random() * 8000) - 3000;
//       matchEntry[player] = result;
//     });

//     matchData.push(matchEntry);
//   }

//   return matchData;
// };

// Calculate winning/losing streaks
// const calculateStreak = (matchData: any[], playerName: string): number => {
//   let streak = 0;
//   for (let i = matchData.length - 1; i >= 0; i--) {
//     const result = matchData[i][playerName];
//     if (streak === 0) {
//       streak = result > 0 ? 1 : result < 0 ? -1 : 0;
//     } else if ((streak > 0 && result > 0) || (streak < 0 && result < 0)) {
//       streak = streak > 0 ? streak + 1 : streak - 1;
//     } else {
//       break;
//     }
//   }
//   return streak;
// };

// Generate mock data for leaderboard table
// const generatePlayerData = (matchData: any[], players: (string | PlayerProfile)[]) => {
//   const playerNames = extractPlayerNames(players, 'name);

//   return playerNames.map(name => {
//     const prizeWon = matchData.reduce((sum, match) => sum + (match[name] || 0), 0);
//     const lastMatchWin = matchData[matchData.length - 1]?.[name] || 0;
//     const streak = calculateStreak(matchData, name);
//     const wins = matchData.filter(match => match[name] > 0).length;
//     const winRate = matchData.length > 0 ? Math.round((wins / matchData.length) * 100) : 0;
//     const bestMatch = Math.max(...matchData.map(match => match[name] || 0));
//     const avgPerMatch = matchData.length > 0 ? Math.round(prizeWon / matchData.length) : 0;
//     const recentForm = matchData.slice(-5).map(match => match[name]);

//     return {
//       name,
//       totalMatches: matchData.length,
//       matchesPlayed: Math.min(matchData.length, Math.max(0, Math.floor(Math.random() * matchData.length) + 1)),
//       prizeWon,
//       lastMatchWin,
//       streak,
//       winRate,
//       bestMatch,
//       avgPerMatch,
//       recentForm,
//     };
//   });
// };

export default function App() {
  const [ isLoading, setIsLoading ] = useState(false);
  const [ error, setError ] = useState(null);

  const playerIds = useMemo(() => 
    extractPlayerDetailByKey(PLAYERS, 'id'),
  [PLAYERS]);

  const { rawMatchData, 
    setRawMatchData, 
    setPerMatchPlayerWinning, 
    setPerMatchPlayerTotal 
  } = useMatchData();
  
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

  useEffect(() => {
    if (rawMatchData.length > 0) {  
      const perMatchPlayerWinning = calculatePerMatchPlayerWinning(rawMatchData, playerIds);
      setPerMatchPlayerWinning(perMatchPlayerWinning);
    } else {
      setPerMatchPlayerWinning(INITIAL_PLAYER_TOTALS);
    }
  }, [rawMatchData]);

   useEffect(() => {
    if (rawMatchData.length > 0) {
      const perMatchPlayerTotal = calculatePerMatchPlayerTotal(rawMatchData, playerIds);
      setPerMatchPlayerTotal(perMatchPlayerTotal);
    } else {
      setPerMatchPlayerTotal(INITIAL_PLAYER_TOTALS);
    }
  }, [rawMatchData]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex justify-center overflow-auto relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Error message in case of API failure */}
      {error && <p className="text-red-300 text-xs mt-1">{error} (using fallback generated data)</p>}
      
      {/* Mobile-centric container */}
      <div className="w-full max-w-md min-h-screen p-4 space-y-4 pb-20 relative z-10">
        {/* Header */}
        <Header
          isLoading={isLoading}
          completedMatches={rawMatchData.length}
        />

        {/* Stats Cards */}
        <StatsOverview  />

        {/* Leaderboard Table */}
        {/* <LeaderboardTable players={playerData} /> */}

        {/* Trend Graph */}
        <TrendGraph />

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}