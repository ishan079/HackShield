# Contribution Guidelines & Development Workflow

All contributors must follow these guidelines to maintain code quality, prevent conflicts, and ensure changes are properly reviewed and tested before release.

> **Workflow note:** This private repository does not use GitHub branch-protection rules. The review, testing, and approval requirements below are therefore mandatory team practices and must be followed manually.

## 1. Branch Structure

This repository follows a **Feature → Staging → Main** workflow.

| Branch | Purpose |
|---|---|
| `main` | Stable, release-ready code |
| `staging` | Integration and end-to-end testing before release |
| `feature/*` | New features or improvements |
| `fix/*` | Bug fixes discovered during development or staging |
| `hotfix/*` | Urgent fixes for problems discovered on `main` |

### Branch Rules

- **Never commit or push directly to `main` or `staging`.**
- Always create a separate working branch from the latest `staging` branch.
- Keep each branch focused on a specific task or issue.
- Use descriptive names such as `feature/login-page`, `fix/navbar-alignment`, or `hotfix/authentication-error`.
- All changes must reach `staging` or `main` through approved Pull Requests (PRs).

## 2. Pull Requests & Code Review

Once development is complete:

1. Push your working branch to the remote repository.
2. Open a PR targeting `staging`.
3. Clearly describe the changes, affected functionality, and any testing performed.
4. Assign the appropriate reviewer:

   - **Ishan** — Frontend changes, UI, UX, styling, and client-side functionality.
   - **Shashank** — Backend changes, APIs, databases, server-side functionality, and integrations.
   - **Both** — Changes involving frontend and backend or shared functionality.

### Review & Revision Rules

- Never merge a PR without the required approval.
- If changes are requested, review the comments and implement the corrections.
- Push the corrections to the **same branch**, which automatically updates the existing PR.
- Resolve review discussions and request another review.
- If new commits materially change the approved code, obtain fresh approval.
- Merge only when the required reviewers have approved and all mandatory checks pass.

## 3. Staging Integration & E2E Testing

After a PR is approved, merge it into `staging`.

The updated `staging` branch must undergo end-to-end (E2E) testing to validate:

- Individual features and their expected behavior.
- Frontend and backend integrations.
- API communication and data handling.
- Existing features for regressions.
- Error handling and critical user workflows.

### If Staging Passes

1. Record the successful validation and the exact tested commit. This commit is the **release candidate**.
2. Freeze the validated release candidate against further changes.
3. Raise a **new PR from `staging` to `main`**.
4. Obtain the required release approval.
5. Confirm that the PR contains only the intended, tested changes.
6. Merge into `main` only after all release checks pass.

**Staging approval does not automatically authorize a merge into `main`. A separate PR and approval are mandatory.**

### If Staging Fails

1. **Block promotion to `main` immediately.**
2. Document the issue, including reproduction steps and affected functionality.
3. Create a `fix/*` branch from the latest `staging`.
4. Implement the necessary fix and raise a PR back into `staging`.
5. Complete the normal review process.
6. Merge the approved fix into `staging`.
7. Rerun the relevant tests and the complete required E2E suite.
8. Only proceed with the `staging` → `main` PR after validation succeeds.

Repeat this process until staging passes.

Do not bypass testing or merge known failures into `main`.

## 4. Release: Staging → Main

Once staging E2E testing succeeds:

1. Raise a separate PR with:
   - **Source:** `staging`
   - **Target:** `main`
2. Include a summary of the changes, successful E2E test results, and any known limitations.
3. Verify that the PR's commit and contents match the validated staging release candidate.
4. Obtain the appropriate approval from Ishan, Shashank, or both, depending on the changes.
5. Merge the PR only after the required checks pass.

### Post-Merge Verification

After merging into `main`:

1. Run E2E testing again on `main`.
2. Confirm all critical features, integrations, and workflows operate correctly.
3. Validate that the deployed release, if applicable, corresponds to the approved code.
4. Mark the release successful only after verification passes.

**A successful merge into `main` is not considered a successful release until post-merge E2E validation passes.**

## 5. Failure Handling & Contingencies

### Case A: Review Fails or Changes Are Requested

**Flow:**

`Working Branch → PR → Changes Requested → Fix on Same Branch → Re-review → Approval`

- Do not open a new PR for ordinary review corrections.
- Keep all requested changes in the existing PR.
- Do not merge until approval is obtained.

### Case B: E2E Testing Fails on Staging

**Flow:**

`staging → fix/* → PR to staging → Review → Merge → E2E Retest`

- Block release promotion.
- Resolve and retest all release-blocking issues.
- If the issue is caused by a recently merged change that cannot be fixed promptly, revert the problematic change through an approved PR to `staging`.
- Retest the updated staging state before creating or proceeding with a release PR.

### Case C: Issue Found During the Staging → Main PR

