import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import type { JSX } from "react/jsx-runtime";
const Home = lazy(() => import("./Home"));
const HomeLayout = lazy(() => import("../../components/layout/HomeLayout"));

export default function RouterEmploye(): JSX.Element {

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



