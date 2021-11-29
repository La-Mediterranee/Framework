async function register() {
	await new Promise<Event>(resolve => {
		window.addEventListener('load', e => {
			resolve(e);
		});
	});
}
