import Navbar from "@/components/Navbar";
import InterviewTypes from "@/components/dashboard/InterviewTypes";
import ProgressChart from "@/components/dashboard/ProgressChart";
import History from "@/components/dashboard/History";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function Dashboard() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="pt-20 px-6 pb-16">
      <Navbar />

      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Heading */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back {session.user?.name || "User"}
            </h1>
            <p className="text-muted-foreground">
              Ready to crack your next interview?
            </p>
          </div>
        </div>

        {/* Interview Types */}
        <InterviewTypes />

        {/* Client side data section */}
        <DashboardClient />
      </div>
    </main>
  );
}