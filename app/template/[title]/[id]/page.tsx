import { cardDataList } from "@/app/store/storeData";
import TemplateImageGallery from "@/components/TemplateImageGallery";
import { notFound } from "next/navigation";
import { Star, Heart, Share } from "lucide-react";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import Image from "next/image";
import CardContainer from "@/components/CardContainer";
import Card from "@/components/Card";

interface PageProps {
  params:
    | {
        title?: string;
        id?: string;
      }
    | Promise<{
        title?: string;
        id?: string;
      }>;
}

const Page = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  if (!id) {
    notFound();
  }

  const cardData = cardDataList.find((card) => card.id === Number(id));
  if (!cardData) {
    notFound();
  }
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-xl sm:text-1xl lg:text-2xl font-bold leading-tight">
        {cardData.title}
      </p>
      <div className="flex items-center gap-1 mt-1">
        <Star className="h-4 w-4 sm:h-5 sm:w-5 lg:h-5 lg:w-5 text-yellow-400 fill-yellow-400" />
        <span className="text-sm sm:text-base lg:text-lg text-yellow-400 font-bold">
          {cardData.rating}
        </span>
        <span className="text-black text-sm"> ({cardData.rated} ratings)</span>
      </div>
      <div className="flex md:flex-row flex-col items-start gap-6 mt-2">
        <div className="w-full grow">
          <TemplateImageGallery
            title={cardData.title}
            image={cardData.image}
            images={cardData.images}
            totalSlides={cardData.images.length}
          />
          <div className="mt-4 grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:flex">
            <button className="group flex w-full cursor-pointer items-center justify-center gap-1 rounded-md border-2 border-red-400 px-3 py-2 text-sm transition hover:bg-red-400 sm:px-4 sm:text-base lg:w-auto lg:justify-start">
              <Heart
                size={20}
                className="text-red-400 transition-colors group-hover:text-white"
              />
              <span className="ml-1 text-red-400 transition-colors group-hover:text-white">
                {cardData.likes}
              </span>
            </button>
            <button className="group flex w-full cursor-pointer items-center justify-center gap-1 rounded-md border-2 border-purple-400 px-3 py-2 text-sm transition hover:bg-purple-400 sm:px-4 sm:text-base lg:w-auto lg:justify-start">
              <Share
                size={20}
                className="text-purple-400 transition-colors group-hover:text-white"
              />
              <span className="ml-1 text-purple-400 transition-colors group-hover:text-white">
                {cardData.shares}
              </span>
            </button>
            <button className="group flex w-full cursor-pointer items-center justify-center gap-1 rounded-md border-2 border-yellow-400 px-3 py-2 text-sm transition hover:bg-yellow-400 sm:px-4 sm:text-base lg:w-auto lg:justify-start">
              <div className="w-20 sm:w-24 lg:w-28">
                <Rating
                  style={{ maxWidth: "100%" }}
                  value={cardData.rating}
                  readOnly
                />
              </div>
              <span className="ml-1 text-yellow-400 transition-colors select-none group-hover:text-white">
                {cardData.rating}
              </span>
            </button>
          </div>
        </div>
        <div className="shrink-0 flex-col row-2 flex gap-3 sm:mt-4 lg:mt-6 border-2 border-gray-300 rounded-md p-4 w-full md:w-auto">
          <span>Download</span>
          <button className="bg-linear-to-b cursor-pointer from-purple-600 to-purple-400 hover:from-purple-500 hover:to-purple-600 text-xl text-white rounded-md font-bold gap-2 flex justify-center px-4 py-2 sm:px-4 md:px-8 lg:px-16 transition delay-150 ease-linear hover:bg-muted">
            <Image
              src="/icons/canva-full.svg"
              alt="Canva icon"
              width={70}
              height={40}
            />
          </button>
          <button className="bg-linear-to-b cursor-pointer from-red-600 to-red-400 hover:from-red-500 hover:to-red-600 text-xl text-white rounded-md font-bold gap-2 flex justify-center px-4 sm:px-4 md:px-8 lg:px-16 py-1.5 transition delay-150 ease-linear hover:bg-muted">
            <Image
              src="/icons/powerpoint.svg"
              alt="PowerPoint icon"
              width={24}
              height={24}
            />
            <span>PowerPoint</span>
          </button>
          <button className="bg-linear-to-b cursor-pointer from-yellow-400 to-yellow-300 hover:from-yellow-500 hover:to-yellow-600 text-xl text-white rounded-md font-bold gap-2 flex justify-center px-4 sm:px-4 md:px-8 lg:px-16 py-1.5 transition delay-150 ease-linear hover:bg-muted">
            <Image
              src="/icons/google-slides.svg"
              alt="Google Slides icon"
              width={24}
              height={20}
            />
            <span>Google Slide</span>
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-2 sm:mt-4 w-full md:w-3/4 lg:w-2/3">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere quis quo
        dolore saepe aspernatur quisquam consequatur. Repellendus commodi nihil
        id eaque labore ab, nobis natus iure aliquam sequi similique voluptate!
      </p>
      {cardData.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {cardData.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <CardContainer title="Related Templates" isViewMore={false}>
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
    </div>
  );
};

export default Page;
