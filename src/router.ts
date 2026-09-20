import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { QueryClient } from '@tanstack/react-query';

export function getRouter() {
const queryClient = new QueryClient({
defaultOptions: {
  queries: {
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  },
},
});

return createRouter({
routeTree,
defaultPreload: false,
context: {
  queryClient,
},
});
}

declare module '@tanstack/react-router' {
interface Register {
router: ReturnType<typeof getRouter>;
}
}
