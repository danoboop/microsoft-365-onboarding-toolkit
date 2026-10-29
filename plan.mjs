// This module only builds a request plan. It never fetches, authenticates, or provisions.
const clean = (v, name, max = 100) => {
  if (typeof v !== 'string' || !v.trim() || v.length > max || /[\x00-\x1f\x7f]/.test(v)) throw new Error(`Invalid ${name}`);
  return v.trim();
};
const guid = v => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
export function buildPlan(person, config) {
  const firstName = clean(person.firstName, 'first name');
  const lastName = clean(person.lastName, 'last name');
  const domain = clean(config.domain, 'domain', 253).toLowerCase();
  if (!/^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,63}$/.test(domain)) throw new Error('Invalid domain');
  const profile = config.profiles?.find(p => p.role === person.role);
  if (!profile) throw new Error('Choose a configured role');
  const alias = clean(person.alias, 'alias', 64).toLowerCase();
  if (!/^[a-z0-9]+(?:[._-][a-z0-9]+)*$/.test(alias)) throw new Error('Alias must use letters, numbers, and single separators');
  const location = clean(person.workLocation, 'work location');
  if (!config.workLocations?.includes(location)) throw new Error('Choose a configured work location');
  const usageLocation = clean(config.usageLocation, 'usage location', 2).toUpperCase();
  if (!/^[A-Z]{2}$/.test(usageLocation)) throw new Error('Usage location must be a two-letter country code');
  const department = clean(profile.department, 'department');
  const upn = `${alias}@${domain}`;
  const steps = [
    { id: 'duplicate-check', method: 'GET', path: `/v1.0/users/${encodeURIComponent(upn)}?$select=id,userPrincipalName`, note: 'Continue only after a confirmed 404. A permission, throttling, or network failure is not a missing user.' },
    { id: 'create-user', method: 'POST', path: '/v1.0/users', body: { accountEnabled: false, displayName: `${firstName} ${lastName}`, givenName: firstName, surname: lastName, mailNickname: alias, userPrincipalName: upn, jobTitle: profile.role, department, officeLocation: location, usageLocation, passwordProfile: { forceChangePasswordNextSignIn: true, password: '${GENERATE_AT_RUNTIME}' } }, note: 'Generate a unique temporary password in the installer-owned flow. Secure inputs and outputs; never return or log it. Account stays disabled for administrator handoff.' }
  ];
  if (person.managerId) {
    if (!guid(person.managerId)) throw new Error('Manager must be a directory object ID');
    steps.push({ id: 'set-manager', method: 'PUT', path: '/v1.0/users/${USER_ID}/manager/$ref', body: { '@odata.id': `https://graph.microsoft.com/v1.0/users/${person.managerId}` } });
  }
  if (profile.licenseSkuId) {
    if (!guid(profile.licenseSkuId)) throw new Error('Invalid configured license SKU');
    steps.push({ id: 'assign-license', method: 'POST', path: '/v1.0/users/${USER_ID}/assignLicense', body: { addLicenses: [{ skuId: profile.licenseSkuId }], removeLicenses: [] }, note: 'Optional: verify availability and usageLocation first. Licensing can incur costs in the installing organization.' });
  }
  return { mode: 'preview', userPrincipalName: upn, steps, handoff: 'Review results and securely establish initial access before an administrator enables the account. No password is returned.' };
}
