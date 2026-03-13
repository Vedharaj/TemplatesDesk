import Card from "@/components/Card";

type PaginatedCardItem = {
  id: number;
  title: string;
  rating: number;
  downloads: string;
  tags: string[];
  image: string;
};

interface PaginatedCardsProps {
  cards: PaginatedCardItem[];
}

const PaginatedCards = ({ cards }: PaginatedCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {cards.map((card) => (
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
    </div>
  );
};

export default PaginatedCards;
