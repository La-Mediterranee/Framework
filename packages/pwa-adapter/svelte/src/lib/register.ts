export async function register() {
	await new Promise<Event>(resolve => {
		window.addEventListener('sveltekit:start', e => {
			resolve(e);
		});
	});
}
