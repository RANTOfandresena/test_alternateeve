// RouterEmploye.tsx
import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import HomeLayout from "../../components/layout/HomeLayout";
const Home = lazy(() => import("./Home"));

export default function RouterManager() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <Routes>
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </Suspense>
  );
}