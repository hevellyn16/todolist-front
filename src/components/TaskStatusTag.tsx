type TaskStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'PENDING' | 'COMPLETED';

export function TaskStatusTag({ status }: { status: TaskStatus }) {
    const statusConfig = {
        NOT_STARTED: { label: 'Não iniciado', colors: 'bg-gray-100 text-gray-700 border-gray-300' },
        IN_PROGRESS: { label: 'Em andamento', colors: 'bg-blue-100 text-blue-700 border-blue-300' },
        PENDING:     { label: 'Pendente', colors: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
        COMPLETED:   { label: 'Concluído', colors: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
    };

    const config = statusConfig[status];

    return (
        <span className={`px-3 py-1 text-sm font-semibold border rounded-full shadow-sm ${config.colors}`}>
        {config.label}
        </span>
    );
}