import { Search } from "lucide-react";
import { api } from "../api/api";

export function LookUp() {
    const handleSearch = async (query: string) => {
        try {
            const response = await api.get(`/tasks/search?query=${encodeURIComponent(query)}`);
            console.log("Resultados da busca:", response.data);
        } catch (error) {
            console.error("Erro ao buscar tarefas:", error);
        }
    };

    return (
        <div className="mb-6">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Buscar tarefas..."
                    className="w-full pl-10 pr-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => handleSearch(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
        </div>
    );
}