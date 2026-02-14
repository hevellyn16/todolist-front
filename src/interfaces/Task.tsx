export interface Task {
    id: number;
    title: string;
    description?: string;
    created_at: string;
    updated_at: string;
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'PENDING' | 'COMPLETED';
}