import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { redirect } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/db/db';
import { tags } from '$lib/db/schema';

const schema = z.object({
        name: z.string().min(2),
})

export const load = async ({locals, params}) => {
    const tag = await db.select().from(tags).where(eq(tags.id, params.id))

    const editForm = await superValidate(tag[0], zod(schema))

    return {editForm}
}


export const actions = {
    edit: async ({ request, cookies, locals, params }) => {
        const form = await superValidate(request, zod(schema))
        if (!form.valid) {
            console.log(form)
            return message(form, {
                    alertType: 'error',
                    alertText: 'There was a problem with your submission.'
            });
        }
        if(locals.user.isAdmin)
        {
            await db.update(tags).set({name: form.data.name}).where(eq(tags.id, params.id))
            return redirect(303, '/admin/tags')
        }
        error(401, { message: 'Unauthorized' })
    },
}
