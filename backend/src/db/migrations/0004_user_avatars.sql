-- Profile photos. The app never serves a stock picture of somebody else: a user
-- uploads their own image and the bytes live in the global (identity) database
-- next to the account they belong to.
--
-- One row per user (the primary key is the user id): re-uploading replaces the
-- old image, and deleting the row falls back to the initials avatar the client
-- renders when `avatarUrl` is null.

CREATE TABLE IF NOT EXISTS user_avatars (
  user_id      uuid PRIMARY KEY,
  content_type text NOT NULL CHECK (content_type IN ('image/jpeg', 'image/png', 'image/webp')),
  bytes        bytea NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS user_avatars_updated_idx ON user_avatars (updated_at);
