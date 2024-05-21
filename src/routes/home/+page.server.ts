import { superValidate, setError, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { redirect } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { eq,and, isNull } from 'drizzle-orm';
import { db } from '$lib/db/db';
import { comments, likes, posts, postsToTags, tags } from '$lib/db/schema';

import { generateId } from 'lucia';

const schema = z.object({
        content: z.string().min(2),
        tags: z.array(z.string()).refine((value) => value.some((item) => item))
})

export const load = async ({locals}) => {
    const user = locals.user

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
                    children: {
                        columns: {
                            id: true
                        }
                    }
                },
                where: isNull(comments.commentRepliedId),
                columns: {
                    id: true
                }
            },
            postsToTags: {
                columns: {
                    id: false,
                    postId: false,
                    tagId: false
                },
                with: {
                    tag: {
                        columns: {
                            name: true
                        }
                    }
                }
            }
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
    const displayTags = await db.select().from(tags)
    // console.log( displayPosts )
    return {form, displayPosts, user, displayTags}
}

export const actions = {
    createPost: async ({ request, locals }) => {
            const user = locals.user
            if (!user){
                throw redirect(303, '/login')
            }
            const form = await superValidate(request, zod(schema))
            if (!form.valid) {
                console.log(form)
                return message(form, {
                		alertType: 'error',
                		alertText: 'There was a problem with your submission.'
                });
            }

            await db.transaction(async (tx) => {

                const postId = generateId(15);
                
                await tx.insert(posts).values({
                    id: postId,
                    userId: locals.user.id,
                    content: form.data.content
                }).returning({insertedPost: posts.id})

                for (let i = 0; i < form.data.tags.length; i++) {
                    const tagId = generateId(6);
                    console.log(tagId)
                    await tx.insert(postsToTags).values({
                        id: tagId,
                        postId: postId,
                        tagId: form.data.tags[i]
                    })
                }
            })
    },
    deletePost: async ({url, locals}) => {
        const user = locals.user

        if (!user){
            throw redirect(303, '/login')
        }

	    const id = url.searchParams.get('id');

        const post = await db.selectDistinct({ id: posts.id, userId: posts.userId }).from(posts).where(eq(posts.id, id))

        if(post[0].userId == locals.user.id || locals.user.isAdmin)
        {
            await db.delete(posts).where(eq(posts.id, id))
            return
        }

        error(401, { message: 'Unauthorized' })
    },
    like: async ({locals, url}) => {
        const user = locals.user

        if (!user){
            throw redirect(303, '/login')
        }

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
