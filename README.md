# Microsoft 365 Onboarding Toolkit

A connection-free Power Apps canvas starter, Microsoft Graph integration guide, and offline request preview by Danish Idrees.

This project generalizes an onboarding workflow I built for internal IT operations. The public edition is limited to Microsoft user provisioning and uses fictional examples. It contains no live organization connections, tenant configuration, employee records, credentials, or vendor integrations.

## Status

**v0.1 â€” starter kit.** The browser preview and request planner are tested locally. The canvas starter is a disconnected demo: it previews an email address and does not create accounts. Opening the `.msapp` in Power Apps Studio and the connected provisioning flow have **not been validated in a separate tenant**. No tenant was created for this release. Import validation and a full provisioning test are required before organizational use.

This is not a one-click production solution ZIP. The repository includes a canvas `.msapp`, its JSON control source for review, Power Fx formulas, an exact flow build guide, and Graph request examples. Installers create and authorize their own flow.

## Try without Microsoft access

Download this repository and run `python -m http.server 8080` from its root. Open `http://localhost:8080/`. The demo has no fetch calls, sign-in, analytics, browser storage, or provisioning capability. Use fictional names. It builds a request plan entirely in your browser.

For the planner tests, use a supported Node.js LTS version and run `npm test`. No npm packages or cloud credentials are required.

## Power Apps installation

1. Use an **existing Microsoft work/school tenant and Power Platform environment** where you have permission to create apps and flows. This project does not create a tenant, environment, app registration, consent grant, or user.
2. Open Power Apps Studio, choose **Open / Browse**, and select `Microsoft365Onboarding.msapp`. Save it as a new app in your environment. Keep demo mode enabled while inspecting the app. The source file has no data sources or saved connections.
3. Review the generic role/department and work-location choices. Replace the example domain only in your own copy. For production, keep trusted provisioning configuration in the flow, not in client-supplied fields.
4. Build a flow named `Microsoft365Onboarding` using [the flow setup guide](POWER-AUTOMATE.md). The flow uses the **Power Apps (V2)** trigger and Microsoft Graph. All connections belong to the installing organization.
5. Add that flow through Power Apps Studio's **Power Automate** pane. Bind the create button using [the connected Power Fx example](Connected-OnSelect.fx). Adding the flow through Studio generates the correct connection references. Do not paste connection IDs from another organization.
6. Restrict app sharing and the flow's run-only permissions to authorized onboarding staff. Do not expose this privileged workflow as an anonymous HTTP endpoint.
7. Validate with an approved test account. Confirm duplicate detection, disabled-account creation, manager assignment, optional licensing, permission denials, and partial failures before enabling operational use.

See [API requests and permissions](API.md), [security and validation](SECURITY.md), and [contribution instructions](CONTRIBUTING.md).

## Licensing and costs

Open-source licensing does not include Microsoft service licenses. Users need appropriate Power Apps and Power Automate use rights for the app and premium connectors/actions selected, and the installing organization needs the Microsoft 365/Entra subscriptions and available licenses it assigns. A Microsoft 365 subscription alone does not automatically cover every premium connector. An Azure Key Vault is optional and has separate Azure requirements/costs if chosen. No shared service, tenant, developer plan, or license is provided by this repository.

Consult current Microsoft [Power Platform licensing guidance](https://learn.microsoft.com/power-platform/admin/powerapps-flow-licensing-faq) and your licensing administrator; requirements depend on the actual app/flow design. Do not assume a Power Apps license alone covers every deployment.

## Included scope

- New user name, alias, role, department, work location, and usage location.
- Duplicate-user check and disabled-account creation.
- Optional manager assignment and license assignment.
- Safe result summary with no passwords.
- Offline request preview and automated validation tests.

Excluded: third-party provisioning, vendor notifications, document templates, password delivery, automatic account enablement, MFA policy changes, and administrative-role assignment. Assigning a license does not mean an Exchange mailbox or Teams service is immediately ready.

## Repository files

- `Microsoft365Onboarding.msapp`: disconnected Power Apps canvas starter.
- `Canvas-App.json`, `Canvas-Screen.json`, `Canvas-Properties.json`: readable app control/configuration source. Platform control definitions are inside the canvas archive.
- `Connected-OnSelect.fx`, `payload.schema.json`, `POWER-AUTOMATE.md`, `API.md`: installer-owned integration setup.
- `plan.mjs`, `plan.test.mjs`, `config.example.json`: offline request planner, tests, and fictional configuration.
- `index.html`, `demo.mjs`, `style.css`: public browser demonstration.
- `check-public.py`: public artifact boundary checks, including nested archives.

## Contributions

Useful contributions include independently validating canvas import, testing the flow in an authorized test tenant, improving accessible controls, and adding mocked failure tests. Never attach real exports, employee details, passwords, access tokens, tenant-specific configuration, or flow run histories to an issue or pull request.

MIT licensed for the project-authored code and documentation. Microsoft products and platform control definitions remain subject to their own terms. This is an independent community project, not a Microsoft product.
