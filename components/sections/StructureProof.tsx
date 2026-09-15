import { ProofRow } from "@/components/ProofRow";
import { SiteProofRow } from "@/components/SiteProofRow";
import { ReviewProofRow } from "@/components/ReviewProofRow";
import { NotionProofRow } from "@/components/NotionProofRow";
import { VideoWorks } from "@/components/sections/VideoWorks";

export function Proof() {
  return <section id="proof" className="bg-surface"><NotionProofRow /><ProofRow /><VideoWorks /><SiteProofRow /><ReviewProofRow /></section>;
}
