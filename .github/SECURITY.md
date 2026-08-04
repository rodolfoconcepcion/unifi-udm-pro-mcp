# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

**⚠️ This MCP server controls network infrastructure (firewalls, VLANs, port forwarding). Security issues are treated with the highest priority.**

### How to Report

1. **DO NOT** open a public GitHub issue for security vulnerabilities.
2. Email **concepcion.fam@gmail.com** with:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Acknowledgment** within 48 hours
- **Assessment** within 5 business days
- **Fix timeline** communicated after assessment
- **Credit** in release notes (unless you prefer anonymity)

### Scope

The following are in scope:
- Authentication bypass or API key leakage
- Remote code execution via MCP tool inputs
- Privilege escalation on UniFi console
- SSRF or injection through tool parameters
- Sensitive data exposure in logs or error messages

### Out of Scope

- Vulnerabilities in UniFi OS itself (report to [Ubiquiti](https://hackerone.com/ubiquiti))
- Vulnerabilities in the MCP SDK (report to [Anthropic](https://github.com/modelcontextprotocol/sdk))
- Issues requiring physical access to the network
