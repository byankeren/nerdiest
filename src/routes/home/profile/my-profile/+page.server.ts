import { superValidate, setError, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { redirect } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

import { eq } from 'drizzle-orm';

import { db } from '$lib/db/db';

import { users } from '$lib/db/schema';

import fs from 'fs';
import path from 'path';

const schema = z.object({
    avatar: z.string(),
    name: z.string().min(2),
})

export const load = async ({ locals }) => {
    const staticDir = path.resolve('static/profile');

    const user = locals.user

    const myProfile = await db.select().from(users).where(eq(users.name, user.name))

    const form = await superValidate(myProfile[0], zod(schema))

    let profilePictures: string[] = [];

    profilePictures = fs.readdirSync(staticDir).filter(file => {
        return file.endsWith('.png');
    });

    return { myProfile, profilePictures, form }
} 

export const actions = {
    default: async ({request, locals}) => {

        const form = await superValidate(request, zod(schema))

        let avatarUrl = form.data.avatar

        const name = form.data.name

        if (!form.valid) {
            console.log(form)
            return message(form, {
                    alertType: 'error',
                    alertText: 'There was a problem with your submission.'
            });
        }

        if(avatarUrl == '') {
            avatarUrl = locals.user.avatarUrl
        }

        await db.update(users)
            .set({ 
                avatarUrl: avatarUrl,
                name: name
            })
            .where(eq(users.id, locals.user.id));

        console.log(form.data.avatar)
    }
}