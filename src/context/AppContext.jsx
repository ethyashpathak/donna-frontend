import { createContext, useContext, useState, useCallback } from 'react';
import { getGmailMessages, analyzeGmail } from '../api';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [insight, setInsight] = useState(null);
  const [gmailConnected, setGmailConnected] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalyzed, setLastAnalyzed] = useState(null);
  const [error, setError] = useState(null);
  const [connectionChecked, setConnectionChecked] = useState(false);

  const checkConnection = useCallback(async () => {
    try {
      await getGmailMessages();
      setGmailConnected(true);
      setConnectionChecked(true);
      return true;
    } catch {
      setGmailConnected(false);
      setConnectionChecked(true);
      return false;
    }
  }, []);

  const runAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await analyzeGmail();
      setInsight(data);
      setLastAnalyzed(new Date().toLocaleString());
      return data;
    } catch (err) {
      console.error('Analysis failed:', err);
      setError('Analysis failed — click Refresh to try again');
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const logout = useCallback(() => {
    setGmailConnected(false);
    setInsight(null);
    setIsAnalyzing(false);
    setLastAnalyzed(null);
    setError(null);
  }, []);

  return (
    <AppContext.Provider
      value={{
        insight,
        setInsight,
        gmailConnected,
        setGmailConnected,
        isAnalyzing,
        setIsAnalyzing,
        lastAnalyzed,
        setLastAnalyzed,
        error,
        setError,
        connectionChecked,
        checkConnection,
        runAnalysis,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
