
import { useAppDispatch, useAppSelector } from './hooks/hooks';
import { logout, changePage } from './features/authSlice';
import AppHeader from './components/AppHeader';
import AppRouter from './router';

const App = () => {
  const dispatch = useAppDispatch();
  const { isLoggedIn, isPageManager , user } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <AppHeader
        roleUser={user?.user.role}
        isPageManager={isPageManager} 
        isLoggedIn={isLoggedIn}
        userName={user?.user.nom}
        userEmail={user?.user.email}
        onLogout={() => dispatch(logout())}
        changePage={() => dispatch(changePage())}
      />

      <main className="flex-1">
        <AppRouter />
      </main>
    </div>
  );
};

export default App;