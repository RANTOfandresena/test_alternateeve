// RouterEmploye.tsx
import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import HomeLayout from "../../components/layout/HomeLayout";
const Home = lazy(() => import("./Home"));
const Employer = lazy(() => import("./Employer"));
const Demande = lazy(() => import("./Demande"));
const Calendrier = lazy(() => import("./Calendrier"));
const Profil = lazy(() => import("./Profil"));
const Regle = lazy(() => import("./Regle"));

export default function RouterManager() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <Routes>
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<Home />} />
          <Route path="demande" element={<Demande />} />
          <Route path="calendrier" element={<Calendrier />} />
          <Route path="profil" element={<Profil />} />
          <Route path="regle" element={<Regle />} />
          <Route path="employers" element={<Employer />} />
          <Route path="*" element={<div>Page non trouvée</div>} />
        </Route>
      </Routes>
    </Suspense>
  );
}