import { useState, useEffect } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";
import type { Task } from "../interfaces/Task";
import { Trash2, X, Pencil } from "lucide-react";
import { TaskStatusSelect } from "../components/TaskStatusSelect";
import { TaskStatusTag } from "../components/TaskStatusTag";

export function Dashboard() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskDescription, setNewTaskDescription] = useState("");
    const [selectedTaskId, setSelectedTaskId] = useState<Task | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [originalTaskData, setOriginalTaskData] = useState<Task | null>(null);
    const [showUnsavedModal, setShowUnsavedModal] = useState(false);
    
    const navigate = useNavigate();

    async function fetchTasks() {
        try {
            const response = await api.get("/tasks");
            setTasks(response.data);
        } catch (error) {
            alert("Failed to fetch tasks! Please log in again.");
            navigate("/login");
        }
    }

    useEffect(() => {
        const token = localStorage.getItem("@todo:token");
        if (!token) {
            navigate("/login");
        } else {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            fetchTasks();
        }
    }, [navigate]);

    async function handleAddTask(e: React.FormEvent) {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        try {
            const response = await api.post("/tasks", {
                title: newTaskTitle,
                description: newTaskDescription,
            });
            setTasks([...tasks, response.data]);
            setNewTaskTitle("");
            setNewTaskDescription("");
            fetchTasks();
        } catch (error) {
            alert("Failed to add task! Please try again.");
        }
    }

    function handleLogout() {
        localStorage.removeItem("@todo:token");
        navigate("/login");
    }

    async function handleUpdateTask() {
        if (!selectedTaskId) return;

        try {
            await api.put(`/tasks/${selectedTaskId.id}`, {
                title: selectedTaskId.title,
                description: selectedTaskId.description,
                status: selectedTaskId.status
            });
            
            setSelectedTaskId(null); // Fecha o modal após salvar!
            fetchTasks(); // Atualiza a lista principal
        } catch (error) {
            alert("Erro ao atualizar tarefa");
        }
    }

    function handleOpenModal(task: Task) {
        setSelectedTaskId(task);
        setOriginalTaskData(task);
    }

    function handleCloseModal() {
        setSelectedTaskId(null);
        setOriginalTaskData(null);
    }

    async function handleDeleteTask() {
        if (!selectedTaskId) return;

        try {
            await api.delete(`/tasks/${selectedTaskId.id}`);
            setIsDeleting(false);
            setSelectedTaskId(null);
            fetchTasks();
        } catch (error) {
            alert("Erro ao excluir tarefa");
        }
    }

    function handleCloseOutside(_e: React.MouseEvent) {
        if (!selectedTaskId || !originalTaskData) return;

        const hasChanges =
            selectedTaskId.title !== originalTaskData.title ||
            selectedTaskId.description !== originalTaskData.description ||
            selectedTaskId.status !== originalTaskData.status;

        if (hasChanges) {
            setShowUnsavedModal(true);
        } else {
            handleCloseModal();
        }
    }

    return (
    <> 
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-2xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Minhas Tarefas</h1>
                    <button 
                        onClick={handleLogout}
                        className="text-red-500 cursor-pointer hover:text-red-700 font-medium"
                    >
                        Sair
                    </button>
                </header>

                <form onSubmit={handleAddTask} className="flex gap-2 mb-8">
                    <input
                        type="text"
                        placeholder="Nova tarefa..."
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        className="flex-1 p-3 border rounded shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button 
                        type="submit"
                        className="bg-blue-500 text-white px-6 py-3 cursor-pointer rounded font-bold hover:bg-blue-600 transition-colors"
                    >
                        Adicionar
                    </button>
                </form>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {tasks.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {tasks.map((task) => (
                                <li 
                                    key={task.id} 
                                    onClick={() => handleOpenModal(task)} 
                                    className="p-4 flex items-center justify-between hover:bg-gray-50 border-b border-gray-100 last:border-0 cursor-pointer group"
                                >
                                    <span className={`flex-1 font-medium ${task.status === "COMPLETED" ? "line-through text-gray-400" : "text-gray-700"}`}>
                                        {task.title}
                                    </span>
                                    
                                    <div className="flex items-center gap-4">
                                        <TaskStatusTag status={task.status} />
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation(); 
                                                handleOpenModal(task); 
                                            }} 
                                            className="text-gray-400 hover:text-blue-500 p-2 rounded-full hover:bg-blue-50 transition-colors cursor-pointer"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="p-8 text-center text-gray-500">Nenhuma tarefa encontrada.</p>
                    )}
                </div>
            </div>
        </div>

        {/* Modal de Edição Direta */}
        {selectedTaskId && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={handleCloseOutside}>
                <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
                    
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-bold text-slate-800">
                            Editando Tarefa
                        </h2>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setIsDeleting(true)} className="text-red-500 cursor-pointer hover:text-red-700">
                                <Trash2 size={20} />
                            </button>
                            <button onClick={handleCloseModal} className="text-gray-500 cursor-pointer hover:text-gray-700">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Campo de Título */}
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase italic">Título</label>
                            <input 
                                type="text"
                                value={selectedTaskId.title}
                                onChange={(e) => setSelectedTaskId(prev => prev ? {...prev, title: e.target.value} : null)}
                                className="w-full p-2 border rounded border-blue-300 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Campo de Descrição */}
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase italic">Descrição</label>
                            <textarea 
                                value={selectedTaskId.description || ""}
                                onChange={(e) => setSelectedTaskId(prev => prev ? {...prev, description: e.target.value} : null)}
                                className="w-full p-2 border rounded border-blue-300 outline-none focus:ring-2 focus:ring-blue-500 min-h-25"
                            />
                        </div>

                        {/* Campo de Status */}
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase italic mb-1 block">Status</label>
                            <TaskStatusSelect 
                                currentStatus={selectedTaskId.status} 
                                onStatusChange={(newStatus) => setSelectedTaskId(prev => prev ? {...prev, status: newStatus} : null)} 
                            />
                        </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="mt-8 space-y-2">
                        <button onClick={handleUpdateTask} className="w-full bg-emerald-500 text-white py-2 rounded-lg font-bold cursor-pointer hover:bg-emerald-600 transition-colors">
                            Salvar Alterações
                        </button>
                        <button onClick={handleCloseModal} className="w-full bg-slate-100 text-slate-500 py-2 rounded-lg cursor-pointer font-medium hover:bg-slate-200 transition-colors">
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Modal de Exclusão */}
        {isDeleting && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
                    <h2 className="text-xl font-bold text-red-600 mb-4">Confirmar Exclusão</h2>
                    <p className="mb-6">Tem certeza que deseja excluir esta tarefa?</p>
                    <div className="flex justify-end gap-4">
                        <button onClick={handleDeleteTask} className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
                            Sim, Excluir
                        </button>
                        <button onClick={() => setIsDeleting(false)} className="bg-gray-200 cursor-pointer text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors">
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )}

{/* Modal de Aviso de Alterações Não Salvas */}
        {showUnsavedModal && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-60">
                <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                    <h2 className="text-xl font-bold text-amber-600 mb-2">Descartar alterações?</h2>
                    <p className="text-slate-600 mb-6 text-sm">
                        Você tem mudanças que ainda não foram salvas. Se fechar agora, você perderá essas edições.
                    </p>
                    <div className="flex justify-end gap-3">
                        <button 
                            onClick={() => setShowUnsavedModal(false)} 
                            className="bg-slate-100 cursor-pointer text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                        >
                            Continuar editando
                        </button>
                        <button 
                            onClick={() => {
                                setShowUnsavedModal(false);
                                handleCloseModal(); // Fecha tudo e descarta!
                            }} 
                            className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
                        >
                            Sim, descartar
                        </button>
                    </div>
                </div>
            </div>
        )}
    </>
    );
}