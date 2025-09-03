// Type definition for the page's props
interface OrderConfirmationPageProps {
  params: {
    orderId: string;
  };
}

export default function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  return (
    <div>
      <h1>Order Confirmed! ✅</h1>
      <p>Thank you for your purchase. Your Order ID is: <strong>{params.orderId}</strong></p>
    </div>
  );
}