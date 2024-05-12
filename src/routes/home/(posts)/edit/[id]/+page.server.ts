import { superValidate, setError, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { redirect } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { eq,and, isNull } from 'drizzle-orm';
import { db } from '$lib/db/db';
import { comments, likes, posts } from '$lib/db/schema';

import { generateId } from 'lucia';
import { alias } from 'drizzle-orm/sqlite-core/alias';

const schema = z.object({
        content: z.string().min(2),
})

export const load = async ({locals, params}) => {
    const post = await db.select({content: posts.content}).from(posts).where(eq(posts.id, params.id))
    const editForm = await superValidate(post[0], zod(schema))
    const user = locals.user



    return {editForm}
}


export const actions = {
    edit: async ({ request, cookies, locals, params }) => {
        const form = await superValidate(request, zod(schema))
        if (!form.valid) {
            console.log(form)
            return message(form, {
                    alertType: 'error',
                    alertText: 'There was a problem with your submission.'
            });
        }
        const post = await db.selectDistinct({ id: posts.id, userId: posts.userId }).from(posts).where(eq(posts.id, params.id))
        if(post[0].userId == locals.user.id || locals.user.isAdmin)
        {
            await db.update(posts).set({content: form.data.content}).where(eq(posts.id, params.id))
            return redirect(307, '/home');
        }
    },
}