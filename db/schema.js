import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
export const events = sqliteTable(
  'events',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    hook: text('hook').notNull(),
    startDate: text('start_date').notNull(),
    endDate: text('end_date').notNull(),
    caption: text('caption').notNull(),
    imagesJson: text('images_json').notNull(),
    status: text('status').notNull().default('draft'),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (table) => [index('events_status_date').on(table.status, table.startDate)],
);
export const sessions = sqliteTable('admin_sessions', {
  tokenHash: text('token_hash').primaryKey(),
  csrf: text('csrf').notNull(),
  credentialVersion: text('credential_version').notNull(),
  expiresAt: integer('expires_at').notNull(),
});
export const attempts = sqliteTable('login_attempts', {
  key: text('key').primaryKey(),
  attempts: integer('attempts').notNull().default(0),
  windowStart: integer('window_start').notNull(),
});
export const uploads = sqliteTable('uploads', {
  id: text('id').primaryKey(),
  objectKey: text('object_key').notNull(),
  mime: text('mime').notNull(),
  size: integer('size').notNull(),
  createdAt: integer('created_at').notNull(),
});

export const siteImages = sqliteTable('site_images', {
  id: text('id').primaryKey(),
  kind: text('kind').notNull(),
  src: text('src').notNull(),
  uploadId: text('upload_id'),
  title: text('title').notNull(),
  alt: text('alt').notNull(),
  caption: text('caption').notNull().default(''),
  position: integer('position').notNull(),
  deleted: integer('deleted').notNull().default(0),
  updatedAt: integer('updated_at').notNull(),
});
