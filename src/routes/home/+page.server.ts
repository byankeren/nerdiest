import { superValidate, setError, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { redirect } from '@sveltejs/kit';

import { eq,and } from 'drizzle-orm';
import { db } from '$lib/db/db';
import { posts } from '$lib/db/schema';

import { generateId } from 'lucia';

const schema = z.object({
        content: z.string().min(2),
})

export const load = async ({locals}) => {
    const form = await superValidate(zod(schema))

    const user = locals.user

    const displayPosts = await db.query.posts.findMany({
        with: {
            author: true
        }
    })

    if (!user){
        throw redirect(303, '/login')
    }
    return {form, displayPosts, user}
}

export const actions = {
    createPost: async ({ request, cookies, locals }) => {

        const form = await superValidate(request, zod(schema))

        if (!form.valid) {
                return message(form, {
                		alertType: 'error',
                		alertText: 'There was a problem with your submission.'
                });
            }

            const postId = generateId(15);

            await db.insert(posts).values({
                id: postId,
                userId: locals.user.id,
                content: form.data.content
            })
        
    },
    deletePost: async ({url}) => {
	    const id = url.searchParams.get('id');
        console.log(id)
        await db.delete(posts).where(eq(posts.id, id))
    }
}