// page.tsx (Server Component)
import AuthPage from "../components/AuthPage";
import LogoServer from "../components/LogoServer";

export default function Page() {
  return <AuthPage logo={<LogoServer width={260} height={260} />} />;
}
