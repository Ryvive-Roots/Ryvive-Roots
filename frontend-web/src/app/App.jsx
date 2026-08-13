import { useState, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import PageLoader from "./components/PageLoader";

export default function App() {
  const [initialLoading, setInitialLoading] = useState(true);

 useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 2600); // was 1400
    return () => clearTimeout(timer);
}, []);

  return (
    <>
      <PageLoader isLoading={initialLoading} />
      <RouterProvider router={router} />
    </>
  );
}