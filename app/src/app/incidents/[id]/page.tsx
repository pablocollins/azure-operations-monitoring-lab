import Link from "next/link";
import { notFound } from "next/navigation";
import { getIncidentBySlug } from "@/data/incidents";
import { getScenarioByIncidentId } from "@/data/scenarios";

export default async function IncidentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const incident = getIncidentBySlug(id);

  if (!incident) {
    notFound();
  }

  const scenario =
    getScenarioByIncidentId(incident.id);

  return (
    <section className="px-6 py-8 lg:px-10">
      <Link
        href="/incidents"
        className="text-sm text-slate-500 transition hover:text-cyan-300"
      >
        ← Back to incidents
      </Link>

      <div className="mt-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">
            {incident.id}
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            {incident.title}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {incident.area}
          </p>
        </div>

        <div className="flex gap-2">
          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs text-amber-400">
            {incident.severity}
          </span>

          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
            {incident.status}
          </span>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-red-400">
          Business Impact
        </p>

        <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-300">
          {incident.impact}
        </p>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <InvestigationSection
          number="01"
          title="Symptoms"
          items={incident.symptoms}
        />

        <InvestigationSection
          number="02"
          title="Evidence Collection"
          items={incident.evidence}
        />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-red-400">
          03 · Root Cause
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          Root cause identified
        </h2>

        <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-400">
          {incident.rootCause}
        </p>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <OutcomeCard
          label="04 · Remediation"
          title="Corrective Action"
          text={incident.remediation}
          type="warning"
        />

        <OutcomeCard
          label="05 · Validation"
          title="Service Recovery"
          text={incident.validation}
          type="success"
        />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <p className="text-sm font-semibold">
          Tools & Technologies
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {incident.tools.map((tool) => (
            <span
              key={tool}
              className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-3 py-2 text-xs text-cyan-300"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>

      {scenario && (
        <div className="mt-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">
            Interactive Scenario
          </p>

          <h2 className="mt-3 text-xl font-semibold">
            Investigate {incident.id} yourself
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Trigger the failure and follow the complete troubleshooting workflow
            from detection through remediation and validation.
          </p>

          <Link
            href={`/simulator?scenario=${scenario.id}`}
            className="mt-5 inline-block rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Launch {incident.id} Simulation →
          </Link>
        </div>
      )}
    </section>
  );
}

function InvestigationSection({
  number,
  title,
  items,
}: {
  number: string;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">
        {number}
      </p>

      <h2 className="mt-2 text-xl font-semibold">
        {title}
      </h2>

      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div
            key={item}
            className="flex gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4"
          >
            <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-cyan-400" />

            <p className="text-sm leading-6 text-slate-400">
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function OutcomeCard({
  label,
  title,
  text,
  type,
}: {
  label: string;
  title: string;
  text: string;
  type: "warning" | "success";
}) {
  const styles =
    type === "success"
      ? "border-emerald-500/20 bg-emerald-500/5"
      : "border-amber-500/20 bg-amber-500/5";

  const labelStyle =
    type === "success"
      ? "text-emerald-400"
      : "text-amber-400";

  return (
    <div className={`rounded-2xl border p-6 ${styles}`}>
      <p
        className={`text-xs uppercase tracking-[0.2em] ${labelStyle}`}
      >
        {label}
      </p>

      <h2 className="mt-3 text-xl font-semibold">
        {title}
      </h2>

      <p className="mt-3 text-sm leading-7 text-slate-400">
        {text}
      </p>
    </div>
  );
}