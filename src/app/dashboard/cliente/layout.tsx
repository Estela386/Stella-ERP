import CampaignTopBar from "@/app/_components/CampaignTopBar";

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CampaignTopBar />
      {children}
    </>
  );
}
