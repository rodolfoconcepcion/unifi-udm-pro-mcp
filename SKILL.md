---
name: unifi-udm-pro-mcp
description: UniFi UDM Pro MCP Server for managing networks, connected clients, Wi-Fi settings, and device health via Model Context Protocol.
---

# UniFi UDM Pro MCP Server

Model Context Protocol (MCP) server to connect AI assistants with UniFi UDM Pro, UDM SE, Dream Wall, and UniFi OS Network Controllers.

## Features

- **Device Management**: List devices, view health metrics, reboot devices.
- **Client Management**: List active clients, block/unblock devices, authorize guest access.
- **Network & Wi-Fi**: Inspect VLANs, list SSIDs, toggle WLAN networks.

## MCP Configuration

Add this to your MCP settings file (e.g., `cline_mcp_settings.json` or `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "unifi-udm-pro": {
      "command": "npx",
      "args": ["-y", "unifi-udm-pro-mcp"],
      "env": {
        "UNIFI_IP": "your-unifi-controller-ip",
        "UNIFI_API_KEY": "your-unifi-api-key"
      }
    }
  }
}
```

## Usage with Skills CLI

Install via Skills CLI:

```bash
npx skills add rodolfoconcepcion/unifi-udm-pro-mcp
```
