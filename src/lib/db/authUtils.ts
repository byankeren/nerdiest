import { RESEND_API_KEY } from '$env/static/private';
import type { Cookies } from '@sveltejs/kit';
import { alphabet, generateRandomString } from 'oslo/crypto';
import type { Lucia } from 'lucia';
import {Resend} from 'resend';
import { db } from './db';
import { emailVerificationCodes, passwordResetTokens, users } from './schema';
import { eq } from 'drizzle-orm';
import { TimeSpan, createDate, isWithinExpirationDate } from 'oslo';
import { generateId } from 'lucia';
import { Argon2id } from "oslo/password";


const resend = new Resend(RESEND_API_KEY)


export const GITHUB_OAUTH_STATE_COOKIE_NAME = 'githubOauthState';
export const GOOGLE_OAUTH_STATE_COOKIE_NAME = 'googleOauthState';
export const GOOGLE_OAUTH_CODE_VERIFIER_COOKIE_NAME = 'googleOauthCodeVerifier';


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
		from: 'potatocode0206@gmail.com',
		to: [email],
		subject: 'Email Verification Code',
		html: `<p>Your email verification code is: <strong>${code}</strong></p>`
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

export const generatePasswordCode = async (userId: string) => {
	const tokenId = generateId(40);

	await db.transaction(async (trx) => {
		await trx.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, userId));

		await trx.insert(passwordResetTokens).values({
			id: tokenId,
			userId,
			expiresAt: createDate(new TimeSpan(60, 'm')) // 15 minutes
		});
	});

	return tokenId;
}


export const sendPasswordResetEmail = async (email: string, resetToken: string) => {
	const htmlContent = `
	<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
		<h1>Password Reset Request</h1>
		<p>We've received a request to reset your password. If you didn't make the request, just ignore this email. Otherwise, you can reset your password using the link below.</p>

		<p>
		<a href="https://nerdiest.vercel.app/reset-password?token=${resetToken}" style="color: #337ab7; text-decoration: none;">Reset your password</a>
		</p>

		<p>If you need help or have any questions, please contact our support team. We're here to help! ${email}</p>
	</div>
	`;

	const { data, error } = await resend.emails.send({
		from: 'potatocode0206@gmail.com',
		to: [email],
		subject: 'Email Verification Code',
		html: htmlContent
	});

	if (error) {
		console.error({ error });
		return { success: false, message: 'Failed to send email verification code.' };
	}

	console.log({ data });

	return { success: true, message: 'Email verification code sent successfully.' };
};

export const verifyPasswordResetToken = async (tokenId: string) => {
	const [passwordResetToken] =  await db.select().from(passwordResetTokens).where(eq(passwordResetTokens.id, tokenId))
	if (!passwordResetToken || passwordResetToken.id !== tokenId) {
		return {
			success: false,
			message: 'The password reset link is invalid. Please request a new one.'
		};
	}

	if (!isWithinExpirationDate(passwordResetToken.expiresAt)) {
		return {
			success: false,
			message: 'The password reset link has expired. Please request a new one.'
		};
	}

	return {
		success: true,
		userId: passwordResetToken.userId,
		message: 'Password reset token is valid.'
	};
}

export const isSameAsOldPassword = async (userId: string, newPassword: string) => {

	const [user] = await db.select({
		password: users.password
	}).from(users).where(eq(users.id, userId))

	if(!user){
		return false
	}

	const isSamePassword = await new Argon2id().verify(user.password, newPassword);

	return isSamePassword
}