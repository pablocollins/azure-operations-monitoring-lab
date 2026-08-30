import Link from "next/link";

const services = [
  { name: "Compute", status: "Healthy", detail: "2 workloads online" },
  { name: "Network", status: "Healthy", detail: "VNet + NSG operational" },
  { name: "Monitoring", status: "Healthy", detail: "Telemetry flowing" },
  { name: "Backup", status: "Healthy", detail: "100% compliant" },
];

const incidents = [
  {
    id: "INC-001",
    title: "RBAC Access Denied",
    area: "Identity",
    severity: "SEV-3",
  },
  {
    id: "INC-002",
    title: "TCP/443 Connectivity Failure",
    area: "Network",
    severity: "SEV-2",
  },
  {
    id: "INC-003",
    title: "Monitoring Alert Failure",
    area: "Monitoring",
    severity: "SEV-3",
  },
];

export default function Home() {
  return (
    <section className="px-6 py-8 lg:px-10">
      {/* Hero */}
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/20 p-8 lg:p-10">
        <div className="flex flex-col justify-between gap-8 xl:flex-row xl:items-center">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-400">
                Azure Operations
              </span>

              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                ● Environment Healthy
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
              Cloud Operations
              <span className="block text-cyan-400">
                Control Center
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
              Interactive Azure operations lab focused on monitoring,
              troubleshooting, incident response, automation and recovery.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/simulator"
                className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Launch Incident Simulator
              </Link>

              <Link
                href="/incidents"
                className="rounded-xl border border-slate-700 bg-slate-950/70 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-600 hover:text-white"
              >
                Explore Incident Portfolio
              </Link>
            </div>
          </div>

          <div className="grid min-w-[280px] grid-cols-2 gap-3">
            <HeroStat
              label="Scenarios"
              value="4"
            />

            <HeroStat
              label="Workloads"
              value="2"
            />

            <HeroStat
              label="Recovery"
              value="100%"
            />

            <HeroStat
              label="Mode"
              value="Sim"
            />
          </div>
        </div>
      </div>

      {/* Main Metrics */}
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Environment"
          value="Healthy"
          helper="All operational domains nominal"
          accent="text-emerald-400"
        />

        <MetricCard
          label="Active Incidents"
          value="0"
          helper="No unresolved events"
        />

        <MetricCard
          label="Operational Readiness"
          value="96%"
          helper="Monitoring + recovery coverage"
          accent="text-cyan-400"
        />

        <MetricCard
          label="Simulated MTTR"
          value="8m 04s"
          helper="Average incident resolution"
          accent="text-cyan-400"
        />
      </div>

      {/* Main Grid */}
      <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_1fr_1fr]">
        {/* Service health */}
        <Panel
          title="Service Health"
          subtitle="Current Azure operational state"
        >
          <div className="space-y-3">
            {services.map((service) => (
              <div
                key={service.name}
                className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {service.name}
                  </span>

                  <span className="text-xs text-emerald-400">
                    ● {service.status}
                  </span>
                </div>

                <p className="mt-2 text-xs text-slate-600">
                  {service.detail}
                </p>
              </div>
            ))}
          </div>
        </Panel>

        {/* Environment */}
        <Panel
          title="Environment"
          subtitle="Operational topology"
        >
          <div className="space-y-4">
            <Resource
              name="vm-win-ops-01"
              type="Windows Server"
            />

            <Resource
              name="vm-linux-app-01"
              type="Linux"
            />

            <Resource
              name="vnet-ops-lab"
              type="10.10.0.0/16"
            />

            <Resource
              name="Log Analytics"
              type="Monitoring"
            />

            <Resource
              name="Recovery Services Vault"
              type="Backup & Recovery"
            />
          </div>

          <Link
            href="/architecture"
            className="mt-6 inline-block text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
          >
            View architecture →
          </Link>
        </Panel>

        {/* Readiness */}
        <Panel
          title="Operational Readiness"
          subtitle="Portfolio capability coverage"
        >
          <ReadinessBar
            label="Identity & RBAC"
            value={92}
          />

          <ReadinessBar
            label="Networking"
            value={98}
          />

          <ReadinessBar
            label="Monitoring"
            value={95}
          />

          <ReadinessBar
            label="Backup & Recovery"
            value={96}
          />

          <ReadinessBar
            label="Automation"
            value={90}
          />
        </Panel>
      </div>

      {/* Incident summary */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Panel
          title="Incident Portfolio"
          subtitle="Recent production-style investigations"
        >
          <div className="grid gap-4 md:grid-cols-3">
            {incidents.map((incident) => (
              <Link
                key={incident.id}
                href={`/incidents/${incident.id.toLowerCase()}`}
                className="group rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-cyan-500/30 hover:bg-cyan-500/5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-cyan-400">
                    {incident.id}
                  </span>

                  <span className="text-[10px] text-slate-600">
                    {incident.severity}
                  </span>
                </div>

                <p className="mt-3 text-sm font-medium text-slate-200 transition group-hover:text-white">
                  {incident.title}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-slate-600">
                    {incident.area}
                  </span>

                  <span className="text-xs text-emerald-400">
                    Resolved
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <Link
            href="/incidents"
            className="mt-5 inline-block text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
          >
            View all incidents →
          </Link>
        </Panel>

        {/* Live Activity */}
        <Panel
          title="Operational Activity"
          subtitle="Latest simulated events"
        >
          <div className="space-y-4 font-mono text-xs">
            <Activity
              time="01:48:14"
              text="Heartbeat received from vm-win-ops-01"
            />

            <Activity
              time="01:48:18"
              text="Heartbeat received from vm-linux-app-01"
            />

            <Activity
              time="01:48:31"
              text="Backup compliance validation completed"
            />

            <Activity
              time="01:48:42"
              text="Azure Monitor health evaluation passed"
            />

            <Activity
              time="01:49:02"
              text="Environment status: HEALTHY"
            />
          </div>
        </Panel>
      </div>

      {/* Capability strip */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CapabilityCard
          title="Troubleshooting"
          description="Evidence-driven incident diagnosis and root cause analysis."
          tag="Operations"
        />

        <CapabilityCard
          title="Automation"
          description="PowerShell and Azure CLI diagnostic workflows."
          tag="Engineering"
        />

        <CapabilityCard
          title="Observability"
          description="Azure Monitor, Log Analytics and KQL investigations."
          tag="Monitoring"
        />

        <CapabilityCard
          title="Recovery"
          description="Backup validation, recovery planning and service restoration."
          tag="Resilience"
        />
      </div>

      {/* Bottom CTA */}
      <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">
              Interactive Scenario
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Investigate a live simulated Azure incident
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Inject INC-002 and work through detection, evidence, root cause,
              remediation and validation.
            </p>
          </div>

          <Link
            href="/simulator"
            className="w-fit rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Start Investigation →
          </Link>
        </div>
      </div>
    </section>
  );
}

function HeroStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
      <p className="text-xs text-slate-600">
        {label}
      </p>

      <p className="mt-2 text-xl font-semibold text-cyan-300">
        {value}
      </p>
    </div>
  );
}

function MetricCard({
  label,
  value,
  helper,
  accent = "text-white",
}: {
  label: string;
  value: string;
  helper: string;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <p className="text-sm text-slate-400">
        {label}
      </p>

      <p className={`mt-3 text-2xl font-semibold ${accent}`}>
        {value}
      </p>

      <p className="mt-2 text-xs text-slate-600">
        {helper}
      </p>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <p className="text-sm font-semibold">
        {title}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {subtitle}
      </p>

      <div className="mt-5">
        {children}
      </div>
    </div>
  );
}

function Resource({
  name,
  type,
}: {
  name: string;
  type: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 w-2 rounded-full bg-emerald-400" />

      <div>
        <p className="text-sm text-slate-200">
          {name}
        </p>

        <p className="text-xs text-slate-600">
          {type}
        </p>
      </div>
    </div>
  );
}

function ReadinessBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="mb-5 last:mb-0">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-slate-400">
          {label}
        </span>

        <span className="text-xs font-medium text-cyan-300">
          {value}%
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-cyan-400"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function Activity({
  time,
  text,
}: {
  time: string;
  text: string;
}) {
  return (
    <div className="flex gap-3 border-b border-slate-800/70 pb-3 last:border-b-0">
      <span className="shrink-0 text-slate-700">
        {time}
      </span>

      <span className="text-slate-400">
        {text}
      </span>
    </div>
  );
}

function CapabilityCard({
  title,
  description,
  tag,
}: {
  title: string;
  description: string;
  tag: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <span className="text-[10px] uppercase tracking-[0.2em] text-cyan-500">
        {tag}
      </span>

      <h3 className="mt-3 text-base font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}