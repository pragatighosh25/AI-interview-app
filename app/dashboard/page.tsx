import Navbar from "@/components/Navbar";
import InterviewTypes from "@/components/dashboard/InterviewTypes";
import ProgressChart from "@/components/dashboard/ProgressChart";
import History from "@/components/dashboard/History";

export default function Dashboard() {
  return (
    <main className="pt-20 px-6 pb-16">
      <Navbar />

      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Heading */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome back 👋</h1>
            <p className="text-muted-foreground">
              Ready to crack your next interview?
            </p>
          </div>
        </div>

        {/* Interview Types */}
        <InterviewTypes />

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Graph */}
          <div className="lg:col-span-2">
            <ProgressChart />
          </div>

          {/* History */}
          <div>
            <History />
          </div>

        </div>
      </div>
    </main>
  );
}