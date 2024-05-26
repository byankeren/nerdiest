import { redirect } from '@sveltejs/kit';

export const load = async ({locals}) => {
    const user = locals.user
    // if (!user){
    //     throw redirect(303, '/login')
    // }
    console.log(locals.user.isAdmin)
    // return {user}
}
