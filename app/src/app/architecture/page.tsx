export default function ArchitecturePage() {
  return (
    <section className="px-6 py-8 lg:px-10">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">
          Architecture
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Azure Environment Architecture
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
          Logical architecture of the simulated Azure operations environment,
          including identity, networking, workloads, monitoring and recovery.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        {/* Main architecture canvas */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">
                Logical Topology
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Azure subscription: ops-lab-subscription
              </p>
            </div>

            <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-400">
              Simulation Mode
            </span>
          </div>

          <div className="space-y-8">
            {/* Identity */}
            <ArchitectureGroup
              title="Identity & Access"
              subtitle="Microsoft Entra ID and Azure RBAC"
            >
              <div className="grid gap-4 md:grid-cols-3">
                <Node
                  title="Microsoft Entra ID"
                  subtitle="Identity Provider"
                  type="identity"
                />

                <Connector label="RBAC" />

                <Node
                  title="Cloud Operations Team"
                  subtitle="Azure Operators"
                  type="team"
                />
              </div>
            </ArchitectureGroup>

            {/* Subscription */}
            <div className="rounded-2xl border border-slate-700 bg-slate-950/50 p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Azure Subscription
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Resource Group: rg-ops-lab
                  </p>
                </div>

                <span className="text-xs text-slate-600">
                  West Europe
                </span>
              </div>

              <div className="space-y-6">
                {/* Network */}
                <ArchitectureGroup
                  title="Virtual Network"
                  subtitle="vnet-ops-lab · 10.10.0.0/16"
                >
                  <div className="grid gap-5 xl:grid-cols-2">
                    <Subnet
                      title="snet-servers"
                      cidr="10.10.1.0/24"
                    >
                      <Node
                        title="vm-win-ops-01"
                        subtitle="Windows Server · 10.10.1.20"
                        type="vm"
                      />

                      <Node
                        title="vm-linux-app-01"
                        subtitle="Linux · 10.10.1.10"
                        type="vm"
                      />
                    </Subnet>

                    <Subnet
                      title="snet-management"
                      cidr="10.10.2.0/24"
                    >
                      <Node
                        title="Management Plane"
                        subtitle="Administrative access"
                        type="management"
                      />

                      <Node
                        title="Network Security Group"
                        subtitle="NSG rule enforcement"
                        type="network"
                      />
                    </Subnet>
                  </div>
                </ArchitectureGroup>

                {/* Monitoring */}
                <ArchitectureGroup
                  title="Observability"
                  subtitle="Monitoring and telemetry pipeline"
                >
                  <div className="grid gap-4 md:grid-cols-4">
                    <Node
                      title="Azure Monitor"
                      subtitle="Metrics & health"
                      type="monitor"
                    />

                    <Node
                      title="Log Analytics"
                      subtitle="Centralized logs"
                      type="monitor"
                    />

                    <Node
                      title="KQL"
                      subtitle="Query & investigation"
                      type="monitor"
                    />

                    <Node
                      title="Alert Rules"
                      subtitle="Incident detection"
                      type="alert"
                    />
                  </div>

                  <FlowLine
                    labels={[
                      "Metrics",
                      "Logs",
                      "Queries",
                      "Alerts",
                    ]}
                  />
                </ArchitectureGroup>

                {/* Recovery */}
                <ArchitectureGroup
                  title="Backup & Recovery"
                  subtitle="Recovery Services"
                >
                  <div className="grid gap-4 md:grid-cols-3">
                    <Node
                      title="Azure Backup"
                      subtitle="Backup orchestration"
                      type="backup"
                    />

                    <Connector label="Recovery" />

                    <Node
                      title="Recovery Services Vault"
                      subtitle="Recovery points"
                      type="backup"
                    />
                  </div>
                </ArchitectureGroup>
              </div>
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div className="space-y-6">
          <InfoPanel
            title="Environment Summary"
            items={[
              ["Resource Group", "rg-ops-lab"],
              ["VNet", "10.10.0.0/16"],
              ["Workloads", "2 VMs"],
              ["Subnets", "2"],
              ["Region", "West Europe"],
            ]}
          />

          <InfoPanel
            title="Security Model"
            items={[
              ["Identity", "Microsoft Entra ID"],
              ["Authorization", "Azure RBAC"],
              ["Network Policy", "NSG"],
              ["Principle", "Least privilege"],
            ]}
          />

          <InfoPanel
            title="Operations Stack"
            items={[
              ["Monitoring", "Azure Monitor"],
              ["Logs", "Log Analytics"],
              ["Queries", "KQL"],
              ["Automation", "PowerShell / CLI"],
              ["Recovery", "Azure Backup"],
            ]}
          />

          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">
              Operational Principle
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              Collect evidence before remediation and validate service
              recovery after every change.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArchitectureGroup({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
      <div className="mb-5">
        <p className="text-sm font-semibold">
          {title}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {subtitle}
        </p>
      </div>

      {children}
    </div>
  );
}

function Subnet({
  title,
  cidr,
  children,
}: {
  title: string;
  cidr: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-cyan-300">
            {title}
          </p>

          <p className="mt-1 font-mono text-xs text-slate-500">
            {cidr}
          </p>
        </div>

        <span className="text-[10px] uppercase tracking-wider text-slate-600">
          Subnet
        </span>
      </div>

      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}

function Node({
  title,
  subtitle,
  type,
}: {
  title: string;
  subtitle: string;
  type:
    | "identity"
    | "team"
    | "vm"
    | "network"
    | "monitor"
    | "alert"
    | "backup"
    | "management";
}) {
  const styles = {
    identity:
      "border-violet-500/20 bg-violet-500/5",
    team:
      "border-blue-500/20 bg-blue-500/5",
    vm:
      "border-emerald-500/20 bg-emerald-500/5",
    network:
      "border-cyan-500/20 bg-cyan-500/5",
    monitor:
      "border-sky-500/20 bg-sky-500/5",
    alert:
      "border-amber-500/20 bg-amber-500/5",
    backup:
      "border-teal-500/20 bg-teal-500/5",
    management:
      "border-slate-600 bg-slate-800/40",
  };

  return (
    <div
      className={`rounded-xl border p-4 ${styles[type]}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 h-2.5 w-2.5 rounded-full bg-current opacity-80" />

        <div>
          <p className="text-sm font-medium text-white">
            {title}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

function Connector({
  label,
}: {
  label: string;
}) {
  return (
    <div className="flex items-center justify-center">
      <div className="flex w-full items-center gap-3">
        <div className="h-px flex-1 bg-slate-700" />

        <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-[10px] uppercase tracking-wider text-slate-500">
          {label}
        </span>

        <div className="h-px flex-1 bg-slate-700" />
      </div>
    </div>
  );
}

function FlowLine({
  labels,
}: {
  labels: string[];
}) {
  return (
    <div className="mt-5 hidden items-center md:flex">
      {labels.map((label, index) => (
        <div
          key={label}
          className="flex flex-1 items-center"
        >
          <span className="text-[10px] uppercase tracking-wider text-slate-600">
            {label}
          </span>

          {index !== labels.length - 1 && (
            <div className="mx-3 h-px flex-1 bg-slate-800" />
          )}
        </div>
      ))}
    </div>
  );
}

function InfoPanel({
  title,
  items,
}: {
  title: string;
  items: [string, string][];
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <p className="text-sm font-semibold">
        {title}
      </p>

      <div className="mt-4 space-y-3">
        {items.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between gap-4 border-b border-slate-800/70 pb-3 last:border-b-0 last:pb-0"
          >
            <span className="text-xs text-slate-500">
              {label}
            </span>

            <span className="text-right text-xs font-medium text-slate-300">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}