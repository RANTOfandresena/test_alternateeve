import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import type { JSX } from "react/jsx-runtime";
const Home = lazy(() => import("./Home"));
const HomeLayout = lazy(() => import("../../components/layout/HomeLayout"));
const Demande = lazy(() => import("./Demande"));
const Calendrier = lazy(() => import("./Calendrier"));
const Profil = lazy(() => import("./Profil"));
const Regle = lazy(() => import("./Regle"));

export default function RouterEmploye(): JSX.Element {

    return (
        <Suspense fallback={<div>Chargement...</div>}>
            <Routes>
                <Route path="/" element={<HomeLayout />}>
                    <Route index element={<Home />} />
                    <Route path="demande" element={<Demande />} />
                    <Route path="calendrier" element={<Calendrier />} />
                    <Route path="profil" element={<Profil />} />
                    <Route path="regle" element={<Regle />} />
                    <Route path="*" element={<div>Page non trouvée</div>} />
                </Route>
            </Routes>
        </Suspense>
    );
}



