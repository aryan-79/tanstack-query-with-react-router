import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router';
import routes, { arko_route } from './routes/router.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
  //NOTE: this runs on every error in useQuery
  queryCache: new QueryCache({
    onError: (error, query) => {
      console.log({ error, query });
    },
  }),
  mutationCache: new MutationCache({
    onSuccess: (_data, _vars, _ctx, mutation) => {
      //NOTE:use mutation key for cache invalidation
      queryClient.invalidateQueries({ queryKey: mutation.options.mutationKey });
    },
  }),
});

const r = createBrowserRouter([...routes(queryClient), ...arko_route]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={r} />
    </QueryClientProvider>
  </StrictMode>,
);
