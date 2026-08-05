# UniFi UDM Pro MCP Server (`unifi-udm-pro-mcp`)

[![CI](https://github.com/rodolfoconcepcion/unifi-udm-pro-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/rodolfoconcepcion/unifi-udm-pro-mcp/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/unifi-udm-pro-mcp.svg)](https://www.npmjs.com/package/unifi-udm-pro-mcp)
[![unifi-udm-pro-mcp MCP server](https://glama.ai/mcp/servers/rodolfoconcepcion/unifi-udm-pro-mcp/badge)](https://glama.ai/mcp/servers/rodolfoconcepcion/unifi-udm-pro-mcp)
[![Smithery](https://smithery.ai/badge/unifi-udm-pro-mcp)](https://smithery.ai/server/unifi-udm-pro-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP Protocol](https://img.shields.io/badge/MCP-v1.0.0-blue.svg)](https://modelcontextprotocol.io)
[![Node.js](https://img.shields.io/badge/Node.js-%E2%89%A520-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![GitHub stars](https://img.shields.io/github/stars/rodolfoconcepcion/unifi-udm-pro-mcp?style=social)](https://github.com/rodolfoconcepcion/unifi-udm-pro-mcp)

A high-performance, native **Model Context Protocol (MCP)** server for Ubiquiti **UniFi Dream Machine (UDM / UDM Pro / UDM SE)** and UniFi OS Cloud Gateways. 

Unlike legacy UniFi MCP implementations that rely on cloud session cookies, username/passwords, or 2FA tokens, this MCP server connects **directly to your local UDM Pro REST API using native Local API Keys (`X-API-KEY`)**.

---

## Key Features

* **⚡ Ultra-Low Latency (10–30ms)**: Direct local LAN communication over HTTPS (`https://192.168.1.1`).
* **🔐 100% 2FA-Bypass & Continuous Uptime**: Uses native UniFi API Keys. Sessions never expire or prompt for 2FA.
* **🛠️ 40 Comprehensive Tools**: Complete CRUD (Create, Read, Update, Delete) coverage across Wi-Fi, VLANs, Firewall, Port Forwarding, Switch Ports, Guest Vouchers, QoS, and Devices.
* **🔏 Safe SSL Handling**: Natively handles local self-signed SSL certificates without extra environment hacks.
* **🔒 Privacy-First**: 100% local execution. No cloud proxies or external data telemetry.

---

## Available MCP Tools (40 Tools)

### 1. System & Subsystems
* `unifi_get_sysinfo` - UDM Pro console OS version, build, timezone, uptime.
* `unifi_get_health` - Subsystem health (WAN 1/2, LAN, WLAN, VPN, ISP speed, CPU/RAM).
* `unifi_list_sites` - List all sites managed by controller.
* `unifi_list_events` - Recent network events and security logs.
* `unifi_list_alarms` - Active security alarms.
* `unifi_run_speedtest` - Trigger WAN speed test on UDM Pro gateway.

### 2. Device Administration
* `unifi_list_devices` - Inventory of access points, switches, gateways, IP, MAC, status.
* `unifi_reboot_device` - Restart AP, Switch, or Gateway by MAC address.
* `unifi_upgrade_device` - Trigger firmware upgrade by MAC address.
* `unifi_locate_device` - Flash physical locator LED on AP or Switch.
* `unifi_power_cycle_port` - Power cycle PoE switch port by MAC and port index.

### 3. Client Devices & Control
* `unifi_list_clients` - Real-time active clients, IP/MAC, signal, rx/tx bandwidth.
* `unifi_get_all_clients_history` - Historical record of all clients ever connected (100+ devices).
* `unifi_set_client_name` - Assign custom alias name to client device.
* `unifi_set_client_fixed_ip` - Assign static/fixed IP to client device.
* `unifi_set_client_usergroup` - Assign QoS bandwidth limit profile to client.
* `unifi_block_client` - Block client by MAC address.
* `unifi_unblock_client` - Unblock client by MAC address.
* `unifi_reconnect_client` - Force client to reconnect to nearest AP.
* `unifi_forget_client` - Remove offline client record from database.

### 4. Wi-Fi / WLAN (Full CRUD)
* `unifi_list_wlans` - List SSIDs, WPA passphrases, bands, enabled status.
* `unifi_create_wlan` - Create new Wi-Fi network.
* `unifi_update_wlan` - Update Wi-Fi settings.
* `unifi_delete_wlan` - Delete Wi-Fi network.
* `unifi_set_wlan_password` - Instantly change WPA passphrase for SSID.
* `unifi_set_wlan_status` - Enable or disable Wi-Fi network on demand.

### 5. Networks & VLANs (Full CRUD)
* `unifi_list_networks` - List subnets, VLANs, gateway IPs, DHCP ranges.
* `unifi_create_network` - Create new network subnet / VLAN.
* `unifi_update_network` - Update subnet settings.
* `unifi_delete_network` - Delete subnet / VLAN.

### 6. Firewall & Security (Full CRUD)
* `unifi_list_firewall_rules` - List active firewall rules.
* `unifi_create_firewall_rule` - Create firewall rule (accept/drop/reject).
* `unifi_delete_firewall_rule` - Delete firewall rule by ID.
* `unifi_list_firewall_groups` - List IP & Port groups.
* `unifi_create_firewall_group` - Create IP or Port group.

### 7. Port Forwarding (Full CRUD)
* `unifi_list_port_forwards` - List port forwarding rules.
* `unifi_create_port_forward` - Create port forward rule (WAN -> LAN).
* `unifi_delete_port_forward` - Delete port forward rule.

### 8. Hotspot & QoS
* `unifi_list_vouchers` - List active guest hotspot vouchers.
* `unifi_create_voucher` - Create new guest vouchers by duration/count.
* `unifi_revoke_voucher` - Revoke guest voucher.
* `unifi_list_user_groups` - List bandwidth limit profiles.
* `unifi_create_user_group` - Create bandwidth limit profile (QoS max up/down).

---

## Quick Start

### Option 1: npx (Recommended)

No installation needed:

```bash
UNIFI_HOST=https://YOUR_UNIFI_HOST_IP UNIFI_API_KEY=your_key npx unifi-udm-pro-mcp
```

### Option 2: Docker

```bash
docker run -e UNIFI_HOST=https://YOUR_UNIFI_HOST_IP -e UNIFI_API_KEY=your_key ghcr.io/rodolfoconcepcion/unifi-udm-pro-mcp
```

### Option 3: Manual Install

```bash
git clone https://github.com/rodolfoconcepcion/unifi-udm-pro-mcp.git
cd unifi-udm-pro-mcp
npm install
UNIFI_HOST=https://YOUR_UNIFI_HOST_IP UNIFI_API_KEY=your_key node index.js
```

---

## Configuration

> [!NOTE]
> `UNIFI_HOST` must include the `https://` protocol prefix (e.g., `https://192.168.0.1`). UniFi OS requires HTTPS for local REST API access. Self-signed SSL/TLS certificates on local console IPs are handled automatically.

### Claude Desktop / Antigravity

Add to `claude_desktop_config.json` or Antigravity MCP settings:

```json
{
  "mcpServers": {
    "unifi-udm-pro": {
      "command": "npx",
      "args": ["-y", "unifi-udm-pro-mcp"],
      "env": {
        "UNIFI_HOST": "https://YOUR_UNIFI_HOST_IP",
        "UNIFI_API_KEY": "YOUR_UNIFI_LOCAL_API_KEY"
      }
    }
  }
}
```

### VS Code (GitHub Copilot)

Add to your project's `.vscode/mcp.json` or user settings:

```json
{
  "servers": {
    "unifi-udm-pro": {
      "command": "npx",
      "args": ["-y", "unifi-udm-pro-mcp"],
      "env": {
        "UNIFI_HOST": "https://YOUR_UNIFI_HOST_IP",
        "UNIFI_API_KEY": "YOUR_UNIFI_LOCAL_API_KEY"
      }
    }
  }
}
```

### Cursor / Windsurf

Add to your MCP settings (Settings → MCP Servers):

```json
{
  "mcpServers": {
    "unifi-udm-pro": {
      "command": "npx",
      "args": ["-y", "unifi-udm-pro-mcp"],
      "env": {
        "UNIFI_HOST": "https://YOUR_UNIFI_HOST_IP",
        "UNIFI_API_KEY": "YOUR_UNIFI_LOCAL_API_KEY"
      }
    }
  }
}
```

---

## How to Obtain a UniFi API Key

1. Log into your UniFi OS Console (e.g., `https://YOUR_UNIFI_HOST_IP` or your UDM IP).
2. Click **Console Settings** (gear icon in bottom left) → **System** → **Integrations** (or **Integrations** tab).
3. Under **API Key**, click **Create New API Key**.
4. Copy and save the generated key immediately (it is only displayed once).

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Security

See [SECURITY.md](.github/SECURITY.md) for vulnerability reporting.

## License

MIT License - See [LICENSE](LICENSE) for details.
