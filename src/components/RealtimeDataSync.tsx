import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RealtimeDataSyncProps {
  table: string;
  onDataChange?: () => void;
  children: React.ReactNode;
}

export const RealtimeDataSync: React.FC<RealtimeDataSyncProps> = ({ 
  table, 
  onDataChange, 
  children 
}) => {
  const { toast } = useToast();

  useEffect(() => {
    const channel = supabase
      .channel(`realtime:${table}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table
        },
        (payload) => {
          console.log(`${table} changed:`, payload);
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: "Data updated",
              description: `New ${table.slice(0, -1)} added by another user`,
            });
          } else if (payload.eventType === 'UPDATE') {
            toast({
              title: "Data updated", 
              description: `${table.slice(0, -1)} updated by another user`,
            });
          } else if (payload.eventType === 'DELETE') {
            toast({
              title: "Data updated",
              description: `${table.slice(0, -1)} deleted by another user`,
            });
          }
          
          // Trigger data refresh
          if (onDataChange) {
            setTimeout(onDataChange, 500);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, onDataChange, toast]);

  return <>{children}</>;
};