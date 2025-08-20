import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from './useSupabaseAuth';
import { useToast } from './use-toast';

interface OnlineUser {
  user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  last_seen: string;
}

export const useRealtimePresence = (pageRoute: string) => {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [channel, setChannel] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    const channelName = `presence:${pageRoute}`;
    const presenceChannel = supabase.channel(channelName);

    // Track user presence
    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const users: OnlineUser[] = [];
        
        Object.values(state).forEach((presences: any) => {
          presences.forEach((presence: any) => {
            if (presence.user_id !== user.id) {
              users.push(presence);
            }
          });
        });
        
        setOnlineUsers(users);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        newPresences.forEach((presence: any) => {
          if (presence.user_id !== user.id) {
            toast({
              title: "User joined",
              description: `${presence.first_name || presence.email} is now viewing this page`,
            });
          }
        });
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        leftPresences.forEach((presence: any) => {
          if (presence.user_id !== user.id) {
            toast({
              title: "User left",
              description: `${presence.first_name || presence.email} left this page`,
            });
          }
        });
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Get user profile for presence data
          const { data: profile } = await supabase
            .from('profiles')
            .select('email, first_name, last_name')
            .eq('id', user.id)
            .single();

          await presenceChannel.track({
            user_id: user.id,
            email: profile?.email || user.email,
            first_name: profile?.first_name,
            last_name: profile?.last_name,
            last_seen: new Date().toISOString(),
          });
        }
      });

    setChannel(presenceChannel);

    return () => {
      presenceChannel.unsubscribe();
    };
  }, [user, pageRoute, toast]);

  return { onlineUsers, channel };
};