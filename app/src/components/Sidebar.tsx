"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    href: "/",
    label: "Overview",
    short: "OV",
  },
  {
    href: "/incidents",
    label: "Incidents",
    short: "IN",
  },
  {
    href: "/architecture",
    label: "Architecture",
    short: "AR",
  },
  {
    href: "/simulator",
    label: "Simulator",
    short: "SI",
  },
  {
    href: "/terminal",
    label: "Terminal",
    short: "TE",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-slate-800/80 bg-slate-950/85 p-6 backdrop-blur-xl lg:flex lg:flex-col">
      <div>
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <div className="soft-glow flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10">
              <span className="text-sm font-bold text-cyan-300">
                AO
              </span>
            </div>

            <div>
              <p className="text-xs tracking-[0.3em] text-cyan-400">
                AZURE OPS
              </p>

              <h2 className="mt-1 text-sm font-semibold text-white">
                Control Center
              </h2>
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                  active
                    ? "border border-cyan-500/20 bg-cyan-500/10 text-white"
                    : "border border-transparent text-slate-400 hover:border-slate-800 hover:bg-slate-900/70 hover:text-white"
                }`}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-lg border text-[10px] font-semibold ${
                    active
                      ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
                      : "border-slate-800 bg-slate-900 text-slate-600 group-hover:text-slate-400"
                  }`}
                >
                  {link.short}
                </span>

                <span>
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto space-y-4">
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
          <div className="flex items-center gap-2">
            <div className="status-pulse h-2 w-2 rounded-full bg-emerald-400" />

            <p className="text-xs uppercase tracking-wider text-cyan-400">
              Simulation Online
            </p>
          </div>

          <p className="mt-3 text-sm font-medium text-white">
            Azure Lab Environment
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Controlled operational scenarios with simulated Azure telemetry.
          </p>
        </div>

        <div className="px-1">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-700">
            Portfolio Lab
          </p>

          <p className="mt-1 text-xs text-slate-600">
            Azure Operations & Monitoring
          </p>
        </div>
      </div>
    </aside>
  );
}