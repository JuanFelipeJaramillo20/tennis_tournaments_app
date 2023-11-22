"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import ErrorAlert from "../components/ErrorAlert";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const router = useRouter();

  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      localStorage.setItem("user", JSON.stringify(session.user));
      const loginEvent = new CustomEvent("userLoggedInFromGoogle", {
        detail: {
          user: session.user,
        },
      });
      window.dispatchEvent(loginEvent);
      console.log("FIRING EVENT FROM GOOGLE AUTH");
      router.push("/tournament");
    }
  }, [session]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
        const user = await axios.post("/api/auth", { email, password });
        localStorage.setItem("user", JSON.stringify(user.data.formattedUser));
        const loginEvent = new CustomEvent("userLoggedIn", {
          detail: {
            user: user.data.formattedUser,
          },
        });
        window.dispatchEvent(loginEvent);
        router.push("/tournament");
    } catch (error) {
      console.error(error);
      setShowErrorAlert(true);
    }
  };

  const handleSignup = () => {
    router.push("/register");
  };

  useEffect(() => {
    if(setShowErrorAlert){
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 3000);
    }

    return () => clearTimeout(timeout);
  }, [showErrorAlert])
  

  return (
    <section className="vh-100 gradient-custom" suppressHydrationWarning>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div
              className="card bg-dark text-white"
              style={{ borderRadius: "1rem" }}
            >
              <div className="card-body p-5 text-center">
                {showErrorAlert &&<ErrorAlert msg="Credenciales Inválidas. Intenta de nuevo" />}
                <div className="mb-md-5 mt-md-4 pb-5">
                  <h2 className="fw-bold mb-2 text-uppercase">
                    Iniciar Sesión
                  </h2>
                  <p className="text-white-50 mb-5">
                    Por favor ingresa tu correo y contraseña
                  </p>

                  <form onSubmit={onSubmit}>
                    <div className="form-outline form-white mb-4">
                      <label className="form-label" htmlFor="typeEmailX">
                        Email:
                      </label>
                      <input
                        type="email"
                        id="typeEmailX"
                        className="form-control form-control-lg"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="form-outline form-white mb-4">
                      <label className="form-label" htmlFor="typePasswordX">
                        Contraseña:
                      </label>
                      <input
                        type="password"
                        id="typePasswordX"
                        className="form-control form-control-lg"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <button
                      className="btn btn-outline-light btn-lg px-5"
                      type="submit"
                    >
                      Iniciar Sesión
                    </button>
                  </form>
                  <button
                    className="btn btn-outline-light btn-lg px-5 mt-3"
                    type="submit"
                    onClick={() => signIn()}
                  >
                    Iniciar sesión con Google
                  </button>
                  <div className="d-flex justify-content-center text-center mt-4 pt-1">
                    <a href="#!" className="text-white">
                      <i className="fab fa-facebook-f fa-lg"></i>
                    </a>
                    <a href="#!" className="text-white">
                      <i className="fab fa-twitter fa-lg mx-4 px-2"></i>
                    </a>
                    <a href="#!" className="text-white">
                      <i className="fab fa-google fa-lg"></i>
                    </a>
                  </div>
                </div>

                <div>
                  <a
                    type="button"
                    className="text-white-50 fw-bold"
                    onClick={handleSignup}
                  >
                    Registrarse
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
