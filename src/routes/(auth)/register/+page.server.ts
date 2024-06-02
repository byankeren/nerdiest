import { superValidate, setError, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { redirect } from '@sveltejs/kit';

import { eq } from 'drizzle-orm';
import { db } from '$lib/db/db';
import { users } from '$lib/db/schema';

import { generateId } from 'lucia';
import { Argon2id } from "oslo/password";

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
        console.log(form.errors)
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
            const avatars = ['avatar-1.png', 'avatar-2.png', 'avatar-3.png', 'avatar-4.png', 'avatar-5.png'];
            avatars.sort(() => Math.random() - 0.5);

            if (!isUserExist) {
				await db.insert(users).values({
                    id: userId,
                    name: form.data.name,
                    email: form.data.email,
                    password: hashedPassword,
                    avatarUrl: avatars[0],
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
        }
        catch(e){
            return message(form, {
				alertType: 'error',
				alertText: 'An error occurred while processing your request. Please try again.'
			});
        }

        throw redirect(303, '/login');
        
    }
}