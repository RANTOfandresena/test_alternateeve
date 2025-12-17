import { NavLink } from "react-router-dom";
import { Home, User, Calendar, Users, Settings, RefreshCw } from "lucide-react";



type Props = {
  isLoggedIn: boolean;
  isPageManager: boolean;
  roleUser?: string;
  changePage?: () => void;
};

const AppNav: React.FC<Props> = ({ isLoggedIn, isPageManager, roleUser, changePage }) => {
  if (!isLoggedIn) return null;

  const type = isPageManager ? "manager" : "employe";

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition
     ${isActive
       ? "bg-blue-600 text-white shadow"
       : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
     }`;

  return (
    <aside className="w-64 bg-white shadow-lg flex-shrink-0 flex flex-col">
      <nav className="flex flex-col flex-1 p-4">
        <div className="space-y-1">
          <NavLink to={`/${type}/`} end className={linkClass}>
            <Home size={18} />
            Accueil
          </NavLink>

          <NavLink to={`/${type}/demande`} className={linkClass}>
            <User size={18} />
            Demande
          </NavLink>

          <NavLink to={`/${type}/calendrier`} className={linkClass}>
            <Calendar size={18} />
            Calendrier
          </NavLink>

          {isPageManager && (
            <NavLink to="/manager/employers" className={linkClass}>
              <Users size={18} />
              Employés
            </NavLink>
          )}

          <NavLink to={`/${type}/profil`} className={linkClass}>
            <User size={18} />
            Profil
          </NavLink>

          <NavLink to={`/${type}/regle`} className={linkClass}>
            <Settings size={18} />
            Règles de congé
          </NavLink>
        </div>

        
        <div className="mt-auto">
          <div className="border-t border-slate-300 my-6" />
          <div className="space-y-1">
            <p className="px-4 text-xl font-semibold text-slate-400 uppercase">
              {!isPageManager ? "EMPLOYER" : "MANAGER"}
            </p>
            {roleUser === "MANAGER" && (
              <button
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-medium transition text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                onClick={changePage}
              >
                <RefreshCw size={18} /> Aller à ma page {isPageManager ? "Employe" : "Manager"}
              </button>
            )}
          </div>
        </div>
      </nav>
    </aside>
  );
};
export default AppNav;