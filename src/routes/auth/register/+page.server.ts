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

const schema = z.object({
        username: z.string().min(2),
        email: z.string().email().min(2),
        password: z.string().min(2)
})

export const load = async () => {
    const form = await superValidate(zod(schema))
    return {form}
}

export const actions = {
    register: async ({request}) => {
        const form = await superValidate(request, zod(schema))

        console.log(form)
        if (!form.valid) {
            return fail(400, { form });
        }

        try{
            const isEmailExist = await db.select({email: users.email}).from(users).where(eq(users.email, form.data.email))
            
            if(isEmailExist.length > 0){
                return setError(form, 'email', 'Email already registered');
            }

            const userId = generateId(15);
			const hashedPassword = await new Argon2id().hash(form.data.password);

            await db.insert(users).values({
                id: userId,
				username: form.data.username,
				email: form.data.email,
				password: hashedPassword
            })
        }
        catch(e){
            return message(form, {
				alertType: 'error',
				alertText: 'An error occurred while processing your request. Please try again.'
			});
        }

        throw redirect(303, '/');
        
    }
}