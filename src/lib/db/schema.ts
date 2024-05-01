import { sql } from 'drizzle-orm';

import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { relations } from 'drizzle-orm';

export const users = sqliteTable('users', {
	id: text('id').primaryKey().notNull(),

	name: text('name'),

	avatarUrl: text('avatar_url'),

	email: text('email').unique().notNull(),

	password: text('password'),

	authMethods: text('auth_methods', { mode: 'json' }).$type<string[]>().notNull(),

	createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
});

export const usersSessions = sqliteTable('users_sessions', {
	id: text('id').primaryKey().notNull(),

	userId: text('user_id')
		.notNull()
		.references(() => users.id),

	expiresAt: integer('expires_at').notNull()
});

export const oauthAccountsTable = sqliteTable('oauth_accounts',{
		userId: text('user_id')
			.notNull()
			.references(() => users.id, {
				onDelete: 'cascade'
			}),

		providerId: text('provider_id').notNull(),

		providerUserId: text('provider_user_id').notNull()
	},
	(t) => ({
		pk: primaryKey({ columns: [t.providerId, t.providerUserId] })
	})
);

export const posts = sqliteTable('posts', {
	id: text('id').primaryKey().notNull(),
	userId: text('user_id')
	.notNull()
	.references(() => users.id),
	content: text('content'),
})

export const usersRelations = relations(users, ({ many }) => ({
	posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
	author: one(users, {
	  	fields: [posts.userId],
	  	references: [users.id],
	}),
}));

export type UserInsertSchema = typeof users.$inferInsert;