const TypeNameLoading = () => {
  return (
    <div className="animate-pulse">
      <div className="h-56 w-full bg-gray-200" />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="h-8 w-72 rounded bg-gray-200" />
          <div className="h-10 w-28 rounded-md bg-gray-200" />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-md border border-gray-100">
              <div className="h-40 w-full bg-gray-200 sm:h-48 lg:h-60" />
              <div className="space-y-2 p-3">
                <div className="h-4 w-3/4 rounded bg-gray-200" />
                <div className="h-4 w-1/2 rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-8 w-10 rounded-md bg-gray-200" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TypeNameLoading;
