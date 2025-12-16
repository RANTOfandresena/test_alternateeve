import type { UtilisateurDto } from "../utils/type";

type UserRoleFormProps = {
  user: UtilisateurDto;
};


const ProfilUser: React.FC<UserRoleFormProps> = ({ user }) => {
    return (
        <div>
            {JSON.stringify(user)}
        </div>
    )
}
export default ProfilUser;