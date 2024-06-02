import { eq } from 'drizzle-orm';
import { db } from '$lib/db/db';
import { users } from '$lib/db/schema';

export const load = async ({locals, params}) => {
    const user = locals.user

    const profile = await db.select({
        name: users.name,
        avatarUrl: users.avatarUrl,
        createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.name, params.name))

    return { profile,user };
}