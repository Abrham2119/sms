import { useEffect, useRef, useCallback } from 'react';
import * as PusherPushNotifications from '@pusher/push-notifications-web';

const BEAMS_INSTANCE_ID = import.meta.env.VITE_PUSHER_BEAM_INSTANCE_ID
  || "89e17773-f420-40f4-af86-482a1fb0274c"; 

interface UsePusherBeamsOptions {
  userId: string | null;
  enabled?: boolean;
}

export function usePusherBeams({ userId, enabled = true }: UsePusherBeamsOptions) {
  const beamsClientRef = useRef<PusherPushNotifications.Client | null>(null);
  const subscribedInterestRef = useRef<string | null>(null);


  console.log("beamsClientRef", beamsClientRef);
  console.log("subscribedInterestRef", subscribedInterestRef);

  const subscribe = useCallback(async (client: PusherPushNotifications.Client, uid: string) => {
    const interest = `notifiable.${uid}`;

    try {
      // Start the client (registers service worker & requests permission)
      await client.start();

      // Clear any previous interests
      await client.clearAllState();
      await client.start();

      // Subscribe to user-specific interest
      await client.addDeviceInterest(interest);
      subscribedInterestRef.current = interest;

      console.log(`[Beams] Subscribed to interest: ${interest}`);
    } catch (error) {
      console.error('[Beams] Failed to subscribe:', error);
    }
  }, []);

  const unsubscribe = useCallback(async () => {
    const client = beamsClientRef.current;
    if (!client) return;

    try {
      if (subscribedInterestRef.current) {
        await client.removeDeviceInterest(subscribedInterestRef.current);
        subscribedInterestRef.current = null;
      }
      await client.clearAllState();
      await client.stop();
      console.log('[Beams] Unsubscribed and stopped');
    } catch (error) {
      console.error('[Beams] Failed to unsubscribe:', error);
    }
  }, []);

  useEffect(() => {
    if (!enabled || !userId) return;

    // Check if service workers are supported
    if (!('serviceWorker' in navigator)) {
      console.warn('[Beams] Service Workers are not supported in this browser');
      return;
    }

    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.warn('[Beams] Notifications are not supported in this browser');
      return;
    }

    const client = new PusherPushNotifications.Client({
      instanceId: BEAMS_INSTANCE_ID,
    });

    beamsClientRef.current = client;
    subscribe(client, userId);

    return () => {
      unsubscribe();
    };
  }, [userId, enabled, subscribe, unsubscribe]);

  return { unsubscribe };
}
