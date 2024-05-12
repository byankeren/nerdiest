import { sql } from 'drizzle-orm';

import { alias, integer, primaryKey, sqliteTable, text, type AnySQLiteColumn } from 'drizzle-orm/sqlite-core';

import { relations } from 'drizzle-orm';

export const users = sqliteTable('users', {
	id: text('id').primaryKey().notNull(),

	name: text('name').unique(),

	avatarUrl: text('avatar_url'),

	email: text('email').unique().notNull(),

	password: text('password'),

	isAdmin: integer('is_admin', { mode: 'boolean' }).default(0),

	authMethods: text('auth_methods', { mode: 'json' }).$type<string[]>().notNull(),

	createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
});

export const usersSessions = sqliteTable('users_sessions', {
	id: text('id').primaryKey().notNull(),

	userId: text('user_id')
		.notNull()
		.references(() => users.id, {onDelete: 'cascade', onUpdate: 'cascade'}),

	expiresAt: integer('expires_at').notNull()
});

export const oauthAccountsTable = sqliteTable('oauth_accounts',{
		userId: text('user_id')
			.notNull()
			.references(() => users.id, {onDelete: 'cascade', onUpdate: 'cascade'}),

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
	.references(() => users.id, {onDelete: 'cascade', onUpdate: 'cascade'}),

	content: text('content'),

	createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
})

export const likes = sqliteTable('likes', {
	id: text('id').primaryKey().notNull(),

	userId: text('user_id')
	.notNull()
	.references(() => users.id),

	postId: text('post_id')
	.notNull()
	.references(() => posts.id, {onDelete: 'cascade', onUpdate: 'cascade'}),
})

export const comments = sqliteTable('comments', {
	id: text('id').primaryKey().notNull(),

	content: text('content'),

	commentRepliedId: text('comments_id')
	.references((): AnySQLiteColumn => comments.id, {onDelete: 'cascade', onUpdate: 'cascade'}),

	userId: text('user_id')
	.notNull()
	.references(() => users.id, {onDelete: 'cascade', onUpdate: 'cascade'}),

	postId: text('post_id')
	.notNull()
	.references(() => posts.id, {onDelete: 'cascade', onUpdate: 'cascade'}),
})


export const tags = sqliteTable('tags', {
	id: text('id').primaryKey().notNull(),
	name: text('name').notNull()
})

export const postsToTags = sqliteTable('posts_to_tags', {
	id: text('id').primaryKey().notNull(),
	postId: text('post_id')
	.notNull()
	.references(() => posts.id, {onDelete: 'cascade', onUpdate: 'cascade'}),
	tagId: text('tag_id')
	.notNull()
	.references(() => tags.id, {onDelete: 'cascade', onUpdate: 'cascade'}),
})

export const usersRelations = relations(users, ({ many }) => ({
	posts: many(posts),
	comments: many(comments),
}));


export const postsRelations = relations(posts, ({ one, many }) => ({
	author: one(users, {
	  	fields: [posts.userId],
	  	references: [users.id],
	}),
	likes: many(likes),
	comments: many(comments),
	postsToTags: many(postsToTags),
}));	

export const tagsRelations = relations(tags, ({many}) => ({
	postsToTags: many(postsToTags)
}));

export const postsToTagsRelations = relations(postsToTags, ({one}) => ({
	post: one(posts, {
		fields: [postsToTags.postId],
		references: [posts.id],
  	}),
	tag: one(tags, {
		fields: [postsToTags.tagId],
		references: [tags.id],
  	}),
}))

export const likesRelations = relations(likes, ({ one }) => ({
	post: one(posts, { 
		fields: [likes.postId],
		references: [posts.id],
  	}),
}));

export const commentsRelation = relations(comments, ({one, many}) => ({
	author: one(users, {
		fields: [comments.userId],
		references: [users.id],
  	}),
	post: one(posts, { 
		fields: [comments.postId],
		references: [posts.id],
  	}),
	parent: one(comments, {
		fields: [comments.commentRepliedId],
		references: [comments.id],
		relationName: "ParentComment",
	}),
	children: many(comments, { relationName: "ParentComment" }),
}))

export type UserInsertSchema = typeof users.$inferInsert;