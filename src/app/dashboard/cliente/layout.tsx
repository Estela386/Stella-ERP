import CampaignTopBar from "./_components/CampaignTopBar";

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CampaignTopBar />
      {children}
    </>
  );
}
