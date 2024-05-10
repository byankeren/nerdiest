import { superValidate, setError, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { redirect } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { eq,and, isNull } from 'drizzle-orm';
import { db } from '$lib/db/db';
import { comments, likes, posts } from '$lib/db/schema';

import { generateId } from 'lucia';

const schema = z.object({
        content: z.string().min(2),
})

export const load = async ({locals}) => {
    const user = locals.user

    if (!user){
        throw redirect(303, '/login')
    }

    const form = await superValidate(zod(schema))


    const displayPosts = await db.query.posts.findMany({
        with: {
            author: {
                columns: {
                    email: false,
                    password: false,
                    authMethods: false
                }
            },
            likes: {
                columns: {
                    userId: true
                }
            },
            comments: {
                with: {
                    children: true
                },
                where: isNull(comments.commentRepliedId),
            },
        }
    }).then(posts => {
        return posts.map(post => {
            const postLikes = post.likes.filter(like => like.userId === locals.user.id);
    
            const postTotalComments = post.comments.reduce((acc, comment) => acc + 1 + (comment.children ? comment.children.length : 0), 0);
    
            return {
                ...post,
                likedByCurrentUser: postLikes.length > 0,
                totalComments: postTotalComments
            };
        });
    });
    
    return {form, displayPosts, user}
}

export const actions = {
    createPost: async ({ request, cookies, locals }) => {
            const form = await superValidate(request, zod(schema))
            console.log(form)
            if (!form.valid) {
                console.log(form)
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
    deletePost: async ({url, locals}) => {
	    const id = url.searchParams.get('id');

        const post = await db.selectDistinct({ id: posts.id, userId: posts.userId }).from(posts).where(eq(posts.id, id))

        if(post[0].userId == locals.user.id)
        {
            await db.delete(posts).where(eq(posts.id, id))
            return
        }
    },
    like: async ({locals, url}) => {
        const postId = url.searchParams.get('id');

        const likesId = generateId(15);

        const likedPosts = await db
        .select({ postId: likes.postId })
        .from(likes)
        .where(and(eq(likes.postId, postId), eq(likes.userId, locals.user.id)));

        const hasLikedPost = likedPosts.length > 0;

        if (hasLikedPost) {
            console.log("The current user has liked this post.");
            await db
            .delete(likes)
            .where(and(eq(likes.postId, postId), eq(likes.userId, locals.user.id)));
        } else {
            console.log("The current user has not liked this post.");
            await db.insert(likes).values({
                id: likesId,
                userId: locals.user.id,
                postId: postId
            })
        }       
    }
}