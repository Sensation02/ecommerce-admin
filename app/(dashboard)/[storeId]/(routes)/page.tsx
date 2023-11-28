import prismadb from "@/lib/prismadb";

type Props = {
  params: {
    storeId: string;
  };
};

const DashboardPage: React.FC<Props> = async ({ params }) => {
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
    },
  });

  return (
    <div>
      <h1>Active store: {store?.name}</h1>
    </div>
  );
};

export default DashboardPage;
