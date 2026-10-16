// Web Push Notification Helper for Asgaon Civic Portal
import { API_BASE_URL } from './api';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const cleanStr = (base64String || '').trim().replace(/^["']|["']$/g, '');
  const padding = '='.repeat((4 - (cleanStr.length % 4)) % 4);
  const base64 = (cleanStr + padding)
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
  if (!('serviceWorker' in navigator)) {
    console.log('Service Workers are not supported in this browser.');
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
    return { success: false, message: 'तुमच्या ब्राऊझरमध्ये थेट सूचना सुविधा उपलब्ध नाही.' };
  }

  try {
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') {
      return { success: false, message: 'सूचना सुरू करण्यासाठी ब्राऊझर परवानगी (Notification Permission) आवश्यक आहे.' };
    }

    // 1. Ensure Service Worker is registered & fully active
    await registerServiceWorker();
    const swReg = await navigator.serviceWorker.ready;

    // 2. Fetch public key from environment or backend
    let publicKey = ((import.meta as any).env?.VITE_VAPID_PUBLIC_KEY || '').trim().replace(/^["']|["']$/g, '');
    if (!publicKey) {
      try {
        const res = await fetch(`${API_BASE_URL}/notifications/vapid-key`);
        const json = await res.json();
        publicKey = (json.data?.publicKey || '').trim().replace(/^["']|["']$/g, '');
      } catch (e) {
        console.warn('Could not fetch notification key from server:', e);
      }
    }

    if (!publicKey) {
      throw new Error('सूचना सर्व्हरशी संपर्क होऊ शकला नाही. कृपया थोड्या वेळाने प्रयत्न करा.');
    }

    const convertedVapidKey = urlBase64ToUint8Array(publicKey);

    // 3. Check for existing subscription or create a fresh one
    let subscription = await swReg.pushManager.getSubscription();

    if (!subscription) {
      try {
        subscription = await swReg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey as unknown as BufferSource
        });
      } catch (subErr: any) {
        console.warn('First subscription attempt failed, clearing stale subscription if any...', subErr);
        const staleSub = await swReg.pushManager.getSubscription();
        if (staleSub) {
          await staleSub.unsubscribe().catch(() => {});
          await new Promise((resolve) => setTimeout(resolve, 400));
        }

        try {
          subscription = await swReg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey as unknown as BufferSource
          });
        } catch (secondErr: any) {
          const errStr = (secondErr?.message || '').toLowerCase();
          // Provide clear actionable guidance for push service errors
          if (errStr.includes('push service error') || errStr.includes('registration failed')) {
            const isBrave = (navigator as any).brave !== undefined;
            if (isBrave) {
              throw new Error('Brave ब्राऊझरमध्ये Push Messaging बंद असते. कृपया Settings -> Privacy -> "Use Google services for push messaging" सुरू करा.');
            }
            throw new Error('Google Push Service शी संपर्क होऊ शकला नाही. कृपया AdBlocker/VPN बंद करून पहा किंवा खाजगी (Incognito) मोड बंद करा.');
          }
          throw secondErr;
        }
      }
    }

    const subJson = subscription.toJSON();
    const endpoint = subscription.endpoint;
    const p256dh = subJson.keys?.p256dh || '';
    const auth = subJson.keys?.auth || '';

    // 4. Register subscription with Spring Boot backend
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
      throw new Error('सूचना सर्व्हर नोंदणी पूर्ण होऊ शकली नाही.');
    }

    // 5. Deliver an immediate welcome notification to confirm it works
    try {
      await swReg.showNotification('आसगाव थेट सूचना सुरू झाल्या', {
        body: 'आसगाव ग्रामपंचायत थेट सूचना आता तुमच्या मोबाईलवर सुरू झाल्या आहेत.',
        icon: '/asgaon-logo.png',
        badge: '/asgaon-logo.png',
        data: { url: '/' }
      });
    } catch {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('आसगाव थेट सूचना सुरू झाल्या', {
          body: 'आसगाव ग्रामपंचायत थेट सूचना आता सक्रिय आहेत.',
          icon: '/asgaon-logo.png'
        });
      }
    }

    return {
      success: true,
      message: 'थेट सूचना सुरू झाल्या! पाणी पुरवठा व महत्त्वाच्या सूचना वेळेवर मिळतील.'
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'सूचना सुरू करताना अडचण आली. कृपया पुन्हा प्रयत्न करा.'
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
    return { success: true, message: 'थेट सूचना बंद केल्या आहेत.' };
  } catch (err: any) {
    return { success: false, message: err.message || 'सूचना बंद करताना अडचण आली.' };
  }
}

export async function sendLocalTestNotification(title: string, message: string, url: string = '/'): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;

  let perm = Notification.permission;
  if (perm === 'default') {
    perm = await Notification.requestPermission();
  }

  if (perm === 'granted') {
    try {
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.ready;
        await reg.showNotification(title, {
          body: message,
          icon: '/asgaon-logo.png',
          badge: '/asgaon-logo.png',
          data: { url }
        });
        return true;
      }
    } catch {}

    try {
      new Notification(title, {
        body: message,
        icon: '/asgaon-logo.png'
      });
      return true;
    } catch {}
  }

  return false;
}

export async function sendTestPushNotification(title: string, message: string, url: string = '/'): Promise<{ success: boolean; message: string }> {
  // Always trigger local notification so the user sees the alert on screen immediately
  await sendLocalTestNotification(title, message, url);

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
      message: json.message || 'Broadcast notification triggered successfully.'
    };
  } catch (err: any) {
    return {
      success: true,
      message: 'Test notification displayed locally on device.'
    };
  }
}



