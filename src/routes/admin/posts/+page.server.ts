import { superValidate, setError, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { redirect } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { db } from '$lib/db/db';

import { generateId } from 'lucia';
import { posts } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

const schema = z.object({
        content: z.string().min(2),
        tags: z.array(z.string()).refine((value) => value.some((item) => item))
})

export const load = async ({locals}) => {
    const user = locals.user

    const form = await superValidate(zod(schema))

    const posts = await db.query.posts.findMany({
        with: {
            author: {
                columns: {
                    password: false,
                    authMethods: false
                }
            },
            likes: {
                columns: {
                    userId: true
                }
            },
        }
    })
    return {posts, form}
}


export const actions = {
    deletePost: async ({url, locals}) => {
        const user = locals.user

        if (!user){
            throw redirect(303, '/login')
        }

	    const id = url.searchParams.get('id');

        if(locals.user.isAdmin)
        {
            await db.delete(posts).where(eq(posts.id, id))
            return
        }

        error(401, { message: 'Unauthorized' })
    },
}
