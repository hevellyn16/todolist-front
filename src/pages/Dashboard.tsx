import { useState, useEffect } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";
import type { Task } from "../interfaces/Task";
import { TaskStatusSelect } from "../components/TaskStatusSelect";
import { TaskStatusTag } from "../components/TaskStatusTag";
import { Modal } from "../components/Modal";
import { Trash, Search, PlusCircleIcon } from "lucide-react";

export function Dashboard() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskTitle] = useState("");
    const [newTaskDescription] = useState("");
    const [newTaskStatus] = useState<Task["status"]>("NOT_STARTED");
    const [selectedTaskId, setSelectedTaskId] = useState<Task | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [originalTaskData, setOriginalTaskData] = useState<Task | null>(null);
    const [showUnsavedModal, setShowUnsavedModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [creatingTask, setCreatingTask] = useState(false);

    const navigate = useNavigate();

    const [newTaskData, setNewTaskData] = useState({
        title: "",
        description: "",
        status: "NOT_STARTED" as Task["status"]
    });

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

    function handleCloseCreateModal() {
        setNewTaskData({
            title: "",
            description: "",
            status: "NOT_STARTED"
        });
        setCreatingTask(false);
    }

    async function handleAddTask(e: React.FormEvent) {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        try {
            const response = await api.post("/tasks", {
                title: newTaskTitle,
                description: newTaskDescription,
                status: newTaskStatus
            });
            setTasks([...tasks, response.data]);
            setNewTaskData ({
                title: "",
                description: "",
                status: "NOT_STARTED"
            })
        } catch (error) {
            alert("Failed to add task! Please try again.");
        }
    }


    async function handleUpdateTask() {
        if (!selectedTaskId) return;

        try {
            await api.put(`/tasks/${selectedTaskId.id}`, {
                title: selectedTaskId.title,
                description: selectedTaskId.description,
                status: selectedTaskId.status
            });
            
            setSelectedTaskId(null); 
            fetchTasks(); 
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

    function handleCloseOutside() {
        if (!selectedTaskId || !originalTaskData) {
            handleCloseModal();
            return;
        }

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

    
    function handleSearch(query: string) {
        setSearchQuery(query);
    }

    // Filtra a lista localmente antes de exibir
    const filteredTasks = tasks.filter((task) => {
        const query = searchQuery.toLowerCase();
        return (
            task.title.toLowerCase().includes(query) ||
            (task.description && task.description.toLowerCase().includes(query))
        );
    });

    return (
    <> 
        <div className="min-h-screen bg-[#fff1f1] p-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar tarefas..."
                            className="w-full pl-10 pr-4 py-2 rounded-2xl border border-gray focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray" />
                    </div>
                </div>
                
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 leading-none">Minhas Tarefas</h1>
                    <button 
                        className=" text-black cursor-pointer rounded-full font-bold transition-colors hover:text-[#b71651] hover:scale-110 hover:bg-[#ffe0e0] p-2"
                        onClick={() => setCreatingTask(true)}
                        
                    >
                        <PlusCircleIcon className="w-10 h-10" />
                    </button>
                </header>

                <div className="bg-[#fff1f1] rounded-2xl border shadow overflow-hidden">
                    {/* Exibe filteredTasks ao invés de tasks */}
                    {filteredTasks.length > 0 ? (
                        <ul className="divide-y divide-black">
                            {filteredTasks.map((task) => (
                                <li 
                                    key={task.id} 
                                    onClick={() => handleOpenModal(task)} 
                                    className="p-4 flex items-center justify-between hover:bg-[#ffb86b]/20 border-b border-black last:border-0 cursor-pointer group"
                                >
                                    <span className={`flex-1 font-medium ${task.status === "COMPLETED" ? "line-through text-gray-400" : "text-gray-900"}`}>
                                        {task.title}
                                    </span>
                                    
                                    <div className="flex items-center gap-4">
                                        <TaskStatusTag status={task.status} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="p-8 text-center text-gray-500">
                            {searchQuery 
                                ? "Nenhuma tarefa encontrada para essa busca." 
                                : "Nenhuma tarefa encontrada."}
                        </p>
                    )}
                </div>
            </div>
        </div>

        {/* Modal de Edição Direta */}
        <Modal
            isOpen={!!selectedTaskId}
            onClose={handleCloseOutside}
            title="Editar Tarefa"
        >
            {selectedTaskId && (
                <div className="space-y-4 p-1">
                    <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                    type="text"
                    value={selectedTaskId.title}
                    onChange={(e) => setSelectedTaskId({ ...selectedTaskId, title: e.target.value })}
                    className="w-full p-3 border rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                    value={selectedTaskId.description || ""}
                    onChange={(e) => setSelectedTaskId({ ...selectedTaskId, description: e.target.value })}
                    className="w-full p-3 border rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none h-32"
                />
            </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <TaskStatusSelect 
                                currentStatus={selectedTaskId.status} 
                                onStatusChange={(newStatus) => setSelectedTaskId(prev => prev ? {...prev, status: newStatus} : null)} 
                        />
                    </div>
                    <div className="flex justify-between gap-4 pt-4">
                        <button
                            onClick={() => setIsDeleting(true)}
                            className=" text-red-500 cursor-pointer px-4 py-2 rounded-2xl hover:text-red-600 transition-colors"
                        >
                            <Trash className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleUpdateTask}
                            className="bg-black text-white cursor-pointer px-4 py-2 rounded-2xl hover:bg-[#055de2] transition-colors"
                        >
                            Salvar Alterações
                        </button>
                    </div>
                </div>
            )}
        </Modal>

        {/* Modal de Criação de Tarefa */}
        <Modal
            isOpen={creatingTask}
            onClose={handleCloseCreateModal}
            title="Nova Tarefa"
        >

            <div className="space-y-4 p-1">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                    <input
                        type="text"
                        value={newTaskData.title}
                        onChange={(e) => setNewTaskData({...newTaskData, title: e.target.value})}
                        className="w-full p-3 border rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                    <textarea
                        value={newTaskData.description}
                        onChange={(e) => setNewTaskData({...newTaskData, description: e.target.value})}
                        className="w-full p-3 border rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none h-32"
                    />
                </div>
                <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <TaskStatusSelect 
                                currentStatus={newTaskData.status} 
                                onStatusChange={(newStatus) => setNewTaskData({...newTaskData, status: newStatus})}
                        />
                </div>
                <div className="flex justify-end gap-4 pt-4">
                    <button
                        onClick={handleCloseCreateModal}
                        className="bg-gray-200 cursor-pointer text-gray-700 px-4 py-2 rounded-2xl hover:bg-gray-300 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={async () => {
                            await handleAddTask(new Event("submit") as unknown as React.FormEvent);
                            setCreatingTask(false);
                        }
                        }
                        className="bg-blue-500 text-white cursor-pointer px-4 py-2 rounded-2xl hover:bg-blue-600 transition-colors"
                    >
                        Criar Tarefa
                    </button>
                </div>
            </div>
        </Modal>


        {/* Modal de Exclusão */}
        {isDeleting && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
                    <h2 className="text-xl font-bold text-red-600 mb-4">Confirmar Exclusão</h2>
                    <p className="mb-6">Tem certeza que deseja excluir esta tarefa?</p>
                    <div className="flex justify-end gap-4">
                        <button onClick={handleDeleteTask} className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded-2xl hover:bg-red-600 transition-colors">
                            Sim, excluir
                        </button>
                        <button onClick={() => setIsDeleting(false)} className="bg-gray-200 cursor-pointer text-gray-700 px-4 py-2 rounded-2xl hover:bg-gray-300 transition-colors">
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Modal de Aviso de Alterações Não Salvas */}
        <Modal
            isOpen={showUnsavedModal}
            onClose={() => setShowUnsavedModal(false)}
            title="Descartar alterações?"
        >
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
                        handleCloseModal(); 
                    }} 
                    className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                    Sim, descartar
                </button>
            </div>
        </Modal>
    </>
    );
}