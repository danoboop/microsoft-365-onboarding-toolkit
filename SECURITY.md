# Security boundaries

The public demo and request planner are offline. They have no Microsoft authentication, access tokens, stored configuration, or provisioning endpoint. The canvas starter contains no data sources or connections and does not create users.

Real provisioning requires an installer-owned flow and authorized Microsoft access. Those permissions are powerful. This repository cannot guarantee the security of a recipient's configuration. Review permissions, caller authorization, secure action histories, password generation and delivery, audit retention, and account enablement before use.

Original internal exports and flow run histories are not part of this repository. Reconstruct connections privately in your own environment. Do not commit connection exports, `.env` files, certificates, tenant-specific configuration, personal records, or credentials. Example placeholders are deliberately nonfunctional.

Run `python check-public.py` before publishing changes. This checks nested canvas contents for unexpected network hosts, email addresses, risky credential literals, and nonempty connection references. It is a review aid, not proof that arbitrary contributions are safe. Review every diff and archive manually as well.

Do not disclose a suspected vulnerability or credential through a public issue. If a credential was exposed, revoke it through the owning organization first, then contact the maintainer through the professional contact link at https://heyitsdanish.com/ without sending the secret itself.
