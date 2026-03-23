import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <div className="p-6 text-white bg-black min-h-screen">

      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      <Button>
        Start New Interview
      </Button>

    </div>
  );
}