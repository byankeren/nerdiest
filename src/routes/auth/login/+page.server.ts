import { superValidate, setError, message } from 'sveltekit-superforms';
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

const schema = z.object({
        email: z.string().email().min(2),
        password: z.string()
})

export const load = async () => {
    const form = await superValidate(zod(schema))
    return {form}
}

export const actions = {
    login: async ({request, cookies}) => {
        const form = await superValidate(request, zod(schema))

        if (!form.valid) {
            return fail(400, { form });
        }

        console.log(form)
            const [isUserExist] = await db.select({id: users.id, password: users.password}).from(users).where(eq(users.email, form.data.email))

            if (isUserExist === undefined) {
                return setError(form, 'email', 'Email not registered');
            }

            const validPassword = await new Argon2id().verify(
                isUserExist.password,
                form.data.password
            );

            if (!validPassword) {
                return setError(form, 'password', 'Incorrect password');
            }

            
		await createAndSetSession(lucia, isUserExist.id, cookies);

		throw redirect(303, '/');
    }
}
