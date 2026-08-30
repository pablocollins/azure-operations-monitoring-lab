import Link from "next/link";
import { incidents } from "@/data/incidents";

export default function IncidentsPage() {
  return (
    <section className="px-6 py-8 lg:px-10">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">
          Incident Response
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Incident Portfolio
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
          Production-style Azure incidents covering identity, networking,
          monitoring and backup operations.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {incidents.map((incident) => (
          <div
            key={incident.id}
            className="panel-glow rounded-2xl border border-slate-800 bg-slate-900/60 p-6"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-cyan-400">
                  {incident.id}
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  {incident.title}
                </h2>
              </div>

              <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs text-amber-400">
                {incident.severity}
              </span>
            </div>

            <p className="mt-3 text-sm text-slate-500">
              {incident.area}
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <InfoBox
                label="Impact"
                value={incident.impact}
              />

              <InfoBox
                label="Root Cause"
                value={incident.rootCause}
              />
            </div>

            <div className="mt-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-600">
                Tools
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {incident.tools.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-1.5 text-xs text-slate-400"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-xs text-emerald-400">
                ● {incident.status}
              </span>

              <Link
                href={`/incidents/${incident.slug}`}
                className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                View investigation
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-sm leading-6 text-slate-300">
        {value}
      </p>
    </div>
  );
}