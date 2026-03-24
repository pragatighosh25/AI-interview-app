import Navbar from "@/components/Navbar";
import InterviewPanel from "@/components/interview/InterviewPanel";

export default function InterviewPage() {
  return (
    <main className="pt-20 px-6 pb-16">
      <Navbar />

      <div className="max-w-4xl mx-auto">
        <InterviewPanel />
      </div>
    </main>
  );
}