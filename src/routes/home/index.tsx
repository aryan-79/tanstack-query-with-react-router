import { QueryClient, queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { useLoaderData } from 'react-router';
import { type LoaderFunctionArgs } from 'react-router';

interface Trip {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  fileName: string;
  pricing: {
    price: number;
    currency: string;
  };
  perks: {
    freeCancellation: boolean;
    payLater: boolean;
  };
  facilities: Array<{ _id: string; title: string; description: string }>;
  itinerary: Array<{ _id: string; title: string; description: string }>;
  createdAt: string;
  updatedAt: string;
  destination: {
    city: string;
    country: string;
  };
}

interface IRes {
  trips: Trip[];
  count: number;
  total: number;
  totalPages: number;
}

const query = (page = '0', size = '10') =>
  queryOptions({
    queryKey: ['trips', page, size],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('size', size);

      const baseUrl = new URL('http://localhost:8080/api/trips');
      const url = `${baseUrl}?${params.toString()}`;

      console.log('url', url);

      const res = await fetch(url, {
        method: 'GET',
      });
      if (!res.ok) throw Error('fetch error');

      const data = (await res.json()) as IRes;
      return data;
    },
  });

export const loader =
  (queryClient: QueryClient) =>
  //NOTE: this params is for path params only.
  async ({ request, params }: LoaderFunctionArgs) => {
    //NOTE: To get serach params
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    console.log({ request: request.url, params, searchParams: searchParams });
    await queryClient.ensureQueryData(query(params.page, params.size));
    return { params };
  };

export function Home() {
  const { params } = useLoaderData() as Awaited<ReturnType<ReturnType<typeof loader>>>;
  const { data } = useSuspenseQuery(query(params.page, params.size));
  return (
    <pre>
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
  );
}
