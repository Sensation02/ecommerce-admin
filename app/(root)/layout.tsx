import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

export default async function SetupLayout({ children }: Props) {
  // getting user id from auth
  const { userId } = auth();
  if (!userId) redirect("/sign-in"); // not signed in users will be redirected to sign in page

  const billboard = await prismadb.billboard;

  // loading the first store with user id
  const store = await prismadb.store.findFirst({
    where: {
      userId,
    },
  });

  if (store) redirect(`/${store.id}`); // if store found, redirect to page of that store

  // simply returning children page (and its our dashboard layout)
  return <>{children}</>;
}
