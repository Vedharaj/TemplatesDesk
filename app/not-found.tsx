import Image from "next/image";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col items-center gap-6 px-4 py-16 sm:py-24 lg:flex-row lg:flex-nowrap lg:items-center lg:justify-between">
      <Image
        src="/image/inside-out-cry.png"
        alt="Page not found"
        width={300}
        height={200}
        // sizes="(max-width: 500px) 90vw, 400px"
        // className="h-auto w-full max-w-sm select-none"
        className="h-auto w-full max-w-75 shrink-0"
        priority
      />
      <div className="w-full max-w-xl flex flex-col gap-2">
        <p className="text-4xl uppercase sm:text-5xl">AWW... Dont worry!</p>
        <p>It&apos;s just a 404 Error!</p>
        <p>What you&apos;re looking for may have been misplaced in Long Term Memory.</p>
      </div>
    </main>
  );
}
