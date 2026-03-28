import { LeaderboardTable } from './components/LeaderboardTable';
import { TrendGraph } from './components/TrendGraph';
import { StatsOverview } from './components/StatsOverview';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { useState, useEffect, useMemo, use } from 'react';
import { fetchTournamentMatches } from './api/tournamentApi';
import { useMatchData } from './MatchDataContext';
import { calculatePerMatchPlayerTotal, 
  extractPlayerDetailByKey, calculateTotalPlayerWinning,
  calculatePerMatchPlayeWinningMinusEntryFee,
} from './utils/app';
import { PLAYERS } from './data/players';
import { INITIAL_PLAYER_TOTALS } from './data/emptyData';

export default function App() {
  const [ isLoading, setIsLoading ] = useState(false);
  const [ error, setError ] = useState(null);

  const playerIds = useMemo(() => 
    extractPlayerDetailByKey(PLAYERS, 'id'),
  [PLAYERS]);

  const { rawMatchData, 
    setRawMatchData, 
    setPerMatchPlayerTotal,
    setOverallPlayerTotal,
    setPerMatchPlayerWinningMinusFee,
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
      const perMatchPlayerTotal = calculatePerMatchPlayerTotal(rawMatchData, playerIds);
      setPerMatchPlayerTotal(perMatchPlayerTotal);
    } else {
      setPerMatchPlayerTotal(INITIAL_PLAYER_TOTALS);
    }
  }, [rawMatchData]);

  useEffect(() => {
    if (rawMatchData.length > 0) {
      const totalPlayerWinning = calculateTotalPlayerWinning(rawMatchData, playerIds);
      setOverallPlayerTotal(totalPlayerWinning);
    } else {
      setOverallPlayerTotal([]);
    }
  }, [rawMatchData]);

  useEffect(() => {
    if (rawMatchData.length > 0) {
      const perMatchPlayerWinningMinusEntryFee = calculatePerMatchPlayeWinningMinusEntryFee(rawMatchData, playerIds);
      setPerMatchPlayerWinningMinusFee(perMatchPlayerWinningMinusEntryFee);
    } else {
      setPerMatchPlayerWinningMinusFee(INITIAL_PLAYER_TOTALS);
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
        />

        {/* Stats Cards */}
        <StatsOverview  />

        {/* Leaderboard Table */}
        <LeaderboardTable />

        {/* Trend Graph */}
        <TrendGraph />

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}