"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { scenarios } from "@/data/scenarios";

function SimulatorContent() {
  const searchParams = useSearchParams();

  const scenarioFromUrl =
    searchParams.get("scenario") ?? scenarios[1].id;

  const initialScenario =
    scenarios.find(
      (item) => item.id === scenarioFromUrl
    ) ?? scenarios[1];

  const [selectedScenarioId, setSelectedScenarioId] =
    useState(initialScenario.id);

  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);

  const scenario = useMemo(
    () =>
      scenarios.find(
        (item) => item.id === selectedScenarioId
      ) ?? scenarios[0],
    [selectedScenarioId]
  );

  const resolved =
    active && step === scenario.steps.length - 1;

  const currentStep = scenario.steps[step];

  function selectScenario(id: string) {
    setSelectedScenarioId(id);
    setActive(false);
    setStep(0);
  }

  function injectIncident() {
    setActive(true);
    setStep(0);
  }

  function resetSimulation() {
    setActive(false);
    setStep(0);
  }

  function nextStep() {
    setStep((current) =>
      Math.min(
        current + 1,
        scenario.steps.length - 1
      )
    );
  }

  function previousStep() {
    setStep((current) =>
      Math.max(current - 1, 0)
    );
  }

  return (
    <section className="px-6 py-8 lg:px-10">
      <div className="mb-8 flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">
            Incident Simulator
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Azure Failure Simulation
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Trigger controlled operational failures and investigate them
            through evidence-driven Azure troubleshooting workflows.
          </p>
        </div>

        <div
          className={`w-fit rounded-full border px-4 py-2 text-sm ${
            !active || resolved
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
              : "border-amber-500/20 bg-amber-500/10 text-amber-400"
          }`}
        >
          ●{" "}
          {!active || resolved
            ? "Environment Healthy"
            : "Environment Degraded"}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {scenarios.map((item) => {
          const selected =
            item.id === selectedScenarioId;

          return (
            <button
              key={item.id}
              onClick={() =>
                selectScenario(item.id)
              }
              className={`panel-glow rounded-2xl border p-5 text-left transition ${
                selected
                  ? "border-cyan-500/30 bg-cyan-500/10"
                  : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-semibold ${
                    selected
                      ? "text-cyan-300"
                      : "text-slate-500"
                  }`}
                >
                  {item.incidentId}
                </span>

                <span className="text-[10px] uppercase tracking-wider text-slate-600">
                  {item.severity}
                </span>
              </div>

              <h2 className="mt-3 text-sm font-semibold text-white">
                {item.title}
              </h2>

              <p className="mt-2 text-xs text-slate-500">
                {item.area}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs uppercase tracking-[0.2em] text-cyan-400">
                {scenario.incidentId}
              </span>

              <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[10px] text-amber-400">
                {scenario.severity}
              </span>
            </div>

            <h2 className="mt-3 text-2xl font-semibold">
              {scenario.title}
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
              {scenario.description}
            </p>
          </div>

          {!active ? (
            <button
              onClick={injectIncident}
              className="w-fit rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
            >
              Inject Failure
            </button>
          ) : (
            <button
              onClick={resetSimulation}
              className="w-fit rounded-xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-900"
            >
              Reset Simulation
            </button>
          )}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <DetailCard
            label="Area"
            value={scenario.area}
          />

          <DetailCard
            label="Affected Service"
            value={scenario.service ?? "Azure Service"}
          />

          <DetailCard
            label="Resource"
            value={
              scenario.affectedResource ??
              scenario.destination ??
              "Azure environment"
            }
          />
        </div>
      </div>

      {!active && (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-10 text-center">
          <p className="text-sm font-medium text-slate-300">
            Scenario ready
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Inject the failure to begin the investigation.
          </p>
        </div>
      )}

      {active && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
          <div className="border-b border-slate-800 p-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-amber-400">
                  Incident Investigation
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  {scenario.incidentId} · {scenario.title}
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Follow the operational lifecycle from detection to validation.
                </p>
              </div>

              <span
                className={`w-fit rounded-full border px-3 py-1 text-xs ${
                  resolved
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                    : "border-amber-500/20 bg-amber-500/10 text-amber-400"
                }`}
              >
                {resolved
                  ? "Resolved"
                  : "Investigation Active"}
              </span>
            </div>
          </div>

          <div className="border-b border-slate-800 px-6 py-5">
            <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
              {scenario.steps.map(
                (item, index) => {
                  const completed =
                    index < step;

                  const current =
                    index === step;

                  return (
                    <button
                      key={`${scenario.id}-${item.title}`}
                      onClick={() =>
                        setStep(index)
                      }
                      className={`rounded-xl border p-3 text-left transition ${
                        completed
                          ? "border-emerald-500/20 bg-emerald-500/5"
                          : current
                          ? "border-cyan-500/30 bg-cyan-500/5"
                          : "border-slate-800 bg-slate-950/50 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                            completed
                              ? "bg-emerald-500 text-slate-950"
                              : current
                              ? "bg-cyan-400 text-slate-950"
                              : "bg-slate-800 text-slate-500"
                          }`}
                        >
                          {completed
                            ? "✓"
                            : index + 1}
                        </div>

                        <p
                          className={`text-xs font-medium ${
                            completed
                              ? "text-emerald-300"
                              : current
                              ? "text-cyan-300"
                              : "text-slate-500"
                          }`}
                        >
                          {item.title}
                        </p>
                      </div>

                      <p className="mt-2 text-[11px] leading-4 text-slate-600">
                        {item.subtitle}
                      </p>
                    </button>
                  );
                }
              )}
            </div>
          </div>

          <div className="p-6">
            <StepContent
              stepNumber={step + 1}
              title={currentStep.title}
              description={
                currentStep.description
              }
              type={currentStep.type}
              command={currentStep.command}
              output={currentStep.output}
              note={currentStep.note}
            />

            <div className="mt-6 flex flex-col-reverse justify-between gap-3 sm:flex-row">
              <button
                onClick={previousStep}
                disabled={step === 0}
                className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-400 transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-30"
              >
                ← Previous
              </button>

              {!resolved && (
                <button
                  onClick={nextStep}
                  className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  Next investigation step →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function StepContent({
  stepNumber,
  title,
  description,
  type,
  command,
  output,
  note,
}: {
  stepNumber: number;
  title: string;
  description: string;
  type: string;
  command?: string;
  output?: string;
  note?: string;
}) {
  const isRootCause =
    type === "root-cause";

  const isValidation =
    type === "validation";

  return (
    <div>
      <p
        className={`text-xs uppercase tracking-[0.2em] ${
          isRootCause
            ? "text-red-400"
            : isValidation
            ? "text-emerald-400"
            : "text-cyan-400"
        }`}
      >
        Step {stepNumber}
      </p>

      <h3 className="mt-2 text-2xl font-semibold">
        {title}
      </h3>

      <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-400">
        {description}
      </p>

      {command && (
        <TerminalBlock
          command={command}
          output={output ?? ""}
          success={isValidation}
        />
      )}

      {!command && output && (
        <pre
          className={`terminal-glow mt-6 overflow-x-auto whitespace-pre-wrap rounded-xl border p-5 font-mono text-xs leading-6 ${
            isValidation
              ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-300"
              : isRootCause
              ? "border-red-500/20 bg-red-500/5 text-red-300"
              : "border-slate-800 bg-black text-slate-300"
          }`}
        >
          {output}
        </pre>
      )}

      {note && (
        <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-sm leading-6 text-amber-200">
            {note}
          </p>
        </div>
      )}

      {isRootCause && (
        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-red-400">
            Root Cause Confirmed
          </p>

          <p className="mt-3 text-sm leading-7 text-slate-300">
            The investigation has gathered enough evidence to identify the
            underlying cause of the incident.
          </p>
        </div>
      )}

      {isValidation && (
        <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">
            Service Restored
          </p>

          <p className="mt-3 text-sm leading-7 text-slate-300">
            Remediation has been validated and the simulated environment has
            returned to a healthy operational state.
          </p>
        </div>
      )}
    </div>
  );
}

function TerminalBlock({
  command,
  output,
  success = false,
}: {
  command: string;
  output: string;
  success?: boolean;
}) {
  return (
    <div className="terminal-glow mt-6 overflow-hidden rounded-xl border border-slate-800 bg-black">
      <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-950 px-4 py-3">
        <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />

        <span className="ml-2 text-xs text-slate-500">
          Operations Console
        </span>
      </div>

      <div className="p-5 font-mono text-xs leading-6">
        <p className="whitespace-pre-wrap text-cyan-300">
          {command}
        </p>

        {output && (
          <pre
            className={`mt-4 whitespace-pre-wrap ${
              success
                ? "text-emerald-300"
                : "text-slate-300"
            }`}
          >
            {output}
          </pre>
        )}
      </div>
    </div>
  );
}

function DetailCard({
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

      <p className="mt-2 text-sm font-medium text-slate-200">
        {value}
      </p>
    </div>
  );
}

function SimulatorLoading() {
  return (
    <section className="px-6 py-8 lg:px-10">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">
          Incident Simulator
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Azure Failure Simulation
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Loading simulation environment...
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-10">
        <div className="animate-pulse">
          <div className="h-4 w-40 rounded bg-slate-800" />

          <div className="mt-4 h-8 w-80 max-w-full rounded bg-slate-800" />

          <div className="mt-6 h-24 rounded-xl bg-slate-800/60" />
        </div>
      </div>
    </section>
  );
}

export default function SimulatorPage() {
  return (
    <Suspense fallback={<SimulatorLoading />}>
      <SimulatorContent />
    </Suspense>
  );
}