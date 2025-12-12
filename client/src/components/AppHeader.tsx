interface Props {
  brand?: string;
  subtitle?: string;
  isLoggedIn: boolean;
  userName?: string;
  userEmail?: string;
  onLogout?: () => void;
}

const AppHeader = ({
  brand = 'Alternateeve',
  subtitle = 'Gestion des congés',
  isLoggedIn,
  userName,
  userEmail,
  onLogout,
}: Props) => (
  <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shadow-sm">
    <div className="flex flex-col">
      <span className="text-lg font-bold leading-tight">{brand}</span>
      <span className="text-sm text-slate-200">{subtitle}</span>
    </div>
    {isLoggedIn && (
      <div className="flex items-center gap-3">
        <div className="flex flex-col text-right">
          <span className="font-semibold">{userName}</span>
          <span className="text-xs text-slate-200">{userEmail}</span>
        </div>
        <button
          className="border border-white/30 text-white px-3 py-2 rounded-lg text-sm hover:bg-white/10 transition"
          onClick={onLogout}
        >
          Se déconnecter
        </button>
      </div>
    )}
  </header>
);

export default AppHeader;

