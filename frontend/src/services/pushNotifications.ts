// Web Push Notification Helper for Asgaon Civic Portal
import { API_BASE_URL } from './api';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.log('Web Push is not supported in this browser.');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    });
    return registration;
  } catch (err: any) {
    console.warn('Service worker registration error:', err.message);
    return null;
  }
}

export async function isPushSubscribed(): Promise<boolean> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false;
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    return sub !== null;
  } catch {
    return false;
  }
}

export async function subscribeUserToPush(phone?: string, role?: string): Promise<{ success: boolean; message: string }> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return { success: false, message: 'Web Push is not supported in this browser.' };
  }

  try {
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') {
      return { success: false, message: 'Notification permission was denied.' };
    }

    // 1. Fetch public key from backend
    const res = await fetch(`${API_BASE_URL}/notifications/vapid-key`);
    const json = await res.json();
    const publicKey = json.data?.publicKey;

    if (!publicKey) {
      throw new Error('VAPID public key could not be retrieved from server.');
    }

    const reg = await navigator.serviceWorker.ready;
    const existingSub = await reg.pushManager.getSubscription();

    let subscription = existingSub;
    if (!subscription) {
      const convertedVapidKey = urlBase64ToUint8Array(publicKey);
      subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey as unknown as BufferSource
      });
    }

    const subJson = subscription.toJSON();
    const endpoint = subscription.endpoint;
    const p256dh = subJson.keys?.p256dh || '';
    const auth = subJson.keys?.auth || '';

    // 2. Register subscription with Spring Boot backend
    const regRes = await fetch(`${API_BASE_URL}/notifications/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        endpoint,
        p256dh,
        auth,
        phone: phone || '',
        role: role || 'CITIZEN'
      })
    });

    if (!regRes.ok) {
      throw new Error('Failed to register subscription on server.');
    }

    return {
      success: true,
      message: 'Subscribed to Asgaon Alerts! You will receive live Mandi rates and gazettes.'
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Subscription failed.'
    };
  }
}

export async function unsubscribeUserFromPush(): Promise<{ success: boolean; message: string }> {
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) {
      const endpoint = sub.endpoint;
      await sub.unsubscribe();

      await fetch(`${API_BASE_URL}/notifications/unsubscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint })
      });
    }
    return { success: true, message: 'Unsubscribed from Asgaon Alerts.' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Unsubscribe failed.' };
  }
}

export async function sendTestPushNotification(title: string, message: string, url: string = '/'): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/notifications/broadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        message,
        url,
        category: 'ALL'
      })
    });
    const json = await res.json();
    return {
      success: json.success ?? res.ok,
      message: json.message || 'Broadcast triggered.'
    };
  } catch (err: any) {
    return { success: false, message: err.message || 'Broadcast failed.' };
  }
}


