import { useAppSelector } from "../../hooks/hooks";
import PageLoader from "../../components/elements/PageLoader";

const Profil = () => {
    const { user } = useAppSelector((state) => state.auth);
    
    if (!user) {
        return <PageLoader />;
    }
    
    return (
        <div className="min-h-0 bg-gray-50 py-10 px-4">
            <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg flex flex-col items-center space-y-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-500 shadow-md">
                    <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.user.nom)}&background=4F46E5&color=fff&size=128`}
                        alt={`${user.user.nom} avatar`}
                        className="w-full h-full object-cover"
                    />
                </div>
                
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">{user.user.nom}</h2>
                    <p className="text-indigo-600 capitalize font-medium mt-1">{user.user.role}</p>
                </div>
                
                {/* Informations */}
                <div className="w-full mt-6 space-y-3">
                    <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-600">Email</span>
                        <span className="text-gray-800 text-sm">{user.user.email}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profil;