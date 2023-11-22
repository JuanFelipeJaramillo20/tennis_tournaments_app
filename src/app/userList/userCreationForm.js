import { useState, useEffect } from 'react';
import axios from 'axios';

export default function UserForm({ onUserCreated, onUpdate, selectedUser, setSelectedUser }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user.id;
      if (selectedUser) {
        const response = await axios.put(`/api/users/${selectedUser.id}`, {
          name,
          email,
          role,
          password
        });

        onUpdate(response.data.user);
      } else {
        const response = await axios.post('/api/users', {
            name,
            email,
            role,
            password
        });

        onTournamentCreated(response.data.user);
      }
    } catch (error) {
      console.error('Error creating or updating tournament:', error.message);
    }
  };

  useEffect(() => {
    if (selectedUser) {
      setName(selectedUser.name);
      setEmail(selectedUser.email);
      setPassword(selectedUser.password);
      setRole(selectedUser.role);
    }
  }, [selectedUser]);

  const handleClear = () => {
    setSelectedUser(null);
    setName('');
    setEmail('');
    setPassword('');
    setRole('');
  }

  return (
    <div className='container'>
      <h2>Crear/Actualizar Usuario</h2>
      <form onSubmit={handleSubmit}>
      <div className="mb-3">
          <label htmlFor="userName" className="form-label">Nopmbres</label>
          <input
            type="text"
            className="form-control"
            id="userName"
            placeholder="Enter user name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="userEmail" className="form-label">Email</label>
          <input
            type="text"
            className="form-control"
            id="userEmail"
            placeholder="Enter user email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="role" className="form-label">Rol</label>
          <select
            className="form-control"
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="admin" disabled>Administrador</option>
            <option value="regular">Usuario Regular</option>
            </select>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Crear/Actualizar Usuario</button>
        <button type="button" onClick={handleClear}>Limpiar / Eliminar selección</button>
      </form>
    </div>
  );
}
