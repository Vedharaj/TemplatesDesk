import TemplateImageGallery from "@/components/TemplateImageGallery";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import "@smastrom/react-rating/style.css";
import Image from "next/image";
import CardContainer from "@/components/CardContainer";
import Card from "@/components/Card";
import TemplateInteractions from "@/components/TemplateInteractions";
import { prisma } from "@/lib/prisma";
import type { Template } from "@prisma/client";

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

  const template = await prisma.template.findUnique({ where: { id: Number(id) } });
  if (!template) {
    notFound();
  }

  const images = template.images as string[];
  const tags = template.tags as string[];

  const related = await prisma.template.findMany({
    where: { category: template.category, NOT: { id: template.id } },
    take: 8,
    orderBy: { createdDate: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-xl sm:text-1xl lg:text-2xl font-bold leading-tight">
        {template.title}
      </p>
      <div className="flex items-center gap-1 mt-1">
        <Star className="h-4 w-4 sm:h-5 sm:w-5 lg:h-5 lg:w-5 text-yellow-400 fill-yellow-400" />
        <span className="text-sm sm:text-base lg:text-lg text-yellow-400 font-bold">
          {template.rating}
        </span>
      </div>
      <div className="flex md:flex-row flex-col items-start gap-6 mt-2">
        <div className="w-full grow">
          <TemplateImageGallery
            title={template.title}
            image={images[0] ?? "/image/placeholder.png"}
            images={images}
            totalSlides={template.totalSlides}
          />
          <TemplateInteractions
            templateId={template.id}
            initialLikes={template.likes}
            initialShares={template.shares}
            initialRating={template.rating}
          />
        </div>
        <div className="shrink-0 flex-col row-2 flex gap-3 sm:mt-4 lg:mt-6 border-2 border-gray-300 rounded-md p-4 w-full md:w-auto">
          <span>Download</span>
          <a
            href={template.canvaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-linear-to-b cursor-pointer from-purple-600 to-purple-400 hover:from-purple-500 hover:to-purple-600 text-xl text-white rounded-md font-bold gap-2 flex justify-center px-4 py-2 sm:px-4 md:px-8 lg:px-16 transition delay-150 ease-linear hover:bg-muted"
          >
            <Image
              src="/icons/canva-full.svg"
              alt="Canva icon"
              width={70}
              height={40}
            />
          </a>
          <a
            href={template.pptLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-linear-to-b cursor-pointer from-red-600 to-red-400 hover:from-red-500 hover:to-red-600 text-xl text-white rounded-md font-bold gap-2 flex justify-center px-4 sm:px-4 md:px-8 lg:px-16 py-1.5 transition delay-150 ease-linear hover:bg-muted"
          >
            <Image
              src="/icons/powerpoint.svg"
              alt="PowerPoint icon"
              width={24}
              height={24}
            />
            <span>PowerPoint</span>
          </a>
          <a
            href={template.slideLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-linear-to-b cursor-pointer from-yellow-400 to-yellow-300 hover:from-yellow-500 hover:to-yellow-600 text-xl text-white rounded-md font-bold gap-2 flex justify-center px-4 sm:px-4 md:px-8 lg:px-16 py-1.5 transition delay-150 ease-linear hover:bg-muted"
          >
            <Image
              src="/icons/google-slides.svg"
              alt="Google Slides icon"
              width={24}
              height={20}
            />
            <span>Google Slide</span>
          </a>
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-2 sm:mt-4 w-full md:w-3/4 lg:w-2/3">
        {template.description}
      </p>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {tags.map((tag, index) => (
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
        {related.map((t: Template) => (
          <Card
            key={t.id}
            id={t.id}
            title={t.title}
            rating={t.rating}
            downloads={String(t.downloads)}
            tags={(t.tags as string[]).slice(0, 2)}
            image={((t.images as string[])[0]) ?? "/image/placeholder.png"}
            canvaLink={t.canvaLink}
            pptLink={t.pptLink}
            slideLink={t.slideLink}
          />
        ))}
      </CardContainer>
    </div>
  );
};

export default Page;
