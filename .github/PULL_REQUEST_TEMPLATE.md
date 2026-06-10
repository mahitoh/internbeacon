## What does this PR do?

<!-- One sentence summary -->

## Type of change

- [ ] Bug fix
- [ ] New feature
- [ ] Refactor / cleanup
- [ ] Config / dependency update

## Checklist

### General
- [ ] Frontend builds locally (`cd frontend && npm run build`)
- [ ] Both backend and frontend start without errors

### API & data
- [ ] New or changed endpoints are reflected in the README API table
- [ ] camelCase ↔ snake_case mapping is correct (frontend camelCase, DB snake_case)
- [ ] Response shape follows `{ success, data }` / `{ success, message }`

### Database
- [ ] No schema changes required, **or** migration has been applied to the Supabase project
- [ ] `company_id` in `internship_offers` references `company_profiles.id`, not the auth user ID

### Environment
- [ ] No new env vars required, **or** they are documented in CLAUDE.md and the README

### AI / matching
- [ ] If touching `aiProvider.js` or `fallbackMatcher.js`: tested with all AI providers disabled (algorithmic fallback kicks in)
- [ ] If adding a new AI endpoint: handles the 503 case gracefully

### Real-time
- [ ] If touching Socket.IO rooms or events: tested that messages/notifications arrive without a page refresh

### Security
- [ ] No secrets or API keys are hardcoded
- [ ] File uploads validated via `file-type` buffer inspection, not extension alone
