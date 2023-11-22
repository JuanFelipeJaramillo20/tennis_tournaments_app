"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import UserCreationForm from "./userCreationForm";
export default function UserList() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user && user.role === "admin";

  const fetchData = async () => {
    const response = await axios.get("/api/users");
    setUsers(response.data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = async (user) => {
    setSelectedUser(user);
  };

  const handleDeleteClick = async (id) => {
    try {
      const response = await axios.delete(`/api/users/${id}`);
      setUsers((prevTournaments) =>
        prevTournaments.filter((tournament) => tournament.id !== id)
      );
    } catch (error) {
      console.error("Error deleting user:", error.message);
    }
  };

  const handleUserCreated = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };

  const handleUserUpdate = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((User) => (User.id === updatedUser.id ? updatedUser : User))
    );
    setSelectedUser(null);
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center flex-column mt-5">
      {isAdmin ? (
        <>
          <h1>Lista de Usuarios</h1>
          <UserCreationForm
            onUserCreated={handleUserCreated}
            onUpdate={handleUserUpdate}
            selectedUser={selectedUser}
          />
          <table className="table table-striped mt-5 w-75">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                {isAdmin && <th>Opciones</th>}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  {isAdmin && (
                    <>
                      <td>
                        <button
                          className="btn btn-primary me-2"
                          onClick={() => handleEditClick(user)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleDeleteClick(user.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <div>No deberías estar aquí!</div>
      )}
    </div>
  );
}
