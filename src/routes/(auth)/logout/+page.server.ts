import { deleteSessionCookie } from '$lib/db/authUtils';
import { lucia } from '$lib/db/lucia';
import { redirect } from '@sveltejs/kit';

export const actions = {
	logout: async ({ cookies, locals }) => {
		if (!locals.session?.id) return;
		await lucia.invalidateSession(locals.session.id);
		await deleteSessionCookie(lucia, cookies);
		throw redirect(303, '/');
	},
};