import ProviderCard from "./ProviderCard";
import Link from "next/link";
// Updated import to use ResponseList and Provider from the interface
import { Provider, ResponseList } from "@/../interface"; 

export default function ProviderCatalog({
  providersList, // Renamed prop for clarity
  isAdmin,
  onEdit,
  onDelete
}: {
  // Updated prop type to use ResponseList<Provider>
  providersList: ResponseList<Provider>;
  isAdmin?: boolean;
  onEdit?: (provider: Provider) => void;
  onDelete?: (provider: Provider) => void;
}) {
  // Use the resolved data directly
  const providersData = providersList;

  return (
    <div className="flex flex-row flex-wrap gap-5 justify-center p-5">
      {providersData.data.length === 0 ? (
        <div className="text-center text-lg text-[#111111]/40 mt-20 font-bold uppercase tracking-widest italic">
          No fleets available at the moment.
        </div>
      ) : (
        providersData.data.map((provider: Provider) => (
          <Link key={provider._id} href={`/provider/${provider._id}`}>
            {/* Pass new props: address and telephone */}
            <ProviderCard 
              providerName={provider.name} 
              imgSrc={provider.picture} 
              providerAddress={provider.address} 
              providerTelephone={provider.tel} 
              onEdit={isAdmin ? () => onEdit?.(provider) : undefined}
              onDelete={isAdmin ? () => onDelete?.(provider) : undefined}
            />
          </Link>
        ))
      )}
    </div>
  );
}
