import React, { useState } from "react";
import type { UtilisateurDto } from "../utils/type";

type UserRoleFormProps = {
  user: UtilisateurDto;
  onSubmit: (userId: string, role: string) => void;
};

export const UserRoleForm: React.FC<UserRoleFormProps> = ({ user, onSubmit }) => {
  const [role, setRole] = useState(user.role);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(user._id, role);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="text-center mb-4 bg-gray-50 p-4 rounded-lg shadow-sm"
    >
      <h1 className="text-lg font-bold text-gray-800">{user.nom}</h1>
      <p className="text-gray-500 text-sm">{user.email}</p>
      <div className="flex items-center justify-center mt-4 mb-6">
        <label className="block text-gray-700 font-semibold mb-1">Rôle:</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 ml-2"
        >
          <option value="EMPLOYE">Employé</option>
          <option value="MANAGER">Manager</option>
        </select>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Valider
        </button>
      </div>
    </form>
  );
};
