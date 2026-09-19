import { Hero, TrustBar } from "@/components/sections/Hero";
import { Diagnosis, WrongUse, InstructorStory, Dissonance } from "@/components/sections/PainSections";
import { Proof } from "@/components/sections/StructureProof";
import { FlywheelSection } from "@/components/sections/FlywheelSection";
import { Fear, Curriculum, Comparison } from "@/components/sections/UrgencyCurriculum";
import { Profile, Urgency, Apply, FAQ, FinalCTA } from "@/components/sections/AuthorityApply";
import { StickyCTA } from "@/components/StickyCTA";

// 활성 회차는 현재 시각으로 정해지므로 정적 빌드 시점에 고정되지 않게 최대 60초마다 재생성합니다.
export const revalidate = 60;

export default function Home() {
  return (
    <main className="overflow-x-clip">
      <Hero />
      <TrustBar />
      <Diagnosis />
      <WrongUse />
      <Dissonance />
      <FlywheelSection />
      <Proof />
      <InstructorStory />
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
