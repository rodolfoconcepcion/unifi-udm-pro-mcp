# Contributing to UniFi UDM Pro MCP Server

Thank you for your interest in contributing! This MCP server controls real network infrastructure, so quality and security are paramount.

## Getting Started

1. **Fork** the repository
2. **Clone** your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/unifi-udm-pro-mcp.git
   cd unifi-udm-pro-mcp
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Validate** your changes:
   ```bash
   node --check index.js
   ```

## Development Requirements

- **Node.js 20+** (22 recommended)
- A **UniFi Dream Machine** (UDM Pro, UDM SE, or UCG Ultra) for testing
- A **Local API Key** from your UniFi console

## Adding a New MCP Tool

1. Add the tool definition in `index.js` under the `ListToolsRequestSchema` handler
2. Add the tool handler in the `CallToolRequestSchema` handler
3. Update the **README.md** tool list
4. Test against a real UniFi console

### Tool Naming Convention

All tools must follow the pattern: `unifi_<verb>_<resource>`

Examples: `unifi_list_clients`, `unifi_create_wlan`, `unifi_delete_firewall_rule`

## Security Guidelines

- **NEVER** commit API keys, passwords, or local IP addresses
- **NEVER** log sensitive data (API keys, passwords)
- **ALWAYS** validate and sanitize tool input parameters
- **ALWAYS** use `UNIFI_HOST` and `UNIFI_API_KEY` environment variables

## Commit Messages

Use clear, descriptive commit messages:
- `feat: add unifi_list_vpn_clients tool`
- `fix: handle 401 response on expired API key`
- `docs: update README with new tool descriptions`
- `ci: add Node.js 22 to test matrix`

## Pull Request Process

1. Ensure `node --check index.js` passes
2. Test against a real UniFi console if possible
3. Update README.md if adding/changing tools
4. Fill out the PR template completely
5. Wait for review from a maintainer

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.
