# Microsoft Graph integration

All requests below are made by the installing organization's authenticated flow, never by the public demo or portfolio website. Only the fixed `https://graph.microsoft.com` service is used. Configure the tenant and verified domain in the target environment. The browser form must not choose arbitrary tenants, Graph endpoints, license SKUs, or permissions.

## Authentication

Recommended for this manual starter: use Power Automate's **HTTP with Microsoft Entra ID** connector, if supported and permitted in your environment, with Graph as its resource/base URL and an authorized operator connection. Follow the connector's setup and consent requirements; an OAuth connection is separate from the Power Apps license. Restrict run-only access: a flow can act with the connection owner's authority.

For a reviewed application-identity deployment, the installer registers an application in their own tenant and obtains admin consent for only the required permissions. Use a supported server-side connection or token acquisition implementation. Never place a client secret, certificate, access token, or password in canvas formulas, the demo, an issue, or source control. This repository does not implement an OAuth broker or deploy an identity. If storing a secret in Azure Key Vault, create the vault/connection privately in your own environment and enable secure inputs/outputs on secret and token actions.

## Operations

| Step | Request | Permission considerations |
|---|---|---|
| Duplicate check | `GET /v1.0/users/{encoded-UPN}?$select=id,userPrincipalName` | Appropriate user-read permission; `User.Read.All` is commonly used. Only 404 means absent. |
| Create user | `POST /v1.0/users` | Microsoft currently lists `User.Create` as least privileged, with `User.ReadWrite.All` a higher-privilege alternative. Connector support/consent must be checked. |
| Assign manager (optional) | `PUT /v1.0/users/{id}/manager/$ref` | `User.ReadWrite.All`; delegated operation also requires an appropriately authorized operator. |
| Assign license (optional) | `POST /v1.0/users/{id}/assignLicense` | `LicenseAssignment.ReadWrite.All`; supported Entra role required for delegated use. |

Do not grant broad directory write permissions by default. Resolve the final permission set from the exact operations and authentication type. A license assignment should use a trusted configured SKU and availability check, not an arbitrary ID supplied by the client.

## Create-user body

```json
{
  "accountEnabled": false,
  "displayName": "Alex Rivera",
  "givenName": "Alex",
  "surname": "Rivera",
  "mailNickname": "alex.rivera",
  "userPrincipalName": "alex.rivera@example.com",
  "department": "Engineering",
  "jobTitle": "Engineer",
  "officeLocation": "Remote",
  "usageLocation": "US",
  "passwordProfile": {
    "forceChangePasswordNextSignIn": true,
    "password": "${GENERATE_AT_RUNTIME}"
  }
}
```

`example.com` is documentation-only, not a usable verified tenant domain. `${GENERATE_AT_RUNTIME}` is a placeholder, **not a usable password**. The flow must replace it with a unique runtime-generated password satisfying the target policy. Keep that value out of run-history visibility and responses. No default/shared password is provided. Account enablement and secure initial-access delivery are intentionally outside this starter.

Manager body: `{"@odata.id":"https://graph.microsoft.com/v1.0/users/{manager-object-id}"}`.

License body: `{"addLicenses":[{"skuId":"{installer-selected-sku-id}"}],"removeLicenses":[]}`.

## Official references

- [Create user](https://learn.microsoft.com/en-us/graph/api/user-post-users?view=graph-rest-1.0)
- [Get user](https://learn.microsoft.com/en-us/graph/api/user-get?view=graph-rest-1.0)
- [Assign manager](https://learn.microsoft.com/en-us/graph/api/user-post-manager?view=graph-rest-1.0)
- [Assign license](https://learn.microsoft.com/en-us/graph/api/user-assignlicense?view=graph-rest-1.0)
- [HTTP with Microsoft Entra ID connector](https://learn.microsoft.com/en-us/connectors/webcontents/)

This release excludes legacy per-user MFA changes. The installing organization's Conditional Access and authentication policies remain authoritative.
