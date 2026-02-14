import { useState } from "react";
import { api } from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import Transition from "../components/PageWrapper";

export function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        try {
            await api.post("/users", {
                name: username,
                email,
                password,
            });
            alert("Registration successful! Please log in.");
            navigate("/login");
        } catch (error) {
            console.error("Erro da API:", (error as any).response?.data);
            alert("Registration failed! Verify your information.");
        }
    }

    return (
        <Transition>

        <div className="flex items-center justify-center h-screen bg-gray-950">
            <form
                onSubmit={handleRegister}
                className="bg-linear-to-b from-black to-white/5 border border-white/20 p-6 rounded-2xl shadow-md w-full max-w-sm"
            >
                <h2 className="text-2xl mb-4 text-center cursor-pointer text-white">Registrar</h2>
                <input
                    type="text"
                    placeholder="Nome"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 mb-4 border border-white/20 text-white rounded-2xl"
                />
                <input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 mb-4 border border-white/20 text-white rounded-2xl"
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 mb-4 border border-white/20 text-white rounded-2xl"
                />
                <button
                    type="submit"
                    className="w-40 mx-auto block bg-[#900546] text-white p-2 rounded-2xl hover:bg-[#900546]/80 transition duration-300"
                >
                    Registrar
                </button>
                <p className="mt-4 text-center text-white">
                    Já tem uma conta?{" "}
                    <Link to="/login" className="text-[#ee4baf] hover:underline">
                        Faça login!!
                    </Link>
                </p>
            </form>
        </div>
        </Transition>
    );
}