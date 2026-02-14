import { useState } from "react";
import { api } from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import Transition from "../components/PageWrapper";

export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    type NewType = React.SubmitEvent;

    async function handleLogin(e: NewType) {
        e.preventDefault();
        try {
            const response = await api.post("/login", {
                email,
                password,
            });
            const token = response.data.token;
            localStorage.setItem("@todo:token", token);
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            console.log("Token stored successfully:", token);
            navigate("/dashboard");
        } catch (error) {
            alert("Login failed! Verify your credentials.");
        }
    }

    return (
        <Transition>

        <div className="flex items-center justify-center h-screen bg-[#fff1f1]">
            <form
                onSubmit={handleLogin}
                className="bg-linear-to-b from-fuchsia-50 to-[#c00076]/5 p-6 rounded-2xl border border-gray-300 shadow-md w-full max-w-sm "
            >
                <h2 className="text-2xl mb-4 text-center">Login</h2>
                <input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 mb-4 border rounded-2xl"
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 mb-4 border rounded-2xl"
                />
                <button
                    type="submit"
                    className="w-40 mx-auto block bg-[#c00076] cursor-pointer text-white p-2 rounded-2xl hover:bg-[#c00076]/80 transition duration-300"
                >
                    Entrar
                </button>
                <p className="mt-4 text-center">
                    Não tem uma conta?{" "}
                    <Link to="/users" className="text-[#c00076] hover:underline">
                        Registre-se!!
                    </Link>
                </p>
            </form>
        </div>
        </Transition>
    );
}