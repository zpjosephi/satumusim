import Nav from "@/components/Nav";
import SmoothScroll from "@/components/SmoothScroll";
import Hero from "@/components/Hero";
import ScrubIntro from "@/components/ScrubIntro";
import RaceChart from "@/components/RaceChart";
import Clearance from "@/components/Clearance";
import Streak from "@/components/Streak";
import FinalDay from "@/components/FinalDay";
import StatGrid from "@/components/StatGrid";
import FinalTable from "@/components/FinalTable";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <SmoothScroll>
        <main className="relative z-[1] w-full max-w-full">
          <Hero />
          <ScrubIntro />
          <RaceChart />
          <Clearance />
          <Streak />
          <FinalDay />
          <StatGrid />
          <FinalTable />
          <Footer />
        </main>
      </SmoothScroll>
    </>
  );
}
