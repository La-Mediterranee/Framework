import { setAppBadge } from '../utils';
import { handlePushNotificationClick } from './click';
import { handleSubscriptionChange } from './subscription-change';

interface NotificationPayload {
	/**
	 * The notification's title.
	 */
	title?: string;
	/**
	 * The notification's body text.
	 */
	body?: string;
	/**
	 * The URL of an image that is downloaded on the device and displayed in the notification.
	 */
	image?: string;
}

interface PushData {
	notification: NotificationPayload;
	data: Record<string, string>;
}

export function handlePushNotifications(sw: PlatformSWScope, actions?: NotificationAction[]) {
	let messages = 0;

	sw.addEventListener('push', e => {
		console.log('[Service Worker] Push Received.');

		const { notification, data } = e.data?.json() as PushData;

		if (!notification?.title) {
			return;
		}

		const title = notification.title;
		const options: NotificationOptions = {
			body: notification.body,
			data: { href: '/users/donald' },
			actions: [
				{ action: 'details', title: 'Details' },
				{ action: 'dismiss', title: 'Dismiss' },
			],
		};

		e.waitUntil(sw.registration.showNotification(title, options));
		setAppBadge(++messages);
	});

	handleSubscriptionChange(sw);
	handlePushNotificationClick(sw);
}
