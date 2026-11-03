-- Assignment response: the member a shift is assigned to can accept it or
-- decline it. Declining releases the shift back to the team, which means the
-- assignee column must be allowed to be empty — an open shift has no assignee.
-- Existing rows are unaffected: they are treated as already accepted.

ALTER TABLE shifts ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE shifts ADD COLUMN IF NOT EXISTS assignment_status text NOT NULL DEFAULT 'accepted';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'shifts_assignment_status_check'
  ) THEN
    ALTER TABLE shifts
      ADD CONSTRAINT shifts_assignment_status_check
      CHECK (assignment_status IN ('pending', 'accepted', 'declined'));
  END IF;
END $$;
