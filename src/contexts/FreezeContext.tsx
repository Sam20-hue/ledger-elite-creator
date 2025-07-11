
import React, { createContext, useContext, useState, useEffect } from 'react';

interface FreezeSettings {
  paidInvoices: boolean;
  savedClients: boolean;
  completedPayments: boolean;
  finalizedReports: boolean;
  confirmedOrders: boolean;
  processedTransactions: boolean;
}

interface FreezeContextType {
  freezeSettings: FreezeSettings;
  updateFreezeSettings: (settings: FreezeSettings) => void;
  isItemFrozen: (type: keyof FreezeSettings, item?: any) => boolean;
}

const FreezeContext = createContext<FreezeContextType | undefined>(undefined);

export const FreezeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [freezeSettings, setFreezeSettings] = useState<FreezeSettings>({
    paidInvoices: false,
    savedClients: false,
    completedPayments: false,
    finalizedReports: false,
    confirmedOrders: false,
    processedTransactions: false,
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('freezeSettings');
    if (savedSettings) {
      setFreezeSettings(JSON.parse(savedSettings));
    }
  }, []);

  const updateFreezeSettings = (settings: FreezeSettings) => {
    setFreezeSettings(settings);
    localStorage.setItem('freezeSettings', JSON.stringify(settings));
  };

  const isItemFrozen = (type: keyof FreezeSettings, item?: any) => {
    if (!freezeSettings[type]) return false;
    
    // Check specific conditions based on type
    switch (type) {
      case 'paidInvoices':
        return item?.status === 'paid';
      case 'savedClients':
        return item?.id && item?.name; // If client has ID and name, it's considered "saved"
      case 'completedPayments':
        return item?.status === 'completed';
      default:
        return freezeSettings[type];
    }
  };

  return (
    <FreezeContext.Provider value={{ freezeSettings, updateFreezeSettings, isItemFrozen }}>
      {children}
    </FreezeContext.Provider>
  );
};

export const useFreeze = () => {
  const context = useContext(FreezeContext);
  if (context === undefined) {
    throw new Error('useFreeze must be used within a FreezeProvider');
  }
  return context;
};
