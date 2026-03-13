import HeroCard from "@/components/HeroCard";
import FilterSec from "@/components/FilterSec";
import CardContainer from "@/components/CardContainer";
import Card from "@/components/Card";
import { CategoryList } from "@/app/store/storeData";
import {HeroCardHomePage, cardDataList} from "@/app/store/storeData";

const toSectionId = (value: string) =>
  `category-${value.toLowerCase().replace(/\s+/g, "-")}`;

export default function Home() {
  return (
    <div>
      <HeroCard {...HeroCardHomePage} />
      <FilterSec categories={CategoryList} />
      {CategoryList.map((title) => (
        <section key={title} id={toSectionId(title)} className="scroll-mt-24 px-4 md:px-6 lg:px-8">
          <CardContainer title={title} isViewMore={true}>
            {cardDataList.slice(0, 8).map((card) => (
              <Card
                key={card.id}
                id={card.id}
                title={card.title}
                rating={card.rating}
                downloads={card.downloads}
                tags={card.tags}
                image={card.image}
              />
            ))}
          </CardContainer>
        </section>
      ))}
    </div>
  );
}