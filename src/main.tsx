import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import React from "react";
import Dashboard from "./components/dashboard/dashboard";
import Home from "./components/home/home";
import { QueryClient, QueryClientProvider } from "react-query";
import { ROUTES } from "./shared/constants";
import { Provider } from "jotai";
const router = createBrowserRouter([
  {
    path: ROUTES.ROOT,
    element: <Home />,
  },
  {
    path: ROUTES.DASHBOARD,
    element: <Dashboard />,
  },
]);
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider>
        <RouterProvider router={router} />
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
);
