import Navbar from "@/components/Navbar";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

type Props = {
  children: React.ReactNode;
  params: {
    storeId: string;
  };
};

export default async function DashboardLayout({ children, params }: Props) {
  // getting user id from auth
  const { userId } = auth();
  if (!userId) redirect("/sign-in"); // not signed in users will be redirected to sign in page

  // loading first store with given id and user id
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });

  if (!store) redirect("/"); // if store not found, redirect to home page

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
