import { createContext, useContext, useMemo, useState } from 'react';
import { PLAYERS } from './data/players';

const MatchDataContext = createContext();

export const useMatchData = () => {
  const context = useContext(MatchDataContext);
  if (!context) {
    throw new Error('useMatchData must be used within a MatchDataProvider');
  }
  return context;
};

export const MatchDataProvider = ({ children }) => {
  const [ rawMatchData, setRawMatchData ] = useState([]);
  const [ perMatchPlayerTotal, setPerMatchPlayerTotal ] = useState([]);
  const [ overallPlayerTotal, setOverallPlayerTotal ] = useState([]);
  const [ perMatchPlayerWinningMinusFee, setPerMatchPlayerWinningMinusFee ] = useState([]); 
  const [ rankMatrix, setRankMatrix ] = useState({});

  const value = useMemo(() => ({
    rawMatchData,
    setRawMatchData,
    perMatchPlayerTotal,
    setPerMatchPlayerTotal,
    overallPlayerTotal,
    setOverallPlayerTotal,
    perMatchPlayerWinningMinusFee,
    setPerMatchPlayerWinningMinusFee,
    rankMatrix,
    setRankMatrix,
  }), [
    rawMatchData, 
    perMatchPlayerTotal, overallPlayerTotal, 
    perMatchPlayerWinningMinusFee,
    rankMatrix,
]);

  return (
    <MatchDataContext.Provider value={value}>
      {children}
    </MatchDataContext.Provider>
  );
};