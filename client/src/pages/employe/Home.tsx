import DemandeCongeForm from '../../components/DemandeCongeForm';
import DemandeCongeList from '../../components/DemandeCongeList';
import { useAppSelector } from '../../hooks/hooks';

const HomePage = () => {
  const { isPageManager, user } = useAppSelector((state) => state.auth);

  return (
    <div className="px-4 py-10 md:py-14 bg-linear-to-b from-slate-50 to-slate-100 min-h-full">
      <div className="max-w-5xl mx-auto space-y-10">
        <section className="bg-white rounded-2xl shadow-2xl shadow-slate-200/80 p-8">
          <p className="text-sm text-blue-600 font-semibold uppercase tracking-wide">Bienvenue</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
            Bonjour {user?.user.nom ?? 'cher collaborateur'},
          </h1>
          <p className="mt-3 text-slate-700 text-base max-w-2xl">
            Gérez vos congés en toute simplicité : créez vos demandes, suivez leur validation
            et gardez une trace claire de vos absences à venir.
          </p>
        </section>

        <section className="flex justify-center">
          <DemandeCongeForm />
        </section>

        <section className="flex justify-center">
          <DemandeCongeList />
        </section>
      </div>
    </div>
  );
};

export default HomePage;

