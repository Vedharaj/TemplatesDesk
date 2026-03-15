const HomeLoading = () => {
  return (
    <div className="animate-pulse">
      <div className="h-56 w-full bg-gray-200" />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 h-10 w-full rounded-md bg-gray-200" />

        {Array.from({ length: 4 }).map((_, sectionIndex) => (
          <section key={sectionIndex} className="mb-10">
            <div className="mb-4 h-6 w-56 rounded bg-gray-200" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((__, cardIndex) => (
                <div key={cardIndex} className="overflow-hidden rounded-md border border-gray-100">
                  <div className="h-40 w-full bg-gray-200 sm:h-48 lg:h-60" />
                  <div className="space-y-2 p-3">
                    <div className="h-4 w-3/4 rounded bg-gray-200" />
                    <div className="h-4 w-1/2 rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default HomeLoading;
