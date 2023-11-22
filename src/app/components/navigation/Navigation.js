'use client'
import Link from "next/link";
import logo from "../../../../public/logo.png";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
const links = [
  {
    label: "Torneos",
    route: "/tournament",
  },
  {
    label: "Usuarios",
    route: "/userList",
    showOnlyWhenAdmin: true,
  },
  {
    label: "Iniciar Sesión",
    route: "/login",
    showOnlyWhenNotLoggedIn: true,
  },
  {
    label: "Registrarse",
    route: "/register",
    showOnlyWhenNotLoggedIn: true,
  },
];
export default function Nagivation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Add an event listener for the custom event 
    window.addEventListener('userLoggedIn', (event) => {
      const user = event.detail.user;
      setUser(user);
      setIsLoggedIn(true);
      console.log("I LISTENED TO AN EVENT", user);
    });

    window.addEventListener('userLoggedInFromGoogle', (event) => {
      const user = event.detail.user;
      setUser(user);
      setIsLoggedIn(true);
      console.log("I LISTENED TO AN EVENT FROM GOOGLE AUTH", user);
    });

  }, []);

   const handleLogout = () => {
    signOut();
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
    router.push("/login");
  };

  useEffect(() => {
    console.log("USER ACTUAL", user);
  }, [])
  

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <Image
            src={logo}
            alt="Logo"
            width="30"
            height="24"
            className="d-inline-block align-text-top"
          />
          Torneos de Tennis
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {links.map(
              ({
                label,
                route,
                showOnlyWhenAdmin,
                showOnlyWhenNotLoggedIn,
              }) => {
                if (
                  (showOnlyWhenAdmin && !isAdmin) ||
                  (showOnlyWhenNotLoggedIn && isLoggedIn)
                ) {
                  return null;
                }

                return (
                  <li key={route} className="nav-item">
                    <Link className="nav-link" href={route}>
                      {label}
                    </Link>
                  </li>
                );
              }
            )}
          </ul>
          {isLoggedIn && (
  <div className="navbar-text">
    ¡Hola, {user.name}!
    <button className="btn btn-danger ms-2" onClick={handleLogout}>Cerrar Sesión</button>
  </div>
)}
        </div>
      </div>
    </nav>
  );
}
