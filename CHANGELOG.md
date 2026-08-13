# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-08-04

### Added
- 🎉 Initial release
- 40 MCP tools for complete UniFi UDM Pro / UDM SE management
- **System & Subsystems**: `unifi_get_sysinfo`, `unifi_get_health`, `unifi_list_sites`, `unifi_list_events`, `unifi_list_alarms`, `unifi_run_speedtest`
- **Device Administration**: `unifi_list_devices`, `unifi_reboot_device`, `unifi_upgrade_device`, `unifi_locate_device`, `unifi_power_cycle_port`
- **Client Devices & Control**: `unifi_list_clients`, `unifi_get_all_clients_history`, `unifi_set_client_name`, `unifi_set_client_fixed_ip`, `unifi_set_client_usergroup`, `unifi_block_client`, `unifi_unblock_client`, `unifi_reconnect_client`, `unifi_forget_client`
- **Wi-Fi / WLAN (Full CRUD)**: `unifi_list_wlans`, `unifi_create_wlan`, `unifi_update_wlan`, `unifi_delete_wlan`, `unifi_set_wlan_password`, `unifi_set_wlan_status`
- **Networks & VLANs (Full CRUD)**: `unifi_list_networks`, `unifi_create_network`, `unifi_update_network`, `unifi_delete_network`
- **Firewall & Security (Full CRUD)**: `unifi_list_firewall_rules`, `unifi_create_firewall_rule`, `unifi_delete_firewall_rule`, `unifi_list_firewall_groups`, `unifi_create_firewall_group`
- **Port Forwarding (Full CRUD)**: `unifi_list_port_forwards`, `unifi_create_port_forward`, `unifi_delete_port_forward`
- **Hotspot & QoS**: `unifi_list_vouchers`, `unifi_create_voucher`, `unifi_revoke_voucher`, `unifi_list_user_groups`, `unifi_create_user_group`
- Native UniFi Local API Key authentication (`X-API-KEY`)
- Docker support with `node:22-alpine`
- CI/CD with GitHub Actions
- Dependabot for automated dependency updates
