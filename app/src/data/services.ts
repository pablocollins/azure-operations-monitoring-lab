export type Service = {
  name: string;
  status: "Healthy" | "Degraded";
  detail: string;
};

export const services: Service[] = [
  {
    name: "Compute",
    status: "Healthy",
    detail: "2 workloads online",
  },
  {
    name: "Network",
    status: "Healthy",
    detail: "VNet + NSG operational",
  },
  {
    name: "Monitoring",
    status: "Healthy",
    detail: "Telemetry flowing",
  },
  {
    name: "Backup",
    status: "Healthy",
    detail: "100% compliant",
  },
];

export const resources = [
  {
    name: "vm-win-ops-01",
    type: "Windows Server",
    address: "10.10.1.20",
  },
  {
    name: "vm-linux-app-01",
    type: "Linux",
    address: "10.10.1.10",
  },
  {
    name: "vnet-ops-lab",
    type: "Virtual Network",
    address: "10.10.0.0/16",
  },
  {
    name: "Log Analytics",
    type: "Monitoring",
    address: "Workspace",
  },
  {
    name: "Recovery Services Vault",
    type: "Backup & Recovery",
    address: "Vault",
  },
];