import { useAppSelector } from './hooks/hooks';
import { Navigate, Route, Routes } from 'react-router-dom';
import RouteGuard from './components/RouteGuard';
import { Suspense, lazy } from 'react';

const RegisterPage = lazy(() => import('./pages/Register'));
const HomePageEmploye = lazy(() => import('./pages/employe/RouterEmploye'));
const HomePageManager = lazy(() => import('./pages/manager/RouterManager'));
const GoogleAuth = lazy(() => import('./pages/GoogleAuth'));

const App = () => {
  const { isLoggedIn, isPageManager } = useAppSelector((state) => state.auth);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route
          path="/"
          element={
            <RouteGuard isAllowed={isLoggedIn} redirectTo="/login">
              <Navigate to={isPageManager ? "/manager" : "/employe"} replace />
            </RouteGuard>
          }
        />

        <Route
          path="/manager"
          element={
            <RouteGuard isAllowed={isLoggedIn && isPageManager} redirectTo="/">
              <HomePageManager />
            </RouteGuard>
          }
        />

        <Route
          path="/employe"
          element={
            <RouteGuard isAllowed={isLoggedIn && !isPageManager} redirectTo="/">
              <HomePageEmploye />
            </RouteGuard>
          }
        />

        <Route path="/home" element={<Navigate to="/" replace />} />

        <Route
          path="/login"
          element={
            <RouteGuard isAllowed={!isLoggedIn} redirectTo="/">
              <GoogleAuth />
            </RouteGuard>
          }
        />

        <Route
          path="/register"
          element={
            <RouteGuard isAllowed={!isLoggedIn} redirectTo="/">
              <RegisterPage />
            </RouteGuard>
          }
        />

        <Route path="*" element={<Navigate to={isLoggedIn ? '/' : '/login'} replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;