"use client";

import { useState } from "react";

const commands = [
  {
    id: "vm-status",
    label: "Check VM Status",
    command: "Get-AzVM -Status",
    output: `ResourceGroupName : rg-ops-lab
Name              : vm-win-ops-01
PowerState        : VM running

ResourceGroupName : rg-ops-lab
Name              : vm-linux-app-01
PowerState        : VM running`,
    type: "PowerShell",
  },
  {
    id: "network-test",
    label: "Test TCP/443",
    command: "Test-NetConnection 10.10.1.20 -Port 443",
    output: `ComputerName     : 10.10.1.20
RemoteAddress    : 10.10.1.20
RemotePort       : 443
InterfaceAlias   : Ethernet
SourceAddress    : 10.10.1.10
TcpTestSucceeded : True`,
    type: "PowerShell",
  },
  {
    id: "nsg",
    label: "Inspect NSG Rules",
    command:
      "az network nsg rule list --resource-group rg-ops-lab --nsg-name nsg-servers --output table",
    output: `Name          Priority  Direction  Access  Protocol  DestinationPortRange
------------  --------  ---------  ------  --------  --------------------
Allow-SSH     100       Inbound    Allow   Tcp       22
Allow-HTTPS   200       Inbound    Allow   Tcp       443
Deny-All      300       Inbound    Deny    *         *`,
    type: "Azure CLI",
  },
  {
    id: "heartbeat",
    label: "Query VM Heartbeat",
    command: `Heartbeat
| summarize LastHeartbeat=max(TimeGenerated) by Computer
| order by LastHeartbeat desc`,
    output: `Computer             LastHeartbeat
-------------------  ------------------------
vm-win-ops-01        2026-08-28 01:54:21
vm-linux-app-01      2026-08-28 01:54:18`,
    type: "KQL",
  },
  {
    id: "backup",
    label: "Check Backup Status",
    command:
      "Get-AzRecoveryServicesBackupJob | Select-Object WorkloadName, Status, Operation",
    output: `WorkloadName        Status      Operation
------------------  ----------  ----------
vm-win-ops-01       Completed   Backup
vm-linux-app-01     Completed   Backup`,
    type: "PowerShell",
  },
];

export default function TerminalPage() {
  const [selectedCommand, setSelectedCommand] = useState(commands[0]);
  const [history, setHistory] = useState<typeof commands>([]);
  const [isRunning, setIsRunning] = useState(false);

  function runCommand() {
    setIsRunning(true);

    setTimeout(() => {
      setHistory((current) => [
        ...current,
        selectedCommand,
      ]);
      setIsRunning(false);
    }, 500);
  }

  function clearTerminal() {
    setHistory([]);
  }

  return (
    <section className="px-6 py-8 lg:px-10">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">
          Diagnostics
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Operations Terminal
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
          Execute simulated PowerShell, Azure CLI and KQL operational
          diagnostics against the Azure lab environment.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        {/* Command palette */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div>
            <p className="text-sm font-semibold">
              Diagnostic Commands
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Select an operational workflow
            </p>
          </div>

          <div className="mt-5 space-y-3">
            {commands.map((item) => {
              const active =
                selectedCommand.id === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() =>
                    setSelectedCommand(item)
                  }
                  className={`w-full rounded-xl border p-4 text-left transition ${
                    active
                      ? "border-cyan-500/30 bg-cyan-500/5"
                      : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p
                      className={`text-sm font-medium ${
                        active
                          ? "text-cyan-300"
                          : "text-slate-200"
                      }`}
                    >
                      {item.label}
                    </p>

                    <span className="text-[10px] uppercase tracking-wider text-slate-600">
                      {item.type}
                    </span>
                  </div>

                  <p className="mt-2 line-clamp-2 font-mono text-[11px] leading-5 text-slate-600">
                    {item.command}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Terminal area */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-black">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-800 bg-slate-950 px-5 py-4 md:flex-row md:items-center">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />

              <span className="ml-2 text-xs text-slate-500">
                Azure Operations Console
              </span>
            </div>

            <button
              onClick={clearTerminal}
              className="w-fit rounded-lg border border-slate-800 px-3 py-1.5 text-xs text-slate-500 transition hover:border-slate-700 hover:text-slate-300"
            >
              Clear
            </button>
          </div>

          <div className="min-h-[520px] p-6 font-mono text-xs leading-6">
            <div className="mb-6">
              <p className="text-slate-500">
                Azure Operations & Monitoring Lab
              </p>

              <p className="text-slate-600">
                Simulation Environment · Read-only diagnostics
              </p>
            </div>

            {history.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/50 p-8 text-center">
                <p className="text-sm text-slate-400">
                  No commands executed
                </p>

                <p className="mt-2 text-xs text-slate-600">
                  Select a diagnostic command and run it.
                </p>
              </div>
            )}

            <div className="space-y-8">
              {history.map((item, index) => (
                <TerminalEntry
                  key={`${item.id}-${index}`}
                  item={item}
                />
              ))}
            </div>

            <div className="mt-8 border-t border-slate-900 pt-6">
              <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-slate-600">
                Selected Command
              </p>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <p className="text-cyan-300">
                  {getPrompt(selectedCommand.type)}
                  {selectedCommand.command}
                </p>
              </div>

              <button
                onClick={runCommand}
                disabled={isRunning}
                className={`mt-4 rounded-xl px-5 py-3 text-sm font-semibold transition ${
                  isRunning
                    ? "cursor-not-allowed bg-slate-800 text-slate-500"
                    : "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                }`}
              >
                {isRunning
                  ? "Running diagnostic..."
                  : "Run Command"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Operational context */}
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <InfoCard
          title="Execution Mode"
          value="Simulation"
          description="Commands display realistic outputs without modifying live Azure resources."
        />

        <InfoCard
          title="Safety Model"
          value="Read-only first"
          description="Diagnostics prioritize evidence collection before remediation."
        />

        <InfoCard
          title="Supported Tooling"
          value="PS · CLI · KQL"
          description="PowerShell, Azure CLI and Kusto Query Language workflows."
        />
      </div>
    </section>
  );
}

function TerminalEntry({
  item,
}: {
  item: (typeof commands)[number];
}) {
  return (
    <div>
      <p className="text-cyan-300">
        {getPrompt(item.type)}
        {item.command}
      </p>

      <pre className="mt-3 whitespace-pre-wrap text-emerald-300">
        {item.output}
      </pre>
    </div>
  );
}

function getPrompt(type: string) {
  if (type === "Azure CLI") {
    return "azure-user@ops:~$ ";
  }

  if (type === "KQL") {
    return "KQL> ";
  }

  return "PS C:\\Ops> ";
}

function InfoCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
        {title}
      </p>

      <p className="mt-3 text-lg font-semibold text-cyan-300">
        {value}
      </p>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}