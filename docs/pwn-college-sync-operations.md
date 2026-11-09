# pwn.college synchronization operations

The pwn.college cache is refreshed by a cron job on `myserver` every fifteen
minutes, at minutes `07`, `22`, `37`, and `52` UTC. It calls the protected
production endpoint:

```text
POST https://hackshield.stciitphybrid.in/api/v1/internal/pwn-college/sync
```

## Server configuration

The server keeps the token in `/root/.config/hackshield-pwn-sync.env` with
permissions `600`. The value is the Vercel Production secret named
`PWN_COLLEGE_SYNC_TOKEN`. Do not commit, paste, or send that token in chat.

The executable is `/usr/local/sbin/hackshield-pwn-sync`, and the cron entry is
managed in root's crontab. It uses `flock` so a delayed run cannot overlap with
the next scheduled run. Output is appended to
`/var/log/hackshield-pwn-sync.log`.

## Manual synchronization

To trigger the same protected operation without exposing the token, run the
server-side script:

```bash
ssh myserver '/usr/local/sbin/hackshield-pwn-sync'
```

To inspect recent outcomes:

```bash
ssh myserver 'tail -n 50 /var/log/hackshield-pwn-sync.log'
```

For a direct request from another trusted machine, obtain the current value
from the Vercel Production environment and supply it only through a local shell
variable; never place it in a committed document or shell history:

```bash
curl --fail --silent --show-error --request POST \
  --header "Authorization: Bearer $PWN_COLLEGE_SYNC_TOKEN" \
  https://hackshield.stciitphybrid.in/api/v1/internal/pwn-college/sync
```

The endpoint rejects missing or incorrect tokens. A `409` response means a
previous synchronization is still running; no data is overwritten in that
case.
