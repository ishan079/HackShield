# HackShield site map

This is the public information architecture currently exposed by the website.
The generated XML equivalent is available at `/sitemap.xml` after deployment.

```text
/
├── /ctf                 CTF landing page and Mini CTF registration
│   └── ?type=mini&register=mini-14
│                         Direct registration state; not a separate canonical page
├── /programs            HackShield learning programs
├── /resources           Curated cybersecurity resources
└── /about               Club information
```

## Search indexing policy

`/sitemap.xml` includes only the five canonical public routes above. Query
variants, including the direct Mini CTF registration URL, are intentionally
excluded to prevent duplicate search results. API routes, database endpoints,
and static assets are also excluded.

`/robots.txt` allows crawlers to access public pages and points them to the
generated sitemap. Set `SITE_URL` to the final HTTPS domain in the deployment
environment so both files use the correct absolute URL.
