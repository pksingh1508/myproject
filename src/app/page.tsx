import { HomePage } from "@/components/home";

export const revalidate = 120;

export default async function Home() {
  return <HomePage />;
}
