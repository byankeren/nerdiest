import { superValidate, setError, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

import { eq } from 'drizzle-orm';
import { db } from '$lib/db/db';
import { users } from '$lib/db/schema';

import { generateId } from 'lucia';
import { Argon2id } from "oslo/password";
import { PENDING_USER_VERIFICATION_COOKIE_NAME, generateEmailVerificationCode, sendEmailVerificationCode } from '$lib/db/authUtils';
const schema = z.object({
        name: z.string().min(2),
        email: z.string().email().min(2),
        password: z.string().min(10)
})

export const load = async ({locals}) => {
    const form = await superValidate(zod(schema))
    const user = locals.user
    if (user){
        throw redirect(303, '/')
    }
    return {form}
}

export const actions = {
    register: async ({ request, cookies }) => {
        const form = await superValidate(request, zod(schema))

        if (!form.valid) {
            return message(form, {
				alertType: 'error',
				alertText: 'There was a problem with your submission.'
			});
        }

        try{
            const [isUserExist] = await db.select().from(users).where(eq(users.email, form.data.email))
            
            if(isUserExist && isUserExist.authMethods.includes('email')){
                return message(form, {
                    alertType: 'error',
                    alertText: 'There was a problem with your submission.'
                });
            }

            const userId = generateId(15);
			const hashedPassword = await new Argon2id().hash(form.data.password);

            if (!isUserExist) {
				await db.insert(users).values({
                    id: userId,
                    name: form.data.name,
                    email: form.data.email,
                    isEmailVerified: false,
                    password: hashedPassword,
                    authMethods: ['email']
                })
			} else {
				await db
					.update(users)
					.set({
						password: hashedPassword
					})
					.where(eq(users.email, form.data.email));
			}

            const emailVerificationCode = await generateEmailVerificationCode(userId, form.data.email)
            const sendEmailVerif = await sendEmailVerificationCode(form.data.email, emailVerificationCode)

            if (!sendEmailVerif.success) {
                return fail(400, form)
            }

            const userEmail = form.data.email

            const pendingVerificationUserData = JSON.stringify({ id: userId, email: userEmail })

			cookies.set(PENDING_USER_VERIFICATION_COOKIE_NAME, pendingVerificationUserData, { path: '/email-verification' } );
        }
        catch(e){
            return message(form, {
				alertType: 'error',
				alertText: 'An error occurred while processing your request. Please try again.'
			});
        }

        throw redirect(303, '/email-verification');
        
    }
}