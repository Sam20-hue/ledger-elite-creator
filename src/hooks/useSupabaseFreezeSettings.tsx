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
      const { data, error } = await supabase
        .from('freeze_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data && !error) {
        setFreezeSettings({
          paidInvoices: data.paid_invoices || false,
          savedClients: data.saved_clients || false,
          completedPayments: data.completed_payments || false,
          finalizedReports: data.finalized_reports || false,
          confirmedOrders: data.confirmed_orders || false,
          processedTransactions: data.processed_transactions || false,
        });
      }
    };

    loadFreezeSettings();
  }, [user]);

  const updateFreezeSettings = async (newSettings: FreezeSettings) => {
    if (!user) return;

    const { error } = await supabase
      .from('freeze_settings')
      .upsert({
        user_id: user.id,
        paid_invoices: newSettings.paidInvoices,
        saved_clients: newSettings.savedClients,
        completed_payments: newSettings.completedPayments,
        finalized_reports: newSettings.finalizedReports,
        confirmed_orders: newSettings.confirmedOrders,
        processed_transactions: newSettings.processedTransactions,
      });

    if (!error) {
      setFreezeSettings(newSettings);
    }
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