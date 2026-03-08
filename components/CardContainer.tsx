
import { ReactNode } from 'react';
import Link from "next/link"

interface CardContainerProps {
  children: ReactNode;
  title: string;
}

const CardContainer = ({ children, title }: CardContainerProps) => {
  return (
    <div className='mt-4 sm:mt-8 px-4 sm:px-12'>
      <div className="flex justify-between">
      <span className="text-2xl font-bold capitalize">{title}</span>
      <Link href={"/categories/" + title} className="text-primary underline">view more</Link>
      </div>
      <div className='flex gap-3 w-full overflow-x-auto overflow-y-hidden scroll-smooth py-4 [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden'>
        {children}
      </div>
    </div>
  )
}

export default CardContainer