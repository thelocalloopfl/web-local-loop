import { fetchSiteLogo } from "@/lib/fetchLogo";
import LogoClient from "../components/LogoClient";

interface LogoServerProps {
  width?: number;
  height?: number;
}

export default async function LogoServer({
  width = 70,
  height = 70,
}: LogoServerProps) {
  const logo = await fetchSiteLogo();

  return <LogoClient logo={logo} width={width} height={height} />;
}
