import { sql } from 'drizzle-orm';

import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
	id: text('id').primaryKey().notNull(),

	username: text('username').notNull(),

	email: text('email').notNull().unique(),

	isEmailVerified: integer('is_email_verified', { mode: 'boolean' }).notNull().default(false),

	password: text('password').notNull(),

	createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
});

export const usersSessions = sqliteTable('users_sessions', {
	id: text('id').primaryKey().notNull(),

	userId: text('user_id')
		.notNull()
		.references(() => users.id),

	expiresAt: integer('expires_at').notNull()
});

export const emailVerificationCodes = sqliteTable('email_verification_codes', {
	id: text('id').primaryKey().notNull(),
	
	userId: text('user_id')
	.notNull()
	.references(() => users.id),

	code: text('code').notNull(),

	email: text('email').notNull(),

	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()

})


export const passwordResetTokens = sqliteTable('password_reset_tokens', {
	id: text('id').primaryKey().notNull().unique(),
	
	userId: text('user_id')
	.notNull()
	.references(() => users.id),


	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()

})

export type UserInsertSchema = typeof users.$inferInsert;