
import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { JWT_ACCESS_SECRET } from '$env/static/private';

export const load: PageServerLoad = (event) => {
	const user = event.locals.user;

	if (user) {
		throw redirect(302, '/guarded');
	}
};

const loginUser = async (formData: {}) => {
	const response = await fetch("http://127.0.0.1:8000/api/v1/login", {
		method: "POST",
		cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
		headers: {
			"Content-Type": "application/json",
		},
		redirect: "follow", // manual, *follow, error
		referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
		body: JSON.stringify(formData), // body data type must match "Content-Type" header
	});

	if (response.status !== 200) {
		return {
			error: 'Invalid credentials'
		};
	}
	let data = await response.json()
	return { token: data.access_token };
};

export const actions: Actions = {
	default: async (event) => {
		const formData = Object.fromEntries(await event.request.formData());
		if (!formData.email || !formData.password) {
			return fail(400, {
				error: 'Missing email or password'
			});
		}

		const { error, token } = await loginUser(formData);

		if (error) {
			return fail(401, {
				error
			});
		}

		// Set the cookie
		event.cookies.set('AuthorizationToken', `Bearer ${token}`, {
			httpOnly: true,
			path: '/',
			secure: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 // 1 day
		});

		throw redirect(302, '/teste');
	}
};
