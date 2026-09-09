\
# PRODUCTION.md — Lokers.biz.id

## 1. Production Objective

Lokers.biz.id production must deliver a reliable, secure, fast, and maintainable job-discovery and AI cover-letter platform.

Production priorities:

1. Protect user data.
2. Keep AI generation reliable and rate-limited.
3. Keep public job pages fast and indexable.
4. Prevent unauthorized cross-user access.
5. Make deployments reversible.
6. Monitor failures before users report them.

---

## 2. Production Stack

| Layer | Service |
|---|---|
| Web + API | Vercel / Next.js |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth |
| Storage | Supabase Storage |
| AI | Google Gemini |
| Rate limit | Upstash Redis |
| Email | Resend or SendGrid |
| Billing | Stripe or Midtrans |
| Scraping scheduler | GitHub Actions / Vercel Cron |
| Scraping worker | JobSpy / Crawlee / Playwright |
| Error tracking | Sentry |
| Source control | GitHub |

---

## 3. Environment Variables

### Public

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_SITE_URL
```

### Server-only

```text
SUPABASE_SERVICE_ROLE_KEY
GEMINI_API_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
UPSTASH_REDIS_URL
UPSTASH_REDIS_TOKEN
EMAIL_SERVICE_API_KEY
DATABASE_URL
```

Never prefix secrets with `NEXT_PUBLIC_`.

---

## 4. Environment Separation

Maintain:

```text
Development
Preview
Production
```

Rules:
- Production secrets must not be copied into local development.
- Preview environments should use isolated or controlled data.
- Do not test destructive migrations against production.
- Do not use real private CVs as development fixtures.

---

## 5. Deployment Pipeline

```text
Developer
   ↓
Feature branch
   ↓
Pull Request
   ↓
Lint + Typecheck + Tests
   ↓
Preview deployment
   ↓
Manual review
   ↓
Merge to main
   ↓
Production deployment
   ↓
Smoke tests
   ↓
Monitor
```

Recommended CI stages:

```bash
npm ci
npm run lint
npm run test
npm run build
```

If the repository has no test script yet, add the appropriate test setup before treating tests as complete.

---

## 6. Database Migration Policy

All schema changes must be represented by migrations.

Rules:
- Never manually alter production schema without recording the migration.
- Review destructive SQL before production.
- Back up before risky changes.
- Test migrations in a non-production environment.
- Keep RLS policies version-controlled.

Never run:

```sql
DROP TABLE ...
TRUNCATE ...
```

against production without explicit authorization and a verified recovery plan.

---

## 7. Backup & Recovery

Minimum operational plan:

- Use Supabase managed backups.
- Define retention according to the production plan.
- Verify restoration procedure periodically.
- Keep critical migration history in Git.
- Keep generated documents reproducible where practical.

Recovery priorities:
1. Database availability.
2. Authentication.
3. Public jobs.
4. Cover-letter history.
5. Secondary analytics/logs.

---

## 8. Security Checklist

Before production:

- [ ] RLS enabled on every user-owned table.
- [ ] Service-role key server-only.
- [ ] Gemini key server-only.
- [ ] Payment webhook signature validated.
- [ ] PDF upload size/type restricted.
- [ ] Rich text sanitized.
- [ ] API input validated with Zod.
- [ ] AI endpoint rate-limited.
- [ ] Authentication required for private routes.
- [ ] Authorization checks verify ownership.
- [ ] Admin routes protected.
- [ ] No secrets committed to Git.
- [ ] Production uses HTTPS.
- [ ] Security headers reviewed.
- [ ] Error messages do not expose internal details.

---

## 9. AI Production Controls

### Rate limiting

The cover-letter generation endpoint should have a per-user limit such as:

```text
10 requests / minute / user
```

This is an operational starting point and should be tuned using real traffic.

### Usage enforcement

Before generation:
1. authenticate;
2. verify CV ownership;
3. verify job availability;
4. check subscription;
5. check monthly usage;
6. apply rate limit;
7. call Gemini;
8. validate output;
9. persist result.

### Cost controls

- Set maximum output tokens.
- Reject oversized prompts.
- Avoid sending unnecessary CV fields.
- Monitor average generation cost.
- Add provider timeout.
- Add controlled retries only for retryable failures.

---

## 10. File Upload Controls

For CV PDF uploads:

- maximum file size: 5 MB initially;
- accept PDF only;
- verify MIME and file signature where practical;
- do not trust filename extension;
- scan/validate before processing;
- do not expose private uploaded files publicly;
- delete temporary artifacts when no longer needed.

---

## 11. Scraping Operations

Default schedule:

```text
0 */6 * * *
```

This represents an intended six-hour cadence.

Scraping must:
- respect applicable terms and access restrictions;
- use conservative request rates;
- record source and source ID;
- normalize fields;
- deduplicate;
- log success/partial/failure;
- avoid silently replacing manually curated data.

A failed source must not block ingestion from other sources.

---

## 12. Payment Operations

Checkout:

```text
Select plan
   ↓
