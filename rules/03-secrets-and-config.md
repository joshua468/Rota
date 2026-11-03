# Rule 03: Secrets and configuration

- No secrets in code, commits, logs or the app bundle.
- `EXPO_PUBLIC_*` is limited to `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_SENTRY_DSN`, `EXPO_PUBLIC_APP_SCHEME`. Anything else must be added to the table in `docs/SECURITY.md` with a reason, or rejected.
- Server config is read once through a Zod-validated `env.ts`; the process refuses to start on a missing or malformed value.
- `.env.example` lists variable **names only**, never values.
- If a secret was ever committed, rotate it at the provider. Deleting the file is not a fix.
- Tokens use `expo-secure-store`. `AsyncStorage` is never used for tokens or secrets.
