import React, { Suspense } from 'react';
import AppHeader from '../AppHeader';
import AppNav from '../AppNav';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { logout, changePage } from '../../features/authSlice';
import { Outlet } from 'react-router-dom';
import PageLoader from '../elements/PageLoader';

const HomeLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoggedIn, isPageManager, user } = useAppSelector((state) => state.auth);

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900">
      {/* Header fixe */}
      <AppHeader
        isLoggedIn={isLoggedIn}
        userName={user?.user?.nom}
        userEmail={user?.user?.email}
        onLogout={() => dispatch(logout())}
      />

      <div className="flex flex-1 min-h-0">
        {/* Navigation fixe */}
        <AppNav
          isLoggedIn={isLoggedIn}
          roleUser={user?.user?.role}
          isPageManager={isPageManager}
          changePage={() => dispatch(changePage())}
        />

        {/* Contenu scrollable */}
        <main className="flex-1 overflow-auto min-h-0 p-4">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default HomeLayout;