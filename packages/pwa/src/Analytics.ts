declare var self: PlatformSWScope;

class Analytics {
	private async getRegistration() {
		return self.registration.pushManager.getSubscription();
	}

	async logEvent(eventAction: string, eventCategory: string) {
		this.googleAnalytics('event', eventAction, eventCategory);
	}

	async googleAnalytics(hitType: GoogleAnalytics.HitTypes, eventAction: string, eventCategory: string) {
		try {
			const trackingId = self.trackingId;
			if (!trackingId) {
				console.error('You need your tracking ID in analytics-helper.js');
				console.error("Add this code:\nconst trackingId = 'UA-XXXXXXXX-X';");
				// We want this to be a safe method, so avoid throwing unless absolutely necessary.
				return;
			}

			if (!eventAction && !eventCategory) {
				console.warn('logEvent() called with no eventAction or ' + 'eventCategory.');
				// We want this to be a safe method, so avoid throwing unless absolutely necessary.
				return;
			}

			const subscription = await this.getRegistration();
			if (subscription == null) return;

			// Create hit data
			const payloadData: Record<string, string | number> = {
				// Version Number
				v: 1,
				// Client ID
				cid: subscription.endpoint,
				// Tracking ID
				tid: trackingId,
				// Hit Type
				t: hitType,
				// Event Category
				ec: eventCategory,
				// Event Action
				ea: eventAction,
				// Event Label
				el: 'serviceworker',
			};

			// Format hit data into URI
			const payloadString = Object.keys(payloadData)
				.filter(analyticsKey => {
					return payloadData[analyticsKey];
				})
				.map(analyticsKey => {
					return analyticsKey + '=' + encodeURIComponent(payloadData[analyticsKey]);
				})
				.join('&');

			// Post to Google Analytics endpoint
			const response = await fetch('https://www.google-analytics.com/collect', {
				method: 'post',
				body: payloadString,
			});

			if (!response.ok) {
				return response.text().then(_ => {
					throw new Error('Bad response from Google Analytics:\n' + response.status);
				});
			} else {
				console.log(eventCategory + '/' + eventAction + ' hit sent, check the Analytics dashboard');
			}
		} catch (error) {
			console.warn('Unable to send the analytics event', error);
		}
	}
}

export default Analytics;

declare module GoogleAnalytics {
	type HitTypes = 'event' | 'create';
}
