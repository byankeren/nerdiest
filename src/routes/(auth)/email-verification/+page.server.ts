import { fail, redirect, type Actions, type Cookies } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/client';
import {
	PENDING_USER_VERIFICATION_COOKIE_NAME,
	createAndSetSession,
	generateEmailVerificationCode,
	sendEmailVerificationCode,
	verifyEmailVerificationCode,
} from '$lib/db/authUtils';
import { db } from '$lib/db/db';
import { lucia } from '$lib/db/lucia';
import { users } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const schema = z.object({
    verifCode: z.string().length(6),
})

const getCookie = (cookies: Cookies) => {
    const cookieData = cookies.get(PENDING_USER_VERIFICATION_COOKIE_NAME);
    if (!cookieData) {
        return null;
    }
    return JSON.parse(cookieData);
}


export const load = async ({ cookies }) => {
    const userData = getCookie(cookies)

    // if(!userData) {
    //     return redirect(303, '/register')
    // }

    return {
        // pendingUserEmail: userData.email,
        emailVerifCodeForm: await superValidate(zod(schema))
    }
}

export const actions = {
    verifyCode: async ({request,cookies}) => {
        const userData = getCookie(cookies);

		if (!userData) {
            return redirect(303, '/register')
        };

        const emailVerifCodeForm = await superValidate(request, zod(schema))

        if (!emailVerifCodeForm.valid) {
            return fail(400, { form });
        }

        const isCodeValid = await verifyEmailVerificationCode(
            userData.id,
            emailVerifCodeForm.data.verifCode
        )

        if (!isCodeValid) {
			return message(emailVerifCodeForm, {
				alertType: 'error',
				alertText: isCodeValid.message
			});
		}

        cookies.set(PENDING_USER_VERIFICATION_COOKIE_NAME, '', {
			maxAge: 0,
			path: '/email-verification'
		});

        await db
        .update(users)
        .set({ isEmailVerified: true })
        .where(eq(users.email, userData.email));

        await createAndSetSession(lucia, userData.id, cookies);

        throw redirect(303, '/');
    },

    sendNewCode: async ({ cookies }) => {
		const userData = getCookie(cookies);

		if (!userData) return redirect(303, '/register');

		const emailVerificationCode = await generateEmailVerificationCode(userData.id, userData.email);

		const sendEmailVerificationCodeResult = await sendEmailVerificationCode(
			userData.email,
			emailVerificationCode
		);

		if (!sendEmailVerificationCodeResult.success) {
			return fail(500, {
				message: sendEmailVerificationCodeResult.message
			});
		}

		return {
			message: 'A new verification code has been sent to your email'
		};
	}
}


