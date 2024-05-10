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

const replySchema = z.object({
        content: z.string().min(2),
})

export const load = async ({locals, params}) => {
    const user = locals.user

    if (!user){
        throw redirect(303, '/login')
    }
    const form = await superValidate(zod(schema));
    const replyForm = await superValidate(zod(replySchema));
    
    const displayPost = await db.query.posts.findFirst({
      where: eq(posts.id, params.id),
      with: {
        author: {
          columns: {
            password: false,
            email: false
          }
        },
        comments: {
          with: {
            children: {
              with: {
                author: {
                  columns: {
                    password: false,
                    email: false
                  }
                }
              }
            },
            author: {
              columns: {
                password: false,
                email: false
              }
            },
          },
          where: isNull(comments.commentRepliedId),
        },
      },
    })
    // 9fn05rrexb4b173
    if(!displayPost){
      return error(404, {messages: 'not found'})
    }
    
    return { form, replyForm, displayPost, user };
}

export const actions = {
  postComments: async({request, locals, url}) => {
        const form = await superValidate(request, zod(schema))
        const postId = url.searchParams.get('post_id')
        if (!form.valid) {
            return message(form, {
				      alertType: 'error',
				      alertText: 'There was a problem with your submission.'
			    });
        }
        const id = generateId(15);
        await db.insert(comments).values({
          id: id,
          content: form.data.content,
          userId: locals.user.id,
          postId: postId,
        })
  },
  postReply: async({request, locals, url}) => {
    const replyForm = await superValidate(request, zod(replySchema))
    const postId = url.searchParams.get('post_id')
    const commentRepliedId = url.searchParams.get('reply_id')
    console.log(commentRepliedId)
    if (!replyForm.valid) {
      return message(replyForm, {
        alertType: 'error',
        alertText: 'There was a problem with your submission.'
      });
    }
    const id = generateId(15);
    await db.insert(comments).values({
      id: id,
      content: replyForm.data.content,
      commentRepliedId: commentRepliedId,
      userId: locals.user.id,
      postId: postId,
    })

  }
}
