import { createContext, useContext, useMemo, useState } from 'react';

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
  const [ perMatchPlayerWinning, setPerMatchPlayerWinning ] = useState([]);
  const [ perMatchPlayerTotal, setPerMatchPlayerTotal ] = useState([]);

  const value = useMemo(() => ({
    rawMatchData,
    setRawMatchData,
    perMatchPlayerWinning,
    setPerMatchPlayerWinning,
    perMatchPlayerTotal,
    setPerMatchPlayerTotal
  }), [rawMatchData, perMatchPlayerWinning, perMatchPlayerTotal]);

  return (
    <MatchDataContext.Provider value={value}>
      {children}
    </MatchDataContext.Provider>
  );
};