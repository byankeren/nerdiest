import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { redirect } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/db/db';
import { posts } from '$lib/db/schema';

const schema = z.object({
        content: z.string(),
})

export const load = async ({params, locals}) => {
    const form = await superValidate(zod(schema))
    const user = locals.user.id
    const post = await db
        .selectDistinct({ userId: posts.userId })
        .from(posts)
        .where(eq(posts.id, params.id))
    if (user !== post[0].userId || locals.user.isAdmin){
        throw redirect(303, '/home')
    }
    return { form };
}

export const actions = {
    delete: async ({params, locals}) => {
        const user = locals.user

	    const id = params.id;

        const post = await db.selectDistinct({ id: posts.id, userId: posts.userId }).from(posts).where(eq(posts.id, id))

        if(post[0].userId == locals.user.id || locals.user.isAdmin)
        {
            await db.delete(posts).where(eq(posts.id, id))
            redirect(303, '/home')
        }

        error(401, { message: 'Unauthorized' })
    },
}