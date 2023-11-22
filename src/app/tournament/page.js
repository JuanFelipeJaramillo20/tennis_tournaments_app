"use client";
import { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import TournamentForm from "./tournamentCreationForm";
import axios from "axios";
import SuccessAlert from "../components/SuccessAlert";
import ErrorAlert from "../components/ErrorAlert";

export default function TournamentList() {
  const [tournaments, setTournaments] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const [selectedTournament, setSelectedTournament] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user && user.role == "admin";
  const fetchData = async () => {
    const data = await axios.get("/api/tournaments");
    setTournaments(data.data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTournamentCreated = (newTournament) => {
    setTournaments((prevTournaments) => [...prevTournaments, newTournament]);
  };

  const handleTournamentUpdate = (updatedTournament) => {
    setTournaments((prevTournaments) =>
      prevTournaments.map((tournament) =>
        tournament.id === updatedTournament.id ? updatedTournament : tournament
      )
    );
    setSelectedTournament(null);
  };

  const handleEditClick = (tournament) => {
    setSelectedTournament(tournament);
  };

  const handleDeleteClick = async (id) => {
    try {
      const response = await axios.delete(`/api/tournaments/${id}`);
      setTournaments((prevTournaments) =>
        prevTournaments.filter((tournament) => tournament.id !== id)
      );
    } catch (error) {
      console.error("Error deleting tournament:", error.message);
    }
  };

  const handleInspect = async (id) => {
    try {
      const tournament = await axios.get(`/api/tournaments/${id}`);
      setParticipants(tournament.data.object.participants);
      setShowParticipants(!showParticipants);
    } catch (error) {
      console.error(error);
    }
  };

  const joinTournament = async (id) => {
    try {
      const response = await axios.put(`/api/tournaments/${id}`, {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        type: "add player",
      });
    } catch (error) {
      console.error("Error adding player to tournament:", error);
    }
  };

  const handleTransaction = async () => {
    const response = await axios.post("/api/api/checkout");
    const data = response.data;
    return data.id;
  };

  const handleApprovedTransaction = (data, actions, id) => {
    actions.order.capture();
    joinTournament(id);
    setShowSuccessAlert(true);
  };

  useEffect(() => {
    let timeout;
    if (showSuccessAlert) {
      timeout = setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [showSuccessAlert]);

  const handleCancelledTransaction = (data) => {
    setShowErrorAlert(true);
  };

  useEffect(() => {
    let timeout;
    if (showErrorAlert) {
      timeout = setTimeout(() => {
        setShowErrorAlert(false);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [showErrorAlert]);

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center flex-column mt-5">
      {user ? (
        <>
        {showSuccessAlert && <SuccessAlert msg="Transacción Aprobada!" />}
        {showErrorAlert && <ErrorAlert msg="Transacción Cancelada!" />}
          <h1>Lista de Torneos</h1>
          {isAdmin && (
            <TournamentForm
              onTournamentCreated={handleTournamentCreated}
              onUpdate={handleTournamentUpdate}
              selectedTournament={selectedTournament}
              setSelectedTournament={setSelectedTournament}
            />
          )}
          <table className="table table-striped mt-5 w-75">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Sitio</th>
                <th>Fecha</th>
                {isAdmin && <th>Opciones</th>}
                <th>Participantes</th>
                <th>Inscribirse - ($100 cuota)</th>
              </tr>
            </thead>
            <tbody>
              {tournaments.map((tournament) => (
                <tr key={tournament.id}>
                  <td>{tournament.name}</td>
                  <td>{tournament.description}</td>
                  <td>{tournament.location}</td>
                  <td>{tournament.date.toString()}</td>
                  {isAdmin && (
                    <td>
                      <button onClick={() => handleEditClick(tournament)}>
                        Editar
                      </button>
                      <button onClick={() => handleDeleteClick(tournament.id)}>
                        Eliminar
                      </button>
                    </td>
                  )}
                  <td>
                    <button onClick={() => handleInspect(tournament.id)} className="btn btn-info">
                     Ver Participantes
                    </button>
                  </td>
                  <td>
                    {!tournament.participants?.some(
                      (participant) => participant.email === user.email
                    ) ? (
                      <PayPalScriptProvider
                        options={{
                          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
                        }}
                      >
                        <PayPalButtons
                          createOrder={handleTransaction}
                          onApprove={(data, actions) => {
                            handleApprovedTransaction(data, actions, tournament.id);
                          }}
                          onCancel={(data) => {
                            handleCancelledTransaction(data);
                          }}
                          style={{ layout: "horizontal" }}
                        />
                      </PayPalScriptProvider>
                    ) : (
                      "Inscrito"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {showParticipants && (
            <table className="table table-striped mt-5 w-75">
              <thead>
                <tr>
                  <th>Nombre</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((participant) => (
                  <tr key={participant.id}>
                    <td>{participant.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      ) : (
        <div>No deberías estar aquí!</div>
      )}
    </div>
  );
}
