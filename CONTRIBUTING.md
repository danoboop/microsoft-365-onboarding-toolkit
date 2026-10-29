# Contributing

Use fictional data and mocked Microsoft Graph responses. Keep all tenant-connected testing within environments where you have permission.

1. Explain the problem and proposed behavior in an issue, without private records or exports.
2. Make a focused branch and change.
3. Run `npm test` and `python check-public.py`.
4. Explain your validation and any untested tenant-dependent behavior in the pull request.

Do not add live endpoints, default passwords, tenant IDs, user records, third-party provisioning, or secrets. Canvas import validation is welcome; report only generic results and platform versions, never connection metadata or run-history screenshots.
