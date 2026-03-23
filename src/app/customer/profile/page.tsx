import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  const fullName = session?.user?.name || "Rishav Rawat";
  const nameParts = fullName.split(" ");
  const firstName = nameParts[0] || "Rishav";
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "Rawat";
  const email = session?.user?.email || "rishavrawat126@gmail.com";

  return <ProfileClient fullName={fullName} firstName={firstName} lastName={lastName} email={email} />;
}
