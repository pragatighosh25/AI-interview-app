import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import BentoFeatures from "@/components/BentoFeatures";

export default function Home() {
  return (
    <main className="pt-20">
      <Navbar />
      <Hero />
      <BentoFeatures />
      <Footer />
    </main>
  );
}