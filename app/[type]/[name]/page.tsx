import * as Store from "@/app/store/storeData";
import HeroCard from "@/components/HeroCard";
import FilterBtn from "@/components/FilterBtn";
import { cardDataList } from "@/app/store/storeData";
import Card from "@/components/Card";

interface PageProps {
  params:
    | {
        name?: string;
        type?: string;
      }
    | Promise<{
        name?: string;
        type?: string;
      }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const { name, type } = resolvedParams;

  if (!name || !type) {
    return <div>Not found</div>;
  }

  const decodedName = decodeURIComponent(name);

  const storeMap = {
    category: Store.Categories,
    categories: Store.Categories,
    color: Store.Colors,
    colors: Store.Colors,
    style: Store.Styles,
    styles: Store.Styles,
  } as const;

  const dataSource = storeMap[type.toLowerCase() as keyof typeof storeMap];
  const data = (
    dataSource as
      | Record<string, { title: string; subtitle: string }>
      | undefined
  )?.[decodedName];

  if (!data) {
    return <div>Not found</div>;
  }

  return (
    <div>
      <HeroCard title={data.title} subtitle={data.subtitle} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mt-4 w-full flex justify-between">
          <h3 className="text-2xl font-bold capitalize">
            {decodeURIComponent(name)}
          </h3>
          <FilterBtn />
        </div>
        <div className="grid grid-cols-3 w-full gap-4 mt-6">
          {cardDataList.slice(0, 9).map((card) => (
            <Card
              key={card.id}
              title={card.title}
              rating={card.rating}
              downloads={card.downloads}
              tags={card.tags}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
