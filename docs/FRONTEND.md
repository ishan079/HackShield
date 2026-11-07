# Frontend guide

## Stack

Next.js 15 App Router, React 19, TypeScript, Framer Motion, Lucide, CSS variables/component-local styling, and Testing Library/Vitest.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Club landing page |
| `/about` | Mission, values, and milestones |
| `/ctf` | Flagship and Mini CTF interface |
| `/programs` | Learning programs |
| `/resources` | Resource catalog |

## Direct registration

```text
http://localhost:3000/ctf?type=mini&register=mini-14#registration-mini-14
```

`type=mini` selects the view, `register=mini-14` flips the matching card to its form, and the hash provides a QR-friendly anchor. Unknown IDs create no data; the backend rejects unknown sprints.

## Form behavior

The form validates a trimmed `@iitp.ac.in` email and a 2–64 character username limited to ASCII letters, numbers, `.`, `_`, and `-`. It submits by button or Enter, disables repeated submission while pending/after success, retains values after server errors, clears stale errors on edit, and shows the returned reference. The server repeats all validation.

## API client

`lib/api.ts` uses `NEXT_PUBLIC_API_URL`, same-origin credentials, and JSON. It validates the standard envelope and normalizes network errors, non-JSON responses, invalid envelopes, and contradictory HTTP-success combinations.

## Development UI

`next.config.mjs` sets `devIndicators: false`. Restart `npm run dev` after changing Next configuration.

## Adding a feature

1. Update DTOs and OpenAPI.
2. Add the typed `lib/api.ts` call and contract test.
3. Build UI against the client.
4. Add interaction tests for keyboard, pending, success, error, and retry states.