- Do not merge the release PR.
- Create a `fix/*` branch from `staging` if review finds a code defect.
- Merge the reviewed fix back into `staging`.
- Rerun the required staging E2E tests.
- Update the existing release PR if appropriate, and obtain approval again.

If the release candidate changes, its previous E2E validation is no longer sufficient.

### Case D: E2E Testing Fails on Main

**Flow:**

`main → Incident Assessment → Hotfix or Rollback → Validation → Synchronize Staging`

1. Immediately mark the release as failed and notify the relevant reviewers.
2. Determine the severity and impact.
3. Suspend further promotions to `main` until the problem is addressed.
4. Select the appropriate recovery path:

**Option 1 — Hotfix**

For a targeted issue that can be corrected safely:

- Create `hotfix/*` from the affected `main` commit.
- Implement and test the fix.
- Raise an urgent PR targeting `main`.
- Obtain review and required approval.
- Merge and rerun E2E testing on `main`.
- Merge the correction back into `staging` through a separate PR and validate it there.

**Option 2 — Rollback / Revert**

For a serious regression or an unsafe release:

- Restore the last known-good deployment where supported, or prepare an approved Git revert PR to undo the problematic change.
- Do not rewrite or reset the shared `main` branch's history.
- Verify the restored state using the required tests.
- Record what was reverted and why.
- Reconcile `staging` with the corrected `main` state before attempting another release.

A deployment rollback and a Git revert are different operations. If the deployment is rolled back without reverting repository changes, the team must explicitly resolve that mismatch before the next release.

### Case E: Main Hotfix Not Present in Staging

**Flow:**

`hotfix/* → PR to main → Main E2E → PR to staging → Staging E2E`

- Every fix applied to `main` must be brought back into `staging`.
- Resolve conflicts through a reviewed PR.
- Validate staging again after synchronization.
- Never allow a future release to silently overwrite or undo a production hotfix.

### Case F: Merge Conflicts or Outdated Branches

- Update the working branch with the latest relevant target branch.
- Resolve conflicts on the working branch, not directly on `main` or `staging`.
- Rerun affected tests after conflict resolution.
- Request another review if the effective changes have been modified.
- Never force-push to `main` or `staging`.

### Case G: New Changes Enter Staging During Release Validation

- Treat the new staging state as an unvalidated release candidate.
- Pause promotion of the updated staging branch.
- Rerun staging E2E testing against the new commit.
- Refresh release approval if the PR contents have changed.

Prefer freezing staging during release validation and promotion. If unrelated work must continue, coordinate a separately isolated release branch rather than mixing untested changes into the release candidate.

### Case H: E2E Tests Fail Because of Infrastructure or Test Flakiness

- Investigate whether the failure is caused by application code, test code, environment configuration, or infrastructure.
- Do not automatically classify failures as harmless.
- Rerun tests only after documenting or correcting the likely cause.
- Do not mark a release as validated while mandatory checks are failing or inconclusive.
- If a test is legitimately inapplicable, its exception must be documented and approved by the relevant reviewers.

### Case I: Security or Critical Production Incident

- Notify the relevant maintainers immediately.
- Stop unrelated releases.
- Contain the issue first, including disabling affected functionality or rolling back deployment if necessary.
- Use the emergency hotfix/revert process with expedited review.
- Never commit secrets, credentials, or sensitive incident details into PRs.
- Validate the fix on `main`, synchronize it into `staging`, and perform regression testing.

Emergency urgency may accelerate review, but does not authorize unreviewed direct pushes to `main` or `staging`.

## 6. General Rules

- No direct pushes to `main` or `staging`.
- No merging without required approval.
- No promotion of unvalidated staging changes.
- No merging with unresolved blocking review comments.
- No force-pushing or rewriting `main` or `staging` history.
- A failed E2E run blocks release until the cause is resolved and testing succeeds.
- Every production hotfix must be synchronized back into staging.
- Every changed release candidate must be revalidated.
- Keep PRs focused, traceable, and clearly documented.

## 7. Workflow Summary

### Standard Development

`staging → feature/* or fix/* → PR to staging → Code Review → Merge → Staging E2E → PR from staging to main → Release Review → Merge → Main E2E → Release Validated`

### Staging Failure

`Staging E2E Failed → fix/* from staging → PR to staging → Review → Merge → Staging E2E Again`

### Main Failure

`Main E2E Failed → Block Release → Hotfix / Rollback → Validate Main → Synchronize Staging → Validate Staging`

### Release Validation Rule

**No change is considered fully released unless:**

1. The code has passed the appropriate reviews.
2. The complete release candidate has passed staging E2E testing.
3. A separate `staging` → `main` PR has been approved.
4. Main E2E testing has passed after merging.
5. All production fixes and rollbacks are reconciled with staging.

**No exceptions to review and release-validation requirements.**
