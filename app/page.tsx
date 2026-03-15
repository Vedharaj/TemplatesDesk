import HeroCard from "@/components/HeroCard";
import FilterSec from "@/components/FilterSec";
import CardContainer from "@/components/CardContainer";
import Card from "@/components/Card";
import { CategoryList, HeroCardHomePage } from "@/app/store/storeData";
import { prisma } from "@/lib/prisma";
import type { Template } from "@prisma/client";

const toSectionId = (value: string) =>
  `category-${value.toLowerCase().replace(/\s+/g, "-")}`;

export default async function Home() {
  const categoryTemplates = await Promise.all(
    CategoryList.map((category) =>
      prisma.template.findMany({
        where: { category },
        take: 8,
        orderBy: { createdDate: "desc" },
      })
    )
  );

  return (
    <div>
      <HeroCard {...HeroCardHomePage} />
      <FilterSec categories={CategoryList} isFilterVisible={false} />
      {CategoryList.map((title, i) => (
        <section key={title} id={toSectionId(title)} className="scroll-mt-24 px-4 md:px-6 lg:px-8">
          <CardContainer title={title} isViewMore={true}>
            {categoryTemplates[i].map((t: Template) => (
              <Card
                key={t.id}
                id={t.id}
                title={t.title}
                rating={t.rating}
                downloads={String(t.downloads)}
                tags={(t.tags as string[]).slice(0, 2)}
                image={((t.images as string[])[0]) ?? "/image/placeholder.png"}
                price={t.price}
                canvaLink={t.canvaLink}
                pptLink={t.pptLink}
                slideLink={t.slideLink}
              />
            ))}
          </CardContainer>
        </section>
      ))}
    </div>
  );
}