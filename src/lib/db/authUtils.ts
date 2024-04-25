import { RESEND_API_KEY } from '$env/static/private';
import type { Cookies } from '@sveltejs/kit';
import { alphabet, generateRandomString } from 'oslo/crypto';
import type { Lucia } from 'lucia';
import {Resend} from 'resend';
import { db } from './db';
import { emailVerificationCodes } from './schema';
import { eq } from 'drizzle-orm';
import { TimeSpan, createDate, isWithinExpirationDate } from 'oslo';
import { generateId } from 'lucia';

const resend = new Resend(RESEND_API_KEY)

export const PENDING_USER_VERIFICATION_COOKIE_NAME = 'pendingUserVerification';

export const createAndSetSession = async (lucia: Lucia, userId: string, cookies: Cookies) => {

	const session = await lucia.createSession(userId, {});

	const sessionCookie = lucia.createSessionCookie(session.id);

	cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});
};

export const deleteSessionCookie = async (lucia: Lucia, cookies: Cookies) => {
	const sessionCookie = lucia.createBlankSessionCookie();

	cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});
};

// export const generateEmailVerificationCode = async (userId: string, email: string) => {

// 		await db.delete(emailVerificationCodes)
// 		.where(eq(emailVerificationCodes.userId, userId));

// 		const code = generateRandomString(6, alphabet('0-9'));

// 		await db.insert(emailVerificationCodes).values({
// 			userId: userId,
// 			email,
// 			code,
// 			expiresAt: createDate(new TimeSpan(5, 'm')) // 5 minutes
// 		});

// 	return code;
// };

export const generateEmailVerificationCode = async (userId: string, email: string) => {
    try {
        // Delete any existing verification codes for this user
        await db.delete(emailVerificationCodes)
            .where(eq(emailVerificationCodes.userId, userId));

        // Generate a new verification code
        const code = generateRandomString(6, alphabet('0-9'));

        // Insert the new verification code into the database
        await db.insert(emailVerificationCodes).values({
			id: generateId(15),
			userId: userId,
			email,
			code,
			expiresAt: createDate(new TimeSpan(5, 'm')) // 5 minutes
		});

        return code; // Return the generated code
    } catch (error) {
        console.error("Error in generateEmailVerificationCode:", error);
        throw error; // Re-throw the error to handle it outside
    }
};

export const sendEmailVerificationCode = async (email: string, code: string) => {
	const { data, error } = await resend.emails.send({
		from: 'onboarding@resend.dev',
		to: ['yanbyannn@gmail.com'],
		subject: 'Email Verification Code',
		html: `<p>Your email verification code is: <strong>${code}${email}</strong></p>`
	});

	if (error) {
		console.error({ error });
		return { success: false, message: 'Failed to send email verification code.' };
	}

	console.log({ data });

	return { success: true, message: 'Email verification code sent successfully.' };
};


export const verifyEmailVerificationCode = async (userId: string, code: string) => {
	const [verificationCode] = await db
		.select()
		.from(emailVerificationCodes)
		.where(eq(emailVerificationCodes.userId, userId));

	if (!verificationCode) {
		return { success: false, message: 'Verification code not found.' };
	}

	if (verificationCode.code !== code) {
		return { success: false, message: 'The provided verification code is incorrect.' };
	}

	if (!isWithinExpirationDate(verificationCode.expiresAt)) {
		return {
			success: false,
			message: 'The verification code has expired, please request a new one.'
		};
	}

	await db
		.delete(emailVerificationCodes)
		.where(eq(emailVerificationCodes.userId, userId));

	return { success: true, message: 'Email verification successful!' };
};