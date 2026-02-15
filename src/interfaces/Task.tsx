export interface Task {
    id: number;
    title: string;
    description?: string;
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'PENDING' | 'COMPLETED';
}