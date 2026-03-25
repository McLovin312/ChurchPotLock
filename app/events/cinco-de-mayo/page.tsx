import { getState } from "@/lib/actions";
import PotluckTracker from "@/components/PotluckTracker";

export const metadata = {
  title: "Cinco de Mayo Potluck - Lakeside Young Adults",
  description: "Sign up to bring food or drinks to the Cinco de Mayo potluck!",
};

// Always render fresh (no page-level caching)
export const dynamic = "force-dynamic";

export default async function CincoDeMayoPage() {
  const initialState = await getState();
  return <PotluckTracker initialState={initialState} />;
}
