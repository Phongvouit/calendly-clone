import { redirect } from "next/navigation";
import LandingPage from "@/components/LandingPage";
import { currentUser } from "@clerk/nextjs/server";

export default async function HomePage() {
  const user = await currentUser();
  if (!user) return <LandingPage />;
  return redirect("/events");
}