Create checkout session
   ↓
Provider payment
   ↓
Webhook
   ↓
Verify signature
   ↓
Idempotency check
   ↓
Update subscriptions
   ↓
Update entitlements
```

Never trust the browser to declare payment success.

Webhook processing must be idempotent.

---

## 13. Monitoring

Monitor at minimum:

### Application
- 5xx rate.
- API latency.
- AI error rate.
- AI latency.
- authentication failures.

### Database
- connection/availability.
- slow queries.
- storage.
- RLS-related errors.

### Scraping
- jobs found.
- failed runs.
- partial runs.
- duplicate rate.

### Billing
- webhook failures.
- payment failures.
- subscription state mismatch.

---

## 14. Alerts

Suggested alerts:

- sustained 5xx increase;
- AI provider failure;
- scraping source failure for repeated runs;
- payment webhook failure;
- database availability issue;
- unusually high AI usage;
- abnormal authentication failures.

Avoid noisy alerts that do not require action.

---

## 15. Performance Checklist

- [ ] Server Components used by default.
- [ ] Job list paginated.
- [ ] Database indexes added for common filters.
- [ ] `next/image` used for images.
- [ ] Heavy editor dynamically loaded.
- [ ] Public job detail metadata generated server-side.
- [ ] Static assets cached through CDN.
- [ ] No unnecessary client-side fetching.
- [ ] Lighthouse performance checked.
- [ ] Mobile layout tested.

---

## 16. SEO Production Checklist

- [ ] Dynamic metadata.
- [ ] Canonical URLs.
- [ ] Sitemap.
- [ ] Robots.
- [ ] JobPosting JSON-LD.
- [ ] Open Graph.
- [ ] Social preview.
- [ ] Noindex private dashboard pages.
- [ ] 404/410 behavior defined for removed jobs.

---

## 17. Smoke Test After Deployment

### Public

- [ ] Homepage loads.
- [ ] Job search works.
- [ ] Job detail works.
- [ ] Metadata renders.

### Auth

- [ ] Register.
- [ ] Login.
- [ ] Logout.
- [ ] Password reset.

### Job seeker

- [ ] Create/edit profile.
- [ ] Upload CV.
- [ ] Parse CV.
- [ ] Save CV.
- [ ] Generate cover letter.
- [ ] Edit/save cover letter.
- [ ] Copy/download.
- [ ] Bookmark.
- [ ] Alert.

### Employer

- [ ] Create job.
- [ ] Edit own job.
- [ ] Delete own job.
- [ ] Cannot edit another employer's job.

### Admin

- [ ] Admin login.
- [ ] User management.
- [ ] Job moderation.
- [ ] Scraping logs.

---

## 18. Rollback

If a release causes critical regression:

1. Stop further deployment.
2. Identify whether issue is application, database, provider, or configuration.
3. Roll back application deployment if safe.
4. Do not automatically roll back database migrations without a reviewed reverse migration.
5. Preserve logs.
6. Document incident and corrective action.

---

## 19. Production Definition of Done

A release is production-ready when:

- build passes;
- lint/type checks pass;
- critical tests pass;
- security checklist passes;
- migration is reviewed;
- environment variables are configured;
- smoke tests pass;
- monitoring is active;
- rollback path is understood;
- documentation matches actual behavior.
