import { ChevronDown } from 'lucide-react'; 

type TaskStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'PENDING' | 'COMPLETED';

interface TaskStatusSelectProps {
    currentStatus: TaskStatus;
    onStatusChange: (newStatus: TaskStatus) => void;
}

export function TaskStatusSelect({ currentStatus, onStatusChange }: TaskStatusSelectProps) {
    const statusColors = {
        NOT_STARTED: 'bg-gray-100 text-gray-700 border-gray-300',
        IN_PROGRESS: 'bg-blue-100 text-blue-700 border-blue-300',
        PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-300',
        COMPLETED: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    };

    return (
        // Um container relative para podermos flutuar a seta
        <div className="relative inline-block"> 
        <select
            value={currentStatus}
            onChange={(e) => onStatusChange(e.target.value as TaskStatus)}
            // Adicionamos 'appearance-none' para matar a seta padrão e 'pr-8' para dar espaço para a nova seta
            className={`appearance-none pr-8 pl-3 py-1 text-sm font-semibold border rounded-full outline-none cursor-pointer transition-colors shadow-sm ${statusColors[currentStatus]}`}
        >
            <option value="NOT_STARTED">Não iniciado</option>
            <option value="IN_PROGRESS">Em andamento</option>
            <option value="PENDING">Pendente</option>
            <option value="COMPLETED">Concluído</option>
        </select>
        
        {/* Seta customizada flutuando do lado direito */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
            <ChevronDown size={16} className="opacity-70" />
        </div>
        </div>
    );
}