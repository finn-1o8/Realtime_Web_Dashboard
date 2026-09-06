# Security notes

This repository is a UI prototype with a mock backend. It is meant to run on a developer machine. Before anything derived from it faces real users, the items under "Not implemented" have to be addressed.

## What the mock server does

- Restricts browser origins for both REST and Socket.IO. Outside production it allows the Vite dev origins and non-browser clients; in production it allows only the origins listed in `CORS_ORIGIN`.
- Validates and bounds every input: IDs must match `^[a-zA-Z0-9_-]{1,100}$`, camera settings must be finite numbers between 0 and 1000 under known keys, recording configuration values are checked against allowed types and enums, strings are trimmed and capped at 200 characters.
- Limits request bodies to 1 MB.
- Rate-limits `/api` to 600 requests per 15 minutes per client address, with expired entries evicted. Set `TRUST_PROXY=true` behind a reverse proxy so the client address is taken from `X-Forwarded-For`; otherwise every client would share the proxy's bucket.
- Sends `X-Content-Type-Options: nosniff`. Content-Security-Policy is set on the HTML page (`index.html`), which is where it applies.

## What the front-end does

- No `dangerouslySetInnerHTML`; React escapes rendered text.
- Content-Security-Policy in `index.html` allows scripts only from the same origin, inline styles for MUI/Emotion, and connections to the same origin and the local mock.

## Not implemented

- Authentication and authorisation. Anyone who can reach the mock can read its data and change camera settings or start recordings.
- Transport security. Run behind a TLS-terminating reverse proxy.
- Persistent or distributed rate limiting; the current limiter is per process and in memory.
- Audit logging.

## Dependencies

`npm audit` runs in CI. Dependabot opens pull requests for dependency updates weekly.

## Reporting

If you find a security problem, open an issue without exploit details and it will be followed up privately.
