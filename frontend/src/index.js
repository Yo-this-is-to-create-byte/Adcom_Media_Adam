import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/index.css";
import App from "@/App";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

const container = document.getElementById("root");
const app = (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);

if (container?.dataset.prerendered === "true") {
  hydrateRoot(container, app, {
    onRecoverableError(error) {
      console.warn("ADCOM_HYDRATION", error);
    },
  });
} else {
  createRoot(container).render(app);
}
