#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import https from "https";

const UNIFI_HOST = process.env.UNIFI_HOST || "https://YOUR_UNIFI_HOST_IP";
const UNIFI_API_KEY = process.env.UNIFI_API_KEY || "";

const agent = new https.Agent({ rejectUnauthorized: false });

async function unifiApiRequest(endpoint, method = "GET", body = null) {
  const url = `${UNIFI_HOST}/proxy/network/api/s/default${endpoint}`;
  
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method,
      agent,
      headers: {
        "X-API-KEY": UNIFI_API_KEY,
        "Content-Type": "application/json"
      }
    }, (res) => {
      let data = "";
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed.data || parsed);
        } catch (e) {
          resolve(data);
        }
      });
    });

    req.on("error", (err) => reject(err));
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

const server = new Server(
  { name: "unifi-udm-pro-mcp", version: "5.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      // --- SYSTEM & SITES ---
      { name: "unifi_list_sites", description: "List all sites managed on this UniFi controller.", inputSchema: { type: "object", properties: {} } },
      { name: "unifi_get_sysinfo", description: "Get UniFi UDM Pro console system info, OS version, controller build, timezone, and uptime.", inputSchema: { type: "object", properties: {} } },
      { name: "unifi_get_health", description: "Get health status of UniFi UDM Pro network subsystems (WAN, LAN, WLAN, VPN, ISP speed & CPU/Memory usage).", inputSchema: { type: "object", properties: {} } },
      { name: "unifi_list_events", description: "Fetch recent network events, client connects/disconnects, and security alerts.", inputSchema: { type: "object", properties: { limit: { type: "number" } } } },
      { name: "unifi_list_alarms", description: "List active network security alarms and system alerts.", inputSchema: { type: "object", properties: {} } },
      { name: "unifi_run_speedtest", description: "Trigger a WAN speedtest directly on the UDM Pro gateway.", inputSchema: { type: "object", properties: {} } },

      // --- DEVICES ---
      { name: "unifi_list_devices", description: "List all UniFi access points, switches, gateways, uptime, IP addresses, and adoption status.", inputSchema: { type: "object", properties: {} } },
      { name: "unifi_reboot_device", description: "Restart/Reboot a UniFi device (Access Point, Switch, or Gateway) by MAC address.", inputSchema: { type: "object", properties: { mac: { type: "string" } }, required: ["mac"] } },
      { name: "unifi_upgrade_device", description: "Trigger firmware upgrade on a UniFi device by MAC address.", inputSchema: { type: "object", properties: { mac: { type: "string" } }, required: ["mac"] } },
      { name: "unifi_locate_device", description: "Flash the LED on a UniFi Access Point or Switch to locate it physically.", inputSchema: { type: "object", properties: { mac: { type: "string" }, enable: { type: "boolean" } }, required: ["mac", "enable"] } },
      { name: "unifi_power_cycle_port", description: "Power cycle (restart) a PoE switch port on a UniFi Switch by device MAC and port index.", inputSchema: { type: "object", properties: { mac: { type: "string" }, port_idx: { type: "number" } }, required: ["mac", "port_idx"] } },

      // --- CLIENT DEVICES ---
      { name: "unifi_list_clients", description: "List active connected client devices on the UniFi network (IP, MAC, hostname, signal, bandwidth, network).", inputSchema: { type: "object", properties: {} } },
      { name: "unifi_get_all_clients_history", description: "Fetch historical record of all client devices that have ever connected to the network.", inputSchema: { type: "object", properties: {} } },
      { name: "unifi_set_client_name", description: "Assign an alias or custom display name to a client device by MAC address.", inputSchema: { type: "object", properties: { mac: { type: "string" }, name: { type: "string" } }, required: ["mac", "name"] } },
      { name: "unifi_set_client_fixed_ip", description: "Assign a static/fixed IP address to a client device on the network.", inputSchema: { type: "object", properties: { mac: { type: "string" }, ip: { type: "string" }, use_fixed_ip: { type: "boolean" } }, required: ["mac", "ip", "use_fixed_ip"] } },
      { name: "unifi_block_client", description: "Block a client device on the network by MAC address.", inputSchema: { type: "object", properties: { mac: { type: "string" } }, required: ["mac"] } },
      { name: "unifi_unblock_client", description: "Unblock a previously blocked client device on the network by MAC address.", inputSchema: { type: "object", properties: { mac: { type: "string" } }, required: ["mac"] } },
      { name: "unifi_reconnect_client", description: "Force a client device to reconnect to the nearest access point by MAC address.", inputSchema: { type: "object", properties: { mac: { type: "string" } }, required: ["mac"] } },
      { name: "unifi_forget_client", description: "Forget/remove an offline client record from controller database by MAC address.", inputSchema: { type: "object", properties: { macs: { type: "array", items: { type: "string" } } }, required: ["macs"] } },
      { name: "unifi_set_client_usergroup", description: "Assign a bandwidth rate-limiting profile (User Group) to a client device.", inputSchema: { type: "object", properties: { user_id: { type: "string" }, usergroup_id: { type: "string" } }, required: ["user_id", "usergroup_id"] } },

      // --- WI-FI / WLAN ---
      { name: "unifi_list_wlans", description: "List all configured Wi-Fi SSIDs, passphrases, security modes, frequency bands, and enabled status.", inputSchema: { type: "object", properties: {} } },
      { name: "unifi_create_wlan", description: "Create a new Wi-Fi SSID network.", inputSchema: { type: "object", properties: { name: { type: "string" }, x_passphrase: { type: "string" }, enabled: { type: "boolean" }, is_guest: { type: "boolean" } }, required: ["name", "x_passphrase"] } },
      { name: "unifi_update_wlan", description: "Update configuration of an existing Wi-Fi network by WLAN ID.", inputSchema: { type: "object", properties: { wlan_id: { type: "string" }, name: { type: "string" }, x_passphrase: { type: "string" }, enabled: { type: "boolean" } }, required: ["wlan_id"] } },
      { name: "unifi_delete_wlan", description: "Delete a Wi-Fi SSID network by WLAN ID.", inputSchema: { type: "object", properties: { wlan_id: { type: "string" } }, required: ["wlan_id"] } },
      { name: "unifi_set_wlan_password", description: "Quickly update WPA passphrase for a Wi-Fi SSID network.", inputSchema: { type: "object", properties: { wlan_id: { type: "string" }, password: { type: "string" } }, required: ["wlan_id", "password"] } },
      { name: "unifi_set_wlan_status", description: "Enable or disable a Wi-Fi SSID network on demand.", inputSchema: { type: "object", properties: { wlan_id: { type: "string" }, enabled: { type: "boolean" } }, required: ["wlan_id", "enabled"] } },

      // --- NETWORKS / VLANS ---
      { name: "unifi_list_networks", description: "List all configured network subnets, VLANs, gateway IPs, DHCP ranges, and DNS settings.", inputSchema: { type: "object", properties: {} } },
      { name: "unifi_create_network", description: "Create a new network subnet / VLAN.", inputSchema: { type: "object", properties: { name: { type: "string" }, purpose: { type: "string" }, ip_subnet: { type: "string" }, vlan: { type: "number" } }, required: ["name", "ip_subnet"] } },
      { name: "unifi_update_network", description: "Update configuration of an existing network subnet / VLAN by ID.", inputSchema: { type: "object", properties: { network_id: { type: "string" }, name: { type: "string" }, ip_subnet: { type: "string" } }, required: ["network_id"] } },
      { name: "unifi_delete_network", description: "Delete a network subnet / VLAN by ID.", inputSchema: { type: "object", properties: { network_id: { type: "string" } }, required: ["network_id"] } },

      // --- FIREWALL RULES & GROUPS ---
      { name: "unifi_list_firewall_rules", description: "List configured firewall rules, rule numbers, action (accept/drop/reject), and interface bindings.", inputSchema: { type: "object", properties: {} } },
      { name: "unifi_create_firewall_rule", description: "Create a new firewall rule.", inputSchema: { type: "object", properties: { name: { type: "string" }, action: { type: "string" }, ruleset: { type: "string" }, src_address: { type: "string" }, dst_address: { type: "string" } }, required: ["name", "action", "ruleset"] } },
      { name: "unifi_delete_firewall_rule", description: "Delete a firewall rule by ID.", inputSchema: { type: "object", properties: { rule_id: { type: "string" } }, required: ["rule_id"] } },
      { name: "unifi_list_firewall_groups", description: "List configured firewall IP & port groups.", inputSchema: { type: "object", properties: {} } },
      { name: "unifi_create_firewall_group", description: "Create a new firewall IP or Port group.", inputSchema: { type: "object", properties: { name: { type: "string" }, group_type: { type: "string" }, group_members: { type: "array" } }, required: ["name", "group_type"] } },

      // --- PORT FORWARDS ---
      { name: "unifi_list_port_forwards", description: "List configured port forwarding rules (forwarded IP, external/internal ports, protocol).", inputSchema: { type: "object", properties: {} } },
      { name: "unifi_create_port_forward", description: "Create a new port forwarding rule.", inputSchema: { type: "object", properties: { name: { type: "string" }, fwd: { type: "string" }, fwd_port: { type: "string" }, dst_port: { type: "string" }, proto: { type: "string" } }, required: ["name", "fwd", "fwd_port", "dst_port"] } },
      { name: "unifi_delete_port_forward", description: "Delete a port forwarding rule by ID.", inputSchema: { type: "object", properties: { pfwd_id: { type: "string" } }, required: ["pfwd_id"] } },

      // --- VOUCHERS & USER GROUPS ---
      { name: "unifi_list_vouchers", description: "List active guest hotspot vouchers.", inputSchema: { type: "object", properties: {} } },
      { name: "unifi_create_voucher", description: "Create new guest hotspot Wi-Fi vouchers.", inputSchema: { type: "object", properties: { minutes: { type: "number" }, count: { type: "number" }, quota: { type: "number" } }, required: ["minutes"] } },
      { name: "unifi_revoke_voucher", description: "Revoke/Delete a guest hotspot voucher by ID.", inputSchema: { type: "object", properties: { voucher_id: { type: "string" } }, required: ["voucher_id"] } },
      { name: "unifi_list_user_groups", description: "List bandwidth rate-limiting user groups (QoS max upload / download speed).", inputSchema: { type: "object", properties: {} } },
      { name: "unifi_create_user_group", description: "Create a new bandwidth rate-limiting user group.", inputSchema: { type: "object", properties: { name: { type: "string" }, qos_rate_max_down: { type: "number" }, qos_rate_max_up: { type: "number" } }, required: ["name"] } }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "unifi_list_sites") {
      const url = `${UNIFI_HOST}/proxy/network/api/self/sites`;
      const req = await new Promise((res, rej) => {
        https.get(url, { agent, headers: { "X-API-KEY": UNIFI_API_KEY } }, r => {
          let d = ""; r.on("data", c => d += c); r.on("end", () => res(JSON.parse(d)));
        });
      });
      return { content: [{ type: "text", text: JSON.stringify(req.data || req, null, 2) }] };
    }

    if (name === "unifi_get_sysinfo") {
      const data = await unifiApiRequest("/stat/sysinfo");
      return { content: [{ type: "text", text: JSON.stringify(data[0] || data, null, 2) }] };
    }

    if (name === "unifi_get_health") {
      const data = await unifiApiRequest("/stat/health");
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }

    if (name === "unifi_list_events") {
      const limit = (args && args.limit) || 50;
      const data = await unifiApiRequest(`/stat/event?_limit=${limit}`);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }

    if (name === "unifi_list_alarms") {
      const data = await unifiApiRequest("/stat/alarm");
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }

    if (name === "unifi_run_speedtest") {
      await unifiApiRequest("/cmd/devmgr", "POST", { cmd: "speedtest" });
      return { content: [{ type: "text", text: "WAN Speedtest triggered on UDM Pro gateway." }] };
    }

    if (name === "unifi_list_devices") {
      const data = await unifiApiRequest("/stat/device");
      const summary = data.map(d => ({
        name: d.name || d.model,
        model: d.model,
        ip: d.ip || d.connect_request_ip,
        mac: d.mac,
        state: d.state === 1 ? "CONNECTED" : "DISCONNECTED",
        uptime: d.uptime,
        num_sta: d.num_sta || 0
      }));
      return { content: [{ type: "text", text: JSON.stringify(summary, null, 2) }] };
    }

    if (name === "unifi_reboot_device") {
      await unifiApiRequest("/cmd/devmgr", "POST", { cmd: "restart", mac: args.mac });
      return { content: [{ type: "text", text: `Restart command sent to UniFi device ${args.mac}.` }] };
    }

    if (name === "unifi_upgrade_device") {
      await unifiApiRequest("/cmd/devmgr", "POST", { cmd: "upgrade", mac: args.mac });
      return { content: [{ type: "text", text: `Firmware upgrade triggered for UniFi device ${args.mac}.` }] };
    }

    if (name === "unifi_locate_device") {
      const cmd = args.enable ? "set-locate" : "unset-locate";
      await unifiApiRequest("/cmd/devmgr", "POST", { cmd, mac: args.mac });
      return { content: [{ type: "text", text: `Locate LED command sent to device ${args.mac}.` }] };
    }

    if (name === "unifi_power_cycle_port") {
      await unifiApiRequest("/cmd/devmgr", "POST", { cmd: "power-cycle", mac: args.mac, port_idx: args.port_idx });
      return { content: [{ type: "text", text: `PoE port ${args.port_idx} on switch ${args.mac} power cycled.` }] };
    }

    if (name === "unifi_list_clients") {
      const data = await unifiApiRequest("/stat/sta");
      const summary = data.map(c => ({
        id: c._id,
        hostname: c.hostname || c.name || c.oui || "Unknown",
        ip: c.ip,
        mac: c.mac,
        is_wired: c.is_wired,
        network: c.network,
        signal: c.signal || null,
        rx_bytes: c.rx_bytes,
        tx_bytes: c.tx_bytes
      }));
      return { content: [{ type: "text", text: JSON.stringify(summary, null, 2) }] };
    }

    if (name === "unifi_get_all_clients_history") {
      const data = await unifiApiRequest("/stat/alluser");
      const summary = data.map(c => ({
        hostname: c.hostname || c.name || c.oui || "Unknown",
        mac: c.mac,
        last_ip: c.last_ip,
        is_wired: c.is_wired,
        last_seen: c.last_seen,
        last_ap: c.last_uplink_name
      }));
      return { content: [{ type: "text", text: JSON.stringify(summary, null, 2) }] };
    }

    if (name === "unifi_set_client_name") {
      await unifiApiRequest(`/upd/user/${args.mac}`, "PUT", { name: args.name });
      return { content: [{ type: "text", text: `Client ${args.mac} renamed to "${args.name}".` }] };
    }

    if (name === "unifi_set_client_fixed_ip") {
      await unifiApiRequest(`/upd/user/${args.mac}`, "PUT", { use_fixedip: args.use_fixed_ip, fixed_ip: args.ip });
      return { content: [{ type: "text", text: `Fixed IP ${args.ip} assigned to client ${args.mac}.` }] };
    }

    if (name === "unifi_block_client") {
      await unifiApiRequest("/cmd/stamgr", "POST", { cmd: "block-sta", mac: args.mac });
      return { content: [{ type: "text", text: `Client ${args.mac} blocked successfully.` }] };
    }

    if (name === "unifi_unblock_client") {
      await unifiApiRequest("/cmd/stamgr", "POST", { cmd: "unblock-sta", mac: args.mac });
      return { content: [{ type: "text", text: `Client ${args.mac} unblocked successfully.` }] };
    }

    if (name === "unifi_reconnect_client") {
      await unifiApiRequest("/cmd/stamgr", "POST", { cmd: "reconnect-sta", mac: args.mac });
      return { content: [{ type: "text", text: `Client ${args.mac} reconnected successfully.` }] };
    }

    if (name === "unifi_forget_client") {
      await unifiApiRequest("/cmd/stamgr", "POST", { cmd: "forget-sta", macs: args.macs });
      return { content: [{ type: "text", text: `Forgotten clients: ${args.macs.join(", ")}.` }] };
    }

    if (name === "unifi_set_client_usergroup") {
      await unifiApiRequest(`/upd/user/${args.user_id}`, "PUT", { usergroup_id: args.usergroup_id });
      return { content: [{ type: "text", text: `Client usergroup updated to ${args.usergroup_id}.` }] };
    }

    if (name === "unifi_list_wlans") {
      const data = await unifiApiRequest("/rest/wlanconf");
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }

    if (name === "unifi_create_wlan") {
      const res = await unifiApiRequest("/rest/wlanconf", "POST", { name: args.name, x_passphrase: args.x_passphrase, enabled: args.enabled ?? true, is_guest: args.is_guest ?? false });
      return { content: [{ type: "text", text: JSON.stringify(res, null, 2) }] };
    }

    if (name === "unifi_update_wlan") {
      const res = await unifiApiRequest(`/rest/wlanconf/${args.wlan_id}`, "PUT", args);
      return { content: [{ type: "text", text: JSON.stringify(res, null, 2) }] };
    }

    if (name === "unifi_delete_wlan") {
      await unifiApiRequest(`/rest/wlanconf/${args.wlan_id}`, "DELETE");
      return { content: [{ type: "text", text: `WLAN ${args.wlan_id} deleted successfully.` }] };
    }

    if (name === "unifi_set_wlan_password") {
      await unifiApiRequest(`/rest/wlanconf/${args.wlan_id}`, "PUT", { x_passphrase: args.password });
      return { content: [{ type: "text", text: `WLAN ${args.wlan_id} password updated.` }] };
    }

    if (name === "unifi_set_wlan_status") {
      await unifiApiRequest(`/rest/wlanconf/${args.wlan_id}`, "PUT", { enabled: args.enabled });
      return { content: [{ type: "text", text: `WLAN ${args.wlan_id} enabled: ${args.enabled}.` }] };
    }

    if (name === "unifi_list_networks") {
      const data = await unifiApiRequest("/rest/networkconf");
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }

    if (name === "unifi_create_network") {
      const res = await unifiApiRequest("/rest/networkconf", "POST", { name: args.name, purpose: args.purpose || "corporate", ip_subnet: args.ip_subnet, vlan: args.vlan });
      return { content: [{ type: "text", text: JSON.stringify(res, null, 2) }] };
    }

    if (name === "unifi_update_network") {
      const res = await unifiApiRequest(`/rest/networkconf/${args.network_id}`, "PUT", args);
      return { content: [{ type: "text", text: JSON.stringify(res, null, 2) }] };
    }

    if (name === "unifi_delete_network") {
      await unifiApiRequest(`/rest/networkconf/${args.network_id}`, "DELETE");
      return { content: [{ type: "text", text: `Network ${args.network_id} deleted.` }] };
    }

    if (name === "unifi_list_firewall_rules") {
      const data = await unifiApiRequest("/rest/firewallrule");
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }

    if (name === "unifi_create_firewall_rule") {
      const res = await unifiApiRequest("/rest/firewallrule", "POST", args);
      return { content: [{ type: "text", text: JSON.stringify(res, null, 2) }] };
    }

    if (name === "unifi_delete_firewall_rule") {
      await unifiApiRequest(`/rest/firewallrule/${args.rule_id}`, "DELETE");
      return { content: [{ type: "text", text: `Firewall rule ${args.rule_id} deleted.` }] };
    }

    if (name === "unifi_list_firewall_groups") {
      const data = await unifiApiRequest("/rest/firewallgroup");
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }

    if (name === "unifi_create_firewall_group") {
      const res = await unifiApiRequest("/rest/firewallgroup", "POST", args);
      return { content: [{ type: "text", text: JSON.stringify(res, null, 2) }] };
    }

    if (name === "unifi_list_port_forwards") {
      const data = await unifiApiRequest("/rest/portforward");
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }

    if (name === "unifi_create_port_forward") {
      const res = await unifiApiRequest("/rest/portforward", "POST", args);
      return { content: [{ type: "text", text: JSON.stringify(res, null, 2) }] };
    }

    if (name === "unifi_delete_port_forward") {
      await unifiApiRequest(`/rest/portforward/${args.pfwd_id}`, "DELETE");
      return { content: [{ type: "text", text: `Port forward ${args.pfwd_id} deleted.` }] };
    }

    if (name === "unifi_list_vouchers") {
      const data = await unifiApiRequest("/stat/voucher");
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }

    if (name === "unifi_create_voucher") {
      const res = await unifiApiRequest("/cmd/stat", "POST", { cmd: "create-voucher", minutes: args.minutes, count: args.count || 1, quota: args.quota || 0 });
      return { content: [{ type: "text", text: JSON.stringify(res, null, 2) }] };
    }

    if (name === "unifi_revoke_voucher") {
      await unifiApiRequest("/cmd/stat", "POST", { cmd: "revoke-voucher", _id: args.voucher_id });
      return { content: [{ type: "text", text: `Voucher ${args.voucher_id} revoked.` }] };
    }

    if (name === "unifi_list_user_groups") {
      const data = await unifiApiRequest("/rest/usergroup");
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }

    if (name === "unifi_create_user_group") {
      const res = await unifiApiRequest("/rest/usergroup", "POST", { name: args.name, qos_rate_max_down: args.qos_rate_max_down || -1, qos_rate_max_up: args.qos_rate_max_up || -1 });
      return { content: [{ type: "text", text: JSON.stringify(res, null, 2) }] };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (err) {
    return { content: [{ type: "text", text: `Error: ${err.message}` }], isError: true };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(err => {
  console.error("Fatal error starting UniFi MCP server:", err);
  process.exit(1);
});
