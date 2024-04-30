import { message, superValidate, setError } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { fail } from '@sveltejs/kit';

import { redirect } from '@sveltejs/kit';

import { eq } from 'drizzle-orm';
import { db } from '$lib/db/db';
import { users } from '$lib/db/schema';

import { createAndSetSession } from '$lib/db/authUtils';
import { Argon2id } from "oslo/password";
import { lucia } from '$lib/db/lucia';

import { generatePasswordCode, sendPasswordResetEmail } from '$lib/db/authUtils';


const loginValidation = z.object({
        email: z.string().email().min(2),
        password: z.string()
})

const resetPasswordValidation = z.object({
        email: z.string().email().min(2),
})

export const load = async ({locals}) => {
    const loginForm = await superValidate(zod(loginValidation))
    const resetPasswordForm = await superValidate(zod(resetPasswordValidation))

    const user = locals.user

    if (user){
        throw redirect(303, '/')
    }

    return {loginForm, resetPasswordForm}
}

export const actions = {
    login: async ({request, cookies}) => {
        const loginForm = await superValidate(request, zod(loginValidation))

        if (!loginForm.valid) {
            return message(loginForm, {
				alertType: 'error',
				alertText: 'There was a problem with your submission.'
			});
        }

        const [isUserExist] = await db.select().from(users).where(eq(users.email, loginForm.data.email))

        if (isUserExist === undefined) {
            return message(loginForm, {
				alertType: 'emailAndPass',
				alertText: 'Your Email Or Password Wrong!'
			});
        }


        if (isUserExist.authMethods.includes('email') && isUserExist.password) {
			const isPasswordValid = await new Argon2id().verify(
				isUserExist.password,
				loginForm.data.password
			);
            if (!isPasswordValid) {
                return message(loginForm, {
                    alertType: 'emailAndPass',
                    alertText: 'Your Email Or Password Wrong!'
                });
            }
		} else {
			// If the user doesn't have a password, it means they registered with OAuth
			return message(
				loginForm,
				{
					alertType: 'error',
					alertText:
						'You registered with an OAuth provider. Please use the appropriate login method.'
				},
				{
					status: 403 // This status code indicates that the server understood the request, but it refuses to authorize it because the user registered with OAuth
				}
			);
		}

            
		await createAndSetSession(lucia, isUserExist.id, cookies);

		throw redirect(303, '/');
    },

    sendEmailResetPassword: async({request, cookies}) => {
        const resetPasswordForm = await superValidate(request, zod(resetPasswordValidation))

        if (!resetPasswordForm.valid) {
            return message(resetPasswordForm, {
				alertType: 'error',
				alertText: 'There was a problem with your submission.'
			});
        }
        
        const [isUserExist] = await db.select({id: users.id, email: users.email, isEmailVerified: users.isEmailVerified}).from(users).where(eq(users.email, resetPasswordForm.data.email))
        if (isUserExist === undefined) {
            return message(resetPasswordForm, {
				alertType: 'email',
				alertText: 'If The Email Is Registred We Will send It To You!'
			});
        }

        if (!isUserExist.isEmailVerified) {
            return message(resetPasswordForm, {
				alertType: 'email',
				alertText: 'If The Email Is Registred We Will send It To You!'
			});
        }

        const resetToken = await generatePasswordCode(isUserExist.id)

        const sendPasswordReset = await sendPasswordResetEmail(
            isUserExist.email,
            resetToken
        );

        return message(resetPasswordForm, {
            alertType: 'email',
            alertText: 'If The Email Is Registred We Will send It To You!'
        });
    }
}
