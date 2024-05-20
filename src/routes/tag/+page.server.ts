import { error } from "@sveltejs/kit"
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { db } from '$lib/db/db';
import { generateId } from 'lucia';
import { tags } from '$lib/db/schema';


const schema = z.object({
        name: z.string().min(2),
})
export const load = async ({locals}) => {
    const isAdmin = locals.user.isAdmin
    const form = await superValidate(zod(schema))
    if(!isAdmin) {
        error(401, { message: 'Unauthorized' })
    }
    
    return {form}
}


export const actions = {
    createTag: async({request}) => {
        const form = await superValidate(request, zod(schema))
        console.log(request)
        if (!form.valid) {
            console.log(form)
            return message(form, {
            		alertType: 'error',
            		alertText: 'There was a problem with your submission.'
            });
        }

        const id = generateId(4)
               
        await db.insert(tags).values({
            id: id,
            name: form.data.name
        })
    }
}