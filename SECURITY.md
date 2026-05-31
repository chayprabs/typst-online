# Security Policy

## Supported versions

| Version | Supported |
|---------|-----------|
| 1.x     | Yes       |

## Reporting a vulnerability

Please report security issues privately via GitHub Security Advisories on
https://github.com/chayprabs/typst-online or contact the maintainer at
https://www.chaitanyaprabuddha.com.

Do not open public issues for undisclosed vulnerabilities.

## Scope

- TypstBox worker compile sandbox and resource limits
- Rate limiting and package allowlist bypass
- Artifact URL exposure beyond TTL

## Out of scope

- Denial of service via large legitimate compiles within published limits
- Issues in upstream typst-cli
