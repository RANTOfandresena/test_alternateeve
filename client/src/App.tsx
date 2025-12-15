import { useAppDispatch, useAppSelector } from './hooks/hooks';
import { logout, changePage } from './features/authSlice';
import AppHeader from './components/AppHeader';
import AppRouter from './router';
import AppNav from './components/AppNav';

const App = () => {
  const dispatch = useAppDispatch();
  const { isLoggedIn, isPageManager , user } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {isLoggedIn && (
        <AppHeader
          roleUser={user?.user.role}
          isPageManager={isPageManager}
          isLoggedIn={isLoggedIn}
          userName={user?.user.nom}
          userEmail={user?.user.email}
          onLogout={() => dispatch(logout())}
          changePage={() => dispatch(changePage())}
        />
      )}

      <div className="flex flex-1 min-h-0">
        {isLoggedIn && (
          <AppNav
            isLoggedIn={isLoggedIn}
            roleUser={user?.user.role}
          />
        )}

        <main className="flex-1 p-4 overflow-auto" style={{ height: 'calc(100vh - 64px)' }}>
          <AppRouter />
        </main>
      </div>
    </div>
  );
};

export default App;