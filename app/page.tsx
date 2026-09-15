import { Hero, TrustBar } from "@/components/sections/Hero";
import { Diagnosis, WrongUse, InstructorStory, Dissonance } from "@/components/sections/PainSections";
import { Proof } from "@/components/sections/StructureProof";
import { FlywheelSection } from "@/components/sections/FlywheelSection";
import { Fear, Curriculum, Comparison } from "@/components/sections/UrgencyCurriculum";
import { Profile, Urgency, Apply, FAQ, FinalCTA } from "@/components/sections/AuthorityApply";
import { StickyCTA } from "@/components/StickyCTA";

export default function Home() {
  return (
    <main className="overflow-x-clip">
      <Hero />
      <TrustBar />
      <Diagnosis />
      <WrongUse />
      <InstructorStory />
      <Dissonance />
      <FlywheelSection />
      <Proof />
      <Fear />
      <Curriculum />
      <Comparison />
      <Profile />
      <Urgency />
      <Apply />
      <FAQ />
      <FinalCTA />
      <StickyCTA />
    </main>
  );
}
