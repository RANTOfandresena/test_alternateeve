import React, { Suspense } from 'react';
import AppHeader from '../AppHeader';
import AppNav from '../AppNav';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { logout, changePage } from '../../features/authSlice';
import { Outlet } from 'react-router-dom';
import PageLoader from '../elements/PageLoader';


const HomeLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoggedIn, isPageManager , user } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <AppHeader
        isLoggedIn={isLoggedIn}
        userName={user?.user?.nom}
        userEmail={user?.user?.email}
        onLogout={() => dispatch(logout())}
      />

      <div className="flex flex-1 min-h-0">
        <AppNav 
            isLoggedIn={isLoggedIn} 
            roleUser={user?.user?.role}
            isPageManager={isPageManager}
            changePage={() => dispatch(changePage())}
        />

        <main className="flex-1 p-4 overflow-auto">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default HomeLayout;