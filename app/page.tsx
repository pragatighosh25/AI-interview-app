import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6">
      
      <h1 className="text-5xl font-bold text-center mb-6">
        Crack Your Next Interview 🚀
      </h1>

      <p className="text-lg text-gray-400 text-center max-w-xl mb-8">
        Practice AI-powered interviews, get instant feedback, and improve faster than ever.
      </p>

      <div className="flex gap-4">
        <Button className="text-lg px-6 py-5">
          Start Interview
        </Button>

        <Button variant="outline" className="text-lg px-6 py-5">
          Login
        </Button>
      </div>

    </main>
  );
}