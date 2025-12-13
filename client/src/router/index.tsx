import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/Login';
import RegisterPage from '../pages/Register';
import HomePageEmploye from '../pages/employe/Home';
import HomePageManager from '../pages/manager/Home';
import { useAppSelector } from '../hooks/hooks';
import RouteGuard from '../components/RouteGuard';

const AppRouter = () => {
  const { isLoggedIn,isPageManager } = useAppSelector((state) => state.auth);

  return (
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
            <LoginPage />
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
  );
};

export default AppRouter;