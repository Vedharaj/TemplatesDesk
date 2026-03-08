interface PageProps {
  params: Promise<{
    name: string;
  }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { name } = await params;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold capitalize">
        {decodeURIComponent(name)}
      </h1>
    </div>
  );
}