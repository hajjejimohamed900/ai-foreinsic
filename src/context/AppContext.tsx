import React, { createContext, useContext, useState, useEffect } from 'react';

type AppContextType = {
  hasUploadedData: boolean;
  setHasUploadedData: (val: boolean) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [hasUploadedData, setHasUploadedData] = useState(false);

  // 🚨 AUTO-DETECT LOGIC 🚨
  // Every time the app loads or refreshes, it checks if the Python JSON is ready.
  // If it is, it permanently unlocks the dashboard pages!
  useEffect(() => {
    const checkExistingData = async () => {
      try {
        const response = await fetch('/api/reports/data');
        if (response.ok) {
          const data = await response.json();
          // If the storylines array exists, unlock the app!
          if (data && data.storylines && data.storylines.length > 0) {
            setHasUploadedData(true);
          }
        }
      } catch (error) {
        console.log("No existing data found yet.");
      }
    };

    checkExistingData();
    
    // Check every 2 seconds just in case the Python script is running in the background
    const interval = setInterval(checkExistingData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppContext.Provider value={{ hasUploadedData, setHasUploadedData }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}