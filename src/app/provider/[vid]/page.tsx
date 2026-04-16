import { getProvider } from "@/libs/providerService";
import ProviderDetailWithCars from "@/components/ProviderDetailWithCars";

export default async function ProviderDetailPage({
  params,
}: {
  params: Promise<{ vid: string }>;
}) {
  const { vid } = await params;
  const providerData = await getProvider(vid);
  const provider = providerData.data;

  if (!provider) {
    return (
      <main className="text-center p-5">
        <h1 className="text-lg font-medium text-red-500">Provider not found</h1>
      </main>
    );
  }

  return <ProviderDetailWithCars initialProvider={provider} />;
}
