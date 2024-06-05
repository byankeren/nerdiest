import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { redirect } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/db/db';
import { posts,postsToTags, tags } from '$lib/db/schema';

import { generateId } from 'lucia';

const schema = z.object({
        content: z.string().min(2),
        postsToTags: z.any()
})

export const load = async ({ params, locals }) => {
    let post = await db.query.posts.findFirst({
        with: {
        postsToTags: true
    },
        where: eq(posts.id, params.id),
    })

    const user = locals.user.id

    if (user == post.userId || locals.user.isAdmin){
        const tags = await db.query.tags.findMany({})
        post.postsToTags = tags.map(tag => {
            const postTag = post.postsToTags.find(pt => pt.tagId === tag.id);
            if (postTag) {
                return {
                    ...postTag,
                    ...tag
                };
            }
            return {};
        });
        const editForm = await superValidate(post, zod(schema))
        return {editForm, post, tags}
    }
    throw redirect(303, '/home')

}


export const actions = {
    edit: async ({ request, locals, params }) => {
        const form = await superValidate(request, zod(schema))

        const filteredTags = form.data.postsToTags.filter(i => Object.keys(i).length !== 0);

        const postId = params.id

        if (!form.valid || filteredTags.length == 0) {
            return message(form, {
                    alertType: 'error',
                    alertText: 'There was a problem with your submission.'
            });
        }

        const post = await db.selectDistinct({ id: posts.id, userId: posts.userId }).from(posts).where(eq(posts.id, params.id))
        if(post[0].userId == locals.user.id || locals.user.isAdmin)
        {
            await db.transaction(async (tx) => {
                await tx.delete(postsToTags).where(eq(postsToTags.postId, postId))
                for (let i = 0; i < filteredTags.length; i++) {
                    console.log(filteredTags[i].id)
                    const tagId = generateId(6);
                    await tx.insert(postsToTags).values({
                        id: tagId,
                        postId: postId,
                        tagId: filteredTags[i].id
                    })
                }
                await tx.update(posts).set({content: form.data.content}).where(eq(posts.id, params.id))
            })
            return redirect(303, '/home')
        }
        error(401, { message: 'Unauthorized' })
    },
}
