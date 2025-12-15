import { NavLink } from "react-router-dom";
import { Home, User, Shield } from "lucide-react";

type Props = {
  isLoggedIn: boolean;
  roleUser?: string;
};

const AppNav: React.FC<Props> = ({ isLoggedIn, roleUser }) => {
  if (!isLoggedIn) return null;

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition
     ${isActive
       ? "bg-blue-600 text-white shadow"
       : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
     }`;

  return (
    <aside className="w-64 bg-white shadow-lg flex-shrink-0 flex flex-col">
      <nav className="flex flex-col flex-1 p-4">
        {/* Section principale */}
        <div className="space-y-1">
          <NavLink to="/" className={linkClass}>
            <Home size={18} />
            Accueil
          </NavLink>

          <NavLink to="/profil" className={linkClass}>
            <User size={18} />
            Profil
          </NavLink>
        </div>

        {/* Séparateur et section admin */}
        {roleUser === "ADMIN" && (
          <div className="mt-auto"> {/* pousse admin en bas si tu veux */}
            <div className="border-t my-6" />

            <div className="space-y-1">
              <p className="px-4 text-xs font-semibold text-slate-400 uppercase">
                Administration
              </p>

              <NavLink to="/admin" className={linkClass}>
                <Shield size={18} />
                Admin
              </NavLink>
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default AppNav;