import { deleteSessionCookie } from '$lib/db/authUtils';
import { lucia } from '$lib/db/lucia';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ locals: { user }}) => {
	if (!user) {
        console.log('blum loggin')
		throw redirect(303, '/auth/login');
	}

	return {
		loggedInUserName: user.username,
	};
})

export const actions = {
	logout: async ({ cookies, locals }) => {
		if (!locals.session?.id) return;
		await lucia.invalidateSession(locals.session.id);
		await deleteSessionCookie(lucia, cookies);
		throw redirect(303, '/');
	},
};