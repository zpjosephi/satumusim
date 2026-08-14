import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ScrubIntro from "@/components/ScrubIntro";
import RaceChart from "@/components/RaceChart";
import StatGrid from "@/components/StatGrid";
import FinalTable from "@/components/FinalTable";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative z-[1] w-full max-w-full overflow-x-clip">
      <Nav />
      <Hero />
      <ScrubIntro />
      <RaceChart />
      <StatGrid />
      <FinalTable />
      <Footer />
    </main>
  );
}
