import HeroCard from "@/components/HeroCard";
import FilterSec from "@/components/FilterSec";
import CardContainer from "@/components/CardContainer";
import Card from "@/components/Card";

const cardsData = [
  {
    id: 1,
    title: "Business Poster",
    rating: 4.5,
    downloads: "2.5k",
    tags: ["white", "white", "white"],
  },
  {
    id: 2,
    title: "Simple Business Poster",
    rating: 4.0,
    downloads: "2.2k",
    tags: ["white", "white", "white"],
  },
  {
    id: 3,
    title: "Presentation Poster",
    rating: 3.5,
    downloads: "1.5k",
    tags: ["white", "white", "white"],
  },
  {
    id: 4,
    title: "Creative Business Poster",
    rating: 4.8,
    downloads: "3.0k",
    tags: ["white", "white", "white"],
  }
];

const categories = [
  "business",
  "education",
  "marketing",
  "technology",
  "finance",
  "healthcare",
  "real estate",
  "travel",
  "food",
  "fashion",
  "sports",
  "entertainment",
  "art",
  "music",
  "photography",
  "nonprofit",
  "personal",
  "events",
  "social media",
  "other",
];

const toSectionId = (value: string) =>
  `category-${value.toLowerCase().replace(/\s+/g, "-")}`;

export default function Home() {
  return (
    <div>
      <HeroCard />
      <FilterSec categories={categories} />
      {categories.map((title) => (
        <section key={title} id={toSectionId(title)} className="scroll-mt-24">
          <CardContainer title={title}>
            {cardsData.map((card) => (
              <Card
                key={card.id}
                title={card.title}
                rating={card.rating}
                downloads={card.downloads}
                tags={card.tags}
              />
            ))}
          </CardContainer>
        </section>
      ))}
    </div>
  );
}
