import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from './useSupabaseAuth';

interface FreezeSettings {
  paidInvoices: boolean;
  savedClients: boolean;
  completedPayments: boolean;
  finalizedReports: boolean;
  confirmedOrders: boolean;
  processedTransactions: boolean;
}

export const useSupabaseFreezeSettings = () => {
  const { user } = useSupabaseAuth();
  const [freezeSettings, setFreezeSettings] = useState<FreezeSettings>({
    paidInvoices: false,
    savedClients: false,
    completedPayments: false,
    finalizedReports: false,
    confirmedOrders: false,
    processedTransactions: false,
  });

  useEffect(() => {
    if (!user) return;

    const loadFreezeSettings = async () => {
      // Use localStorage as fallback since freeze_settings table might not be available yet
      const savedSettings = localStorage.getItem(`freeze_settings_${user.id}`);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setFreezeSettings({
          paidInvoices: parsed.paidInvoices || false,
          savedClients: parsed.savedClients || false,
          completedPayments: parsed.completedPayments || false,
          finalizedReports: parsed.finalizedReports || false,
          confirmedOrders: parsed.confirmedOrders || false,
          processedTransactions: parsed.processedTransactions || false,
        });
      }
    };

    loadFreezeSettings();
  }, [user]);

  const updateFreezeSettings = async (newSettings: FreezeSettings) => {
    if (!user) return;

    // Use localStorage as fallback since freeze_settings table might not be available yet
    localStorage.setItem(`freeze_settings_${user.id}`, JSON.stringify(newSettings));
    setFreezeSettings(newSettings);
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

  return {
    freezeSettings,
    updateFreezeSettings,
    isItemFrozen,
  };
};