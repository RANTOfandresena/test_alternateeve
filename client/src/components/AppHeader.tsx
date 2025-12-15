import React from 'react';
import { Link } from 'react-router-dom';

interface Props {
  brand?: string;
  subtitle?: string;
  roleUser?:string;
  isPageManager?: boolean;
  isLoggedIn: boolean;
  userName?: string;
  userEmail?: string;
  onLogout?: () => void;
  changePage?: () => void;
}

const AppHeader = ({
  brand = 'Alternateeve',
  subtitle = 'Gestion des congés',
  roleUser,
  isPageManager,
  isLoggedIn,
  userName,
  userEmail,
  onLogout,
  changePage,
}: Props) => (
    <header className="bg-white shadow-lg flex items-center justify-between px-6 py-4">
      {/* Logo / titre */}
      <div className="flex flex-col">
        <span className="text-xl font-bold text-slate-900">{brand}</span>
        {subtitle && <span className="text-sm text-slate-500">{subtitle}</span>}
      </div>

      {isLoggedIn && (
        <div className="flex items-center gap-4">
          {/* infos utilisateur */}
          <div className="flex flex-col text-right">
            <span className="font-medium text-slate-900">{userName}</span>
            <span className="text-xs text-slate-500">{userEmail}</span>
          </div>

          {/* bouton page manager */}
          {roleUser === "MANAGER" && changePage && (
            <button
              className="flex items-center gap-1 border border-slate-300 text-slate-700 px-3 py-2 rounded-lg text-sm hover:bg-slate-100 transition"
              onClick={changePage}
            >
              Aller à ma page {isPageManager ? "utilisateur" : "admin"}
            </button>
          )}

          {/* bouton logout */}
          {onLogout && (
            <button
              className="border border-slate-300 text-slate-700 px-3 py-2 rounded-lg text-sm hover:bg-slate-100 transition"
              onClick={onLogout}
            >
              Se déconnecter
            </button>
          )}
        </div>
      )}
    </header>
);

export default AppHeader;


