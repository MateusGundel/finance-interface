import type { Handle } from '@sveltejs/kit';

const handle: Handle = async ({ event, resolve }) => {
	const authCookie = event.cookies.get('AuthorizationToken');

	if (authCookie) {
		try {
			let sessionUser = {
				authCookie: authCookie,
				email: "",
				id: ""
			};

			event.locals.user = sessionUser;
		} catch (error) {
			console.error(error);
		}
	}

	return await resolve(event);
};

export { handle };
