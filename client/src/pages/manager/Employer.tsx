import { useEffect, useState } from "react";
import { Repeat, User, UserPlus } from "lucide-react";
import { getAllUsers, updateUserRole, updateUtilisateur, type UpdateUtilisateurDto } from "../../api/utilisateur/utilisateur";
import { DataTable } from "../../components/elements/DataTable";
import type { UtilisateurDto } from "../../utils/type";
import Modal from "../../components/elements/Modal";
import { UserRoleForm } from "../../components/UserRoleForm";
import ProfilUser from "../ProfilUser";
import UtilisateurModal from "../../components/UtilisateurModal";

type Column<T> = {
  key: keyof T | "action";
  label: string;
  render?: (row: T) => React.ReactNode; 
};

const Employer = () => {
  const [data, setData] = useState<UtilisateurDto[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isActiveFilter, setIsActiveFilter] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UtilisateurDto | null>(null);

  const handleApproveClick = (user: UtilisateurDto) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleRoleSubmit = async (userId: string, role: string) => {
    try {
      await updateUserRole(userId, role);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rôle utilisateur", error);
    }finally {
      setModalOpen(false);
      fetchUsers(page, isActiveFilter);
    }
    
  };
  const handeUpdate = async (data : UpdateUtilisateurDto) =>{
    if(!selectedUser?._id) return
    try{
      setLoading(true)
      await updateUtilisateur(selectedUser?._id, data)
      fetchUsers(page, isActiveFilter)
    } catch(e){
      console.log(e)
    }finally{
      setLoading(false)
    }
  }


  const fetchUsers = async (page: number, isActive?: boolean) => {
    setLoading(true);
    try {
      const result = await getAllUsers({ page, limit: 5, isActive });
      setData(result.data);
      setTotalPages(result.pagination.totalPages);
    } finally {
      setLoading(false);
    }
  };
  const handleViewProfile = (user: UtilisateurDto) => {
    setSelectedUser(user);
    setModalOpen(true);
  }

  useEffect(() => {
    fetchUsers(page, isActiveFilter);
  }, [page, isActiveFilter]);

  const columns: Column<UtilisateurDto>[] = isActiveFilter
    ? [
        { key: "nom", label: "Nom" },
        { key: "email", label: "Email" },
        { key: "role", label: "Rôle" },
        { key: "soldeConge", label: "solde de congé (jour(s))"}
      ]
    : [
        { key: "nom", label: "Nom" },
        { key: "email", label: "Email" },
        {
          key: "action",
          label: "Action",
          render: (user: UtilisateurDto) => (
            <button
              className="px-3 py-1 bg-green-500 text-white rounded"
              onClick={() => handleApproveClick(user)}
            >
              Approuver
            </button>
          )
        }
      ];

  return (
    <div className="p-6">
      <UtilisateurModal
        open={modalOpen}
        utilisateur={selectedUser}
        onClose={() => setModalOpen(false)}
        onSave={handeUpdate}
      />
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Employés</h1>
        <button
          className="flex items-center px-4 py-1 rounded bg-gray-200"
          onClick={() => setIsActiveFilter(prev => !prev)}
        >
          <Repeat className="w-5 h-5 mr-2" />
          {isActiveFilter ? "demandes en attente" : "liste des Employés"}
          {isActiveFilter ? <UserPlus className="p-1 w-5 h-5 mr-2" /> : <User className="p-1 w-5 h-5 mr-2" />}
        </button>
      </div>

      <h1 className="text-xl font-bold">{!isActiveFilter ? "Demandes en attente" : "Liste des Employés"}</h1>

      <DataTable
        data={data}
        columns={columns}
        page={page}
        totalPages={totalPages}
        loading={loading}
        onPageChange={setPage}
        onClickLigne={handleViewProfile}
      />
    </div>
  );
};

export default Employer;