type USVString = string;

/**
 * The BeforeInstallPromptEvent is fired at the Window.onbeforeinstallprompt handler
 * before a user is prompted to "install" a web site to a home screen on mobile.
 *
 * Only supported on Chrome and Android Webview.
 */
interface BeforeInstallPromptEvent extends Event {
	/**
	 * Returns an array of DOMString items containing the platforms on which the event was dispatched.
	 * This is provided for user agents that want to present a choice of versions to the user such as,
	 * for example, "web" or "play" which would allow the user to chose between a web version or
	 * an Android version.
	 */
	readonly platforms: Array<string>;

	/**
	 * Returns a Promise that resolves to a DOMString containing either "accepted" or "dismissed".
	 */
	readonly userChoice: Promise<{
		outcome: 'accepted' | 'dismissed';
		platform: string;
	}>;

	/**
	 * Allows a developer to show the install prompt at a time of their own choosing.
	 * This method returns a Promise.
	 */
	prompt(): Promise<void>;
}

interface PushSubscriptionChangeEvent extends ExtendableEvent {
	readonly newSubscription: PushSubscription;
	readonly oldSubscription: PushSubscription;
}

interface PasswordCredentialData extends Credential {
	id: USVString;
	password: USVString;
	name?: USVString;
	iconURL?: USVString;
}

interface PasswordCredential extends Credential {
	readonly iconURL: USVString;
	readonly name: USVString;
	readonly password: USVString;
}

declare var PasswordCredential: {
	prototype: PasswordCredential;
	new (htmlFormElement: HTMLFormElement): PasswordCredential;
	new (passwordCredentialData: PasswordCredentialData): PasswordCredential;
};

interface ExtendedNavigator extends WorkerNavigator, Navigator {
	/**
	 * @throws "NotSupportedError" DOMException
	 * Only on the Main Thread if the Navigator
	 * does not have a document that this action can be acted on.
	 */
	setAppBadge(contents?: any): Promise<undefined>;
	/**
	 * @throws "NotSupportedError" DOMException
	 * Only on the Main Thread if the Navigator
	 * does not have a document that this action can be acted on.
	 */
	clearAppBadge(): Promise<undefined>;
}
