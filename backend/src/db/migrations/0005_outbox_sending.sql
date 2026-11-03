-- 0005_outbox_sending.sql
-- The push dispatcher claims rows with FOR UPDATE SKIP LOCKED and moves them to
-- `sending` before delivering. That prevents two workers from sending the same
-- row twice; a crashed worker is recovered after the lease expires.

ALTER TABLE outbox DROP CONSTRAINT IF EXISTS outbox_status_check;
ALTER TABLE outbox
  ADD CONSTRAINT outbox_status_check CHECK (status IN ('pending', 'sending', 'sent', 'failed'));

CREATE INDEX IF NOT EXISTS outbox_sending_idx ON outbox (status, updated_at);
