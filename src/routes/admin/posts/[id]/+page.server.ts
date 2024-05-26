import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '$lib/db/db';
import { posts } from '$lib/db/schema';

const schema = z.object({
        content: z.string().min(2),
})

export const load = async ({locals, params}) => {
    const post = await db.select().from(posts).where(eq(posts.id, params.id))

    console.log(post)
    return {post}
}
