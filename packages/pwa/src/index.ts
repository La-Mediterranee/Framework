import { Workbox } from 'workbox-window';
// import { getMessaging, isSupported, getToken, onMessage, deleteToken } from 'firebase/messaging';

import type { WorkboxLifecycleWaitingEvent } from 'workbox-window';

var DEBUG = import.meta.env.DEV;

type RegisterCb = (event: WorkboxLifecycleWaitingEvent, wb: Workbox) => void;

export async function registerServiceWorker(cb: RegisterCb = () => {}) {
	const workbox = new Workbox('./service-worker.js');

	const showSkipWaitingPrompt = (event: WorkboxLifecycleWaitingEvent) => {
		// `event.wasWaitingBeforeRegister` will be false if this is
		// the first time the updated service worker is waiting.
		// When `event.wasWaitingBeforeRegister` is true, a previously
		// updated service worker is still waiting.
		// You may want to customize the UI prompt accordingly.
		cb(event, workbox);
	};

	// fires when service worker has installed but is waiting to activate.
	workbox.addEventListener('waiting', showSkipWaitingPrompt);

	const registration = await workbox.register();

	registerFirebaseMessaging(registration);

	return registration;
}

async function registerFirebaseMessaging(registration?: ServiceWorkerRegistration) {
	const { getMessaging, isSupported, getToken } = await import('firebase/messaging');

	const messaging = getMessaging();

	const token = await getToken(messaging, {
		serviceWorkerRegistration: registration,
	});
}
