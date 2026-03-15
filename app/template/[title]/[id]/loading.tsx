const TemplateDetailLoading = () => {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-8 sm:px-6 lg:px-8">
      <div className="h-8 w-2/3 rounded bg-gray-200" />
      <div className="mt-2 h-5 w-32 rounded bg-gray-200" />

      <div className="mt-4 flex flex-col gap-6 md:flex-row">
        <div className="w-full grow space-y-4">
          <div className="h-64 w-full rounded-md bg-gray-200 sm:h-80 lg:h-[26rem]" />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex">
            <div className="h-12 w-full rounded-md bg-gray-200 lg:w-36" />
            <div className="h-12 w-full rounded-md bg-gray-200 lg:w-36" />
            <div className="h-12 w-full rounded-md bg-gray-200 lg:w-44" />
          </div>
        </div>

        <div className="w-full rounded-md border border-gray-200 p-4 md:w-80">
          <div className="mb-3 h-5 w-24 rounded bg-gray-200" />
          <div className="space-y-3">
            <div className="h-12 w-full rounded-md bg-gray-200" />
            <div className="h-12 w-full rounded-md bg-gray-200" />
            <div className="h-12 w-full rounded-md bg-gray-200" />
          </div>
        </div>
      </div>

      <div className="mt-5 h-4 w-5/6 rounded bg-gray-200" />
      <div className="mt-2 h-4 w-4/6 rounded bg-gray-200" />

      <div className="mt-10">
        <div className="mb-4 h-6 w-48 rounded bg-gray-200" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-md border border-gray-100">
              <div className="h-40 w-full bg-gray-200 sm:h-48 lg:h-60" />
              <div className="space-y-2 p-3">
                <div className="h-4 w-3/4 rounded bg-gray-200" />
                <div className="h-4 w-1/2 rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplateDetailLoading;
