# Build the installer-owned provisioning flow

The canvas app ships disconnected. This guide describes the intended connected implementation; it has not been executed against a tenant for this release. Use your approved test process before production.

1. In your existing environment create an instant flow named `Microsoft365Onboarding` with **Power Apps (V2)** as its trigger. Add one **Text** input named **Payload**. The generated JSON field may be named `text`; select its Payload dynamic-content token instead of assuming its internal key.
2. Add **Parse JSON**, using Payload as content and `payload.schema.json` as schema.
3. Initialize trusted flow-side configuration for the verified domain, permitted roles/departments, work locations, usage location, and optional license SKU mappings. Environment variables may be used if you place the app/flow in a solution. Never accept tenant/domain/SKU overrides from the canvas client.
4. Validate again on the server: required names, alias allowlist, permitted role, work-location allowlist, and manager object ID if supplied. Reject unexpected fields or oversized input. Build `alias@configured-domain`. The browser's validation is not an authorization boundary. The `plan.mjs` module demonstrates the checks but does not execute inside Power Automate automatically; reproduce the checks with conditions or an approved server implementation.
5. Use a fixed Graph connection. The HTTP-with-Entra-ID connector is one option; see `API.md`. Configure resource/base URL as Graph according to the connector's documentation and your tenant consent rules. Do not use anonymous request triggers or copy external connection IDs.
6. **Check existing user:** issue the duplicate-check GET from `API.md`. Handle 200 as `already_exists`. Continue only on 404. Fail closed on 401, 403, 429, 5xx, or transport failure. Do not automatically choose a different alias: report a conflict for operator review.
7. **Generate password privately:** generate a unique temporary password at runtime through an approved mechanism. Never accept a password from this starter form. Mark actions containing or deriving it with **Secure Inputs / Secure Outputs**, including the create-user request. Do not put the password in Compose outputs, email, app responses, screenshots, or logs. Confirm your mechanism meets the tenant's password requirements.
8. **Create user:** POST the create-user body with `accountEnabled: false`. This avoids enabling an account before provisioning and initial-access handoff are reviewed. Capture only the returned object ID and UPN for subsequent steps. After an uncertain POST result, query the UPN before retrying; blindly repeating creation can leave an unknown partial state.
9. **Optional manager:** validate the selected ID against the same directory and PUT the manager reference. Skip when blank. Do not treat failures as successful onboarding.
10. **Optional license:** choose the SKU from trusted configuration, check availability, set usageLocation, then assign. Group-based licensing requires a different implementation; do not mix mechanisms without a defined policy. Service provisioning can be asynchronous.
11. **Respond to a Power App or flow:** return text outputs `status`, `userPrincipalName`, `stage`, and `message`. Example success: `created_disabled`, UPN, `complete`, `Account created disabled; administrator handoff required.` Return no passwords, tokens, raw request bodies, or raw API error payloads. Use `partial_failure` with the failed stage if the user was already created. Keep account enablement a separate authorized action.
12. Restrict run-only permissions and connection usage to onboarding operators. Choose the correct runner/owner connection model for your organization; a shared owner connection can elevate callers. Validate authorization before sharing.

## Test before operational use

- No inputs can change the configured tenant, domain, endpoint, or license SKU.
- Missing/invalid inputs are rejected before any mutation.
- Duplicate user returns a conflict; permission-denied lookup does not create a user.
- A newly created account is disabled and no secret appears in the response or accessible run history.
- Optional manager/licensing failures return an accurate partial state.
- A retry does not re-create the account or reset its password.
- Unauthorized app users cannot run the flow.
- No legacy connections, URLs, or data remain when packaging your own deployment.

For repeatable distribution after independent validation, place your app and flow in a **solution** with connection references and environment variables. Export without target-specific values. This repository deliberately provides no preauthenticated solution or production export.
