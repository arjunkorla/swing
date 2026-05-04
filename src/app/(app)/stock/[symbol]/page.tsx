import { StockDetail } from '../../../pages/StockDetail';

export default async function Page({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  return <StockDetail symbol={symbol} />;
}
