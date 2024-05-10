import { superValidate, setError, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { redirect } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { eq,and, isNull } from 'drizzle-orm';
import { db } from '$lib/db/db';
import { users } from '$lib/db/schema';

export const load = async ({locals, params}) => {
    const user = locals.user

    if (!user){
        throw redirect(303, '/login')
    }
    const profile = await db.select({
        name: users.name,
        avatarUrl: users.avatarUrl,
        createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.name, params.name))

  return { profile,user };
}