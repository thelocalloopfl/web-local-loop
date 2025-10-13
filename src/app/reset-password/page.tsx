import ResetPage from "../components/ResetPage";
import LogoServer from "../components/LogoServer";

export const dynamic = "force-dynamic"; // ensure CSR works

export default function Page() {
  return <ResetPage logo={<LogoServer width={260} height={260} />} />;
}
