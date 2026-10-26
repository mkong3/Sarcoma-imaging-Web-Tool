import { Planner } from "@/components/Planner";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 lg:py-12">
      <header className="mb-6 space-y-2">
        <p className="text-sm font-medium uppercase tracking-wide text-sky-800">Prototype · clinician use</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Sarcoma Imaging Follow-up Planner</h1>
        <p className="max-w-2xl text-slate-700">
          Plan and review postoperative imaging surveillance for adult soft tissue sarcoma and desmoid-type
          fibromatosis using the ESSR 2024 guidelines. Every item shows where it comes from.
        </p>
      </header>
      <Planner />
    </main>
  );
}
