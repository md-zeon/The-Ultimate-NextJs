// Type definition for the page's props
interface ProductDetailsPageProps {
  params: {
    productId: string; // The dynamic segment is always a string
  };
}

export default function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  return (
    <div>
      <h1>Product Details</h1>
      <p>Displaying information for Product ID: <strong>{params.productId}</strong></p>
    </div>
  );
}