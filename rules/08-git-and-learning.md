# Rule 08: Git, docs and learning

- Branch per feature. Conventional Commits: `feat:`, `fix:`, `test:`, `docs:`, `refactor:`, `chore:`, `perf:`.
- One PR per feature with a description, a screenshot or clip, and the requirement IDs it covers. The user merges their own PRs.
- Never fake activity: no empty commits, no scripted contribution graphs.
- Every important choice gets an ADR in `docs/decisions/` (`NNNN-title.md`).
- Update `docs/STATE.md` when adding data to the app and `docs/TRACEABILITY.md` when proof appears.
- Public repo must have README (with the first-screen block), `.env.example`, MIT `LICENSE`, description and topics.
- **Explain-back:** after helping build something, tell the user to close the chat and write the paragraph in `docs/LEARNING-LOG.md` themselves. Never author their entries.
- Be able to explain every line: prefer simple, readable code over clever code.
