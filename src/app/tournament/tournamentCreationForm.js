import { useState, useEffect } from 'react';
import axios from 'axios';

export default function TournamentForm({ onTournamentCreated, onUpdate, selectedTournament, setSelectedTournament }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user.id;
      const formattedDate = (new Date(date)).toISOString();
      if (selectedTournament) {
        const response = await axios.put(`/api/tournaments/${selectedTournament.id}`, {
          name,
          description,
          location,
          date: formattedDate,
          userId
        });

        onUpdate(response.data.tournament);
      } else {
        const response = await axios.post('/api/tournaments', {
          name,
          description,
          location,
          date: formattedDate,
          userId
        });

        onTournamentCreated(response.data.tournament);
      }
    } catch (error) {
      console.error('Error creating or updating tournament:', error.message);
    }
  };

  useEffect(() => {
    if (selectedTournament) {
      setName(selectedTournament.name);
      setDescription(selectedTournament.description);
      setLocation(selectedTournament.location);
      const formattedDate = new Date(selectedTournament.date).toISOString().substring(0, 10);
      setDate(formattedDate);
    }
  }, [selectedTournament]);

  const handleClear = () => {
    setName("");
      setDescription("");
      setLocation("");
      setDate("");
      setSelectedTournament(null);
  }

  return (
    <div className="container">
      <h2>Crear/Actualizar Torneo</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="tournamentName" className="form-label">Nombre del torneo</label>
          <input
            type="text"
            className="form-control"
            id="tournamentName"
            placeholder="Ingrese el nombre del torneo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="tournamentDescription" className="form-label">Descripción del torneo</label>
          <textarea
            className="form-control"
            id="tournamentDescription"
            placeholder="Ingrese la descripción del torneo"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="tournamentLocation" className="form-label">Sitio del torneo</label>
          <input
            type="text"
            className="form-control"
            id="tournamentLocation"
            placeholder="Ingrese el sitio del torneo"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="tournamentDate" className="form-label">Fecha del torneo</label>
          <input
            type="date"
            className="form-control"
            id="tournamentDate"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Crear/Actualizar Torneo
        </button>
        <button type="button" className="btn btn-secondary ms-3" onClick={handleClear}>
          Limpiar / Eliminar selección
        </button>
      </form>
    </div>
  );
}
