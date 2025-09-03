// Type definition for the page's props, including searchParams
interface SearchPageProps {
  searchParams: {
    q?: string; // Search query can be undefined
  };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '...';

  return (
    <div>
      <h1>Search Results</h1>
      <p>Showing results for: <strong>{query}</strong></p>
    </div>
  );
}