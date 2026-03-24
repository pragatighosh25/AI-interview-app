import Navbar from "@/components/Navbar";
import ResultsPanel from "@/components/interview/ResultsPannel";

export default function ResultPage() {
  return (
    <main className="pt-20 px-6 pb-16">
      <Navbar />

      <div className="max-w-4xl mx-auto">
        <ResultsPanel />
      </div>
    </main>
  );
}