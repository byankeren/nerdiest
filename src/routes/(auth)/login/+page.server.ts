import { superValidate, setError } from 'sveltekit-superforms';
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
            return fail(400, { loginForm });
        }

        const [isUserExist] = await db.select({id: users.id, password: users.password}).from(users).where(eq(users.email, loginForm.data.email))

        if (isUserExist === undefined) {
            return setError(loginForm, 'email', 'Email not registered');
        }
        const validPassword = await new Argon2id().verify(
            isUserExist.password,
            loginForm.data.password
        );
        if (!validPassword) {
            return setError(loginForm, 'password', 'Incorrect password');
        }

            
		await createAndSetSession(lucia, isUserExist.id, cookies);

		throw redirect(303, '/');
    },

    sendEmailResetPassword: async({request, cookies}) => {
        const resetPasswordForm = await superValidate(request, zod(resetPasswordValidation))

        if (!resetPasswordForm.valid) {
            return fail(400, { resetPasswordForm });
        }
        
        console.log(resetPasswordForm)

        const [isUserExist] = await db.select({id: users.id, email: users.email, isEmailVerified: users.isEmailVerified}).from(users).where(eq(users.email, resetPasswordForm.data.email))
        if (isUserExist === undefined) {
            return setError(resetPasswordForm, 'email', 'Email not registered');
        }

        if (!isUserExist.isEmailVerified) {
            return setError(resetPasswordForm, 'email', 'You must verification your email');
        }
        const resetToken = await generatePasswordCode(isUserExist.id)

        const sendPasswordReset = await sendPasswordResetEmail(
            isUserExist.email,
            resetToken
        );
    }
}
