interface HeroCardContent {
  title: string;
  subtitle: string;
}

const HeroCard = ({ title, subtitle }: HeroCardContent) => {
  return (
    <div>
      <div className="relative flex h-60 w-full flex-col items-center justify-center overflow-hidden bg-secondary px-4 text-center sm:h-100 sm:px-8">
        <h1 className="z-10 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
          {title}
        </h1>
        <p className="z-10 mt-3 max-w-xl text-sm text-white sm:mt-4 sm:text-base md:text-lg">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default HeroCard;
