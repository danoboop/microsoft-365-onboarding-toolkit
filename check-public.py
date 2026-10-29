"""Public artifact boundary checks. Never prints matched content or secrets."""
from pathlib import Path
from zipfile import ZipFile, is_zipfile
from io import BytesIO
import re, json, sys

ROOT = Path(__file__).resolve().parent
problems=[]; count=0
allowed_email={'alex.rivera@example.com'}
def inspect(name,data):
    global count
    count+=1
    if data[:2]==b'PK':
        try:
            with ZipFile(BytesIO(data)) as z:
                for n in z.namelist():
                    if not n.endswith('/'): inspect(name+'!'+n,z.read(n))
        except Exception:problems.append((name,'unreadable archive'))
        return
    try:text=data.decode('utf-8')
    except UnicodeDecodeError:
        problems.append((name,'unexpected binary file'));return
    checks={
      'credential token':r'(?i)(?:sig=|-----BEGIN (?:RSA |EC )?PRIVATE KEY|eyJ[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}\.)',
      'live bearer literal':r'(?i)bearer\s+[a-z0-9_\-\.]{20,}',
      'unapproved external endpoint':r'https?://(?:[^/\s"\'<>]+\.)?(?:sharepoint\.com|crm\.dynamics\.com|vault\.azure\.net|logic\.azure\.com)(?:/|\b)',
      'credential assignment':r'(?i)["\'](?:client_secret|access_token|refresh_token)["\']\s*:\s*["\'][^"\']+["\']'
    }
    # Do not match this scanner's own regex definitions.
    if not name.endswith('check-public.py'):
        for reason,pattern in checks.items():
            if re.search(pattern,text):problems.append((name,reason))
    for email in re.findall(r'[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}',text):
        if email not in allowed_email and not email.endswith('@example.com') and not email.endswith('.example'):problems.append((name,'non-example email address'))
    if name.endswith('Properties.json'):
        d=json.loads(text)
        for key in ['LocalConnectionReferences','LocalDatabaseReferences']:
            if json.loads(d[key])!={}:problems.append((name,'nonempty connection references'))
        if d.get('ConnectionString'):problems.append((name,'nonempty connection string'))
    if name.endswith('DataSources.json') and json.loads(text).get('DataSources'):problems.append((name,'nonempty data sources'))
    if name.endswith('demo.mjs') or name.endswith('plan.mjs'):
        if re.search(r'\b(?:fetch|XMLHttpRequest|WebSocket|localStorage|sessionStorage)\s*[.(]',text):problems.append((name,'network or storage capability'))

for f in ROOT.rglob('*'):
    if f.is_file() and not any(p in {'.git','node_modules','__pycache__'} for p in f.relative_to(ROOT).parts):inspect(str(f.relative_to(ROOT)),f.read_bytes())
if problems:
    for name,reason in problems:print(name+': '+reason)
    sys.exit(1)
print(f'Passed public artifact checks: {count} files, including nested archives. Manual review still required.')
