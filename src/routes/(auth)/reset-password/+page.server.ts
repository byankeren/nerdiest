import { superValidate, setError, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { verifyPasswordResetToken, isSameAsOldPassword } from "$lib/db/authUtils";
import { error, redirect, fail } from "@sveltejs/kit";

import { eq } from 'drizzle-orm';
import { db } from '$lib/db/db';
import { passwordResetTokens, users } from '$lib/db/schema';

import { Argon2id } from "oslo/password";
import { lucia } from '$lib/db/lucia';

const schema = z.object({
    newPassword: z.string().min(2),
    passwordResetToken: z.string().optional()
})

export const load = async (event) => {
    const passwordResetToken = event.url.searchParams.get('token');
	// if (!passwordResetToken) {
	// 	error(400, 'Password reset token is missing from the request.');
	// }

    const form =  await superValidate(zod(schema))
	const { success, message } = await verifyPasswordResetToken(passwordResetToken);

	return {
		passwordResetTokenStatus: {
			isValid: success,
			message
		},
		form,
	};
};


export const actions = {
	resetPassword: async ({request}) => {
		const passwordResetFormData = await superValidate(request, zod(schema))

		if (!passwordResetFormData.valid) {
			return message(passwordResetFormData, {
				alertType: 'error',
				alertText: 'There was a problem with your submission.'
			});
		}
        try {
			const passwordResetToken = passwordResetFormData.data.passwordResetToken;

			if (!passwordResetToken) {
				return message(
					passwordResetFormData,
					{
						alertType: 'error',
						alertText: 'Password reset token is missing from the request.'
					},
					{
						status: 400
					}
				);
			}

			const verifyPasswordResetTokenResult = await verifyPasswordResetToken(passwordResetToken);

			if (verifyPasswordResetTokenResult.success === false) {
				return message(
					passwordResetFormData,
					{
						alertType: 'error',
						alertText: verifyPasswordResetTokenResult.message
					},
					{
						status: 400
					}
				);
			}
			const userId = verifyPasswordResetTokenResult.userId;
			if (userId) {
				const isSamePassword = await isSameAsOldPassword(
					userId,
					passwordResetFormData.data.newPassword
				);

				if (isSamePassword === true) {
                        return fail(400, passwordResetFormData);
    			}
				const hashedPassword = await new Argon2id().hash(passwordResetFormData.data.newPassword);

				await lucia.invalidateUserSessions(userId);

				await db.transaction(async (trx) => {
					await trx
						.delete(passwordResetTokens)
						.where(eq(passwordResetTokens.id, passwordResetToken));

					await trx
						.update(users)
						.set({ password: hashedPassword })
						.where(eq(users.id, userId));
				});
			}
		} catch (error) {
			console.error('Error in resetPassword action:', error);
			return message(
				passwordResetFormData,
				{
					alertType: 'error',
					alertText: 'There was a problem with your submission.'
				},
				{
					status: 500
				}
			);
		}

		throw redirect(303, '/');
	}
};  