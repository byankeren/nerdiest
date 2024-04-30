import type { RequestHandler } from './$types';

import { OAuth2RequestError } from 'arctic';
import { and, eq } from 'drizzle-orm';
import { generateId } from 'lucia';

import {
	GITHUB_OAUTH_STATE_COOKIE_NAME,
	createAndSetSession
} from '$lib/db/authUtils';

import { db } from '$lib/db/db';
import { githubOauth, lucia } from '$lib/db/lucia';
import { oauthAccountsTable, users } from '$lib/db/schema';

export const GET: RequestHandler = async (event) => {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');

    const storedState = event.cookies.get(GITHUB_OAUTH_STATE_COOKIE_NAME);

	if (!code || !state || !storedState || state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		// Validate the authorization code and retrieve the tokens
		const tokens = await githubOauth.validateAuthorizationCode(code);

		// Fetch the GitHub user associated with the access token
		const githubUserResponse = await fetch('https://api.github.com/user', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});

		// Fetch the primary email address of the GitHub user
		const githubEmailResponse = await fetch('https://api.github.com/user/emails', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});

		const githubUser = await githubUserResponse.json();
		const githubEmail = await githubEmailResponse.json();

		const primaryEmail = githubEmail.find((email) => email.primary) ?? null;

		if (!primaryEmail) {
			return new Response('No primary email address', {
				status: 400
			});
		}

		if (!primaryEmail.verified) {
			return new Response('Unverified email', {
				status: 400
			});
		}

        const [existingUser] = await db.select().from(users).where(eq(users.email, primaryEmail.email))

		if (existingUser) {
			const [existingOauthAccount] = await db
				.select()
				.from(oauthAccountsTable)
				.where(
					and(
						eq(oauthAccountsTable.providerId, 'github'),
						eq(oauthAccountsTable.providerUserId, githubUser.id.toString())
					)
				);

			if (!existingOauthAccount) {
				const authMethods = existingUser.authMethods || [];
				authMethods.push('github');

				await db.transaction(async (trx) => {
					await trx.insert(oauthAccountsTable).values({
						userId: existingUser.id,
						providerId: 'github',
						providerUserId: githubUser.id.toString()
					});
					await trx
						.update(users)
						.set({
							authMethods
						})
						.where(eq(users.id, existingUser.id));
				});
			}
			await createAndSetSession(lucia, existingUser.id, event.cookies);
		} else {
			const userId = generateId(15);
			await db.transaction(async (trx) => {
				await trx.insert(users).values({
					id: userId,
					name: githubUser.name,
					avatarUrl: githubUser.avatar_url,
					email: primaryEmail.email,
					isEmailVerified: true,
					authMethods: ['github']
				});
				await trx.insert(oauthAccountsTable).values({
					userId,
					providerId: 'github',
					providerUserId: githubUser.id.toString()
				});
			});

			await createAndSetSession(lucia, userId, event.cookies);
		}

		return new Response(null, {
			status: 302,
			headers: {
				Location: '/',
			}
		});
	} catch (error) {
		console.error(error);
		if (error instanceof OAuth2RequestError) {
			return new Response(null, {
				status: 400
			});
		}

		return new Response(null, {
			status: 500
		});
	}
};