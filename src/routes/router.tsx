import { type QueryClient } from '@tanstack/react-query';
import { Home, loader } from './home';
import { useRouteError } from 'react-router';
import type { RouteObject } from 'react-router';

const routes = (queryClient: QueryClient) =>
  [
    {
      path: ':page/:size',
      loader: loader(queryClient),
      Component: Home,
      errorElement: <ErrorElement />,
    },
  ] satisfies RouteObject[];

export const arko_route = [
  {
    index: true,
    element: <div>Hello from home</div>,
  },
] satisfies RouteObject[];

function ErrorElement() {
  const error = useRouteError();
  return (
    <pre>
      <code>{JSON.stringify(error, null, 2)}</code>
    </pre>
  );
}

export default routes;
