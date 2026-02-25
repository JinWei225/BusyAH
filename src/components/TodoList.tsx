'use client';

import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import {
    createTodo, toggleTodo, deleteTodo,
    createSubtask, toggleSubtask, deleteSubtask
} from '@/app/actions';
import './TodoList.css';

type Todo = any;
type Subtask = any;

interface TodoListProps {
    initialTodos: Todo[];
    allSubtasks: Subtask[];
}

export default function TodoList({ initialTodos, allSubtasks }: TodoListProps) {
    const [newTodoTitle, setNewTodoTitle] = useState('');
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [newSubtaskTitles, setNewSubtaskTitles] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const handleAddTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTodoTitle.trim()) return;
        setLoading(true);
        await createTodo(newTodoTitle);
        setNewTodoTitle('');
        setLoading(false);
    };

    const handleToggleTodo = async (id: string, isCompleted: boolean) => {
        await toggleTodo(id, !isCompleted);
    };

    const handleDeleteTodo = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        await deleteTodo(id);
    };

    const toggleExpand = (id: string) => {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleAddSubtask = async (todoId: string, e: React.FormEvent) => {
        e.preventDefault();
        const title = newSubtaskTitles[todoId];
        if (!title || !title.trim()) return;
        setLoading(true);
        await createSubtask(todoId, title);
        setNewSubtaskTitles(prev => ({ ...prev, [todoId]: '' }));
        setLoading(false);
    };

    return (
        <div className="todo-widget">
            <div className="widget-header">
                <h2 className="page-title" style={{ fontSize: '1.8rem' }}>Tasks</h2>
            </div>

            <form onSubmit={handleAddTodo} className="add-form">
                <input
                    type="text"
                    className="input-field"
                    placeholder="What needs to be done?"
                    value={newTodoTitle}
                    onChange={e => setNewTodoTitle(e.target.value)}
                    disabled={loading}
                />
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    <Plus size={18} /> Add
                </button>
            </form>

            <div className="todo-list">
                {initialTodos.length === 0 && (
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No tasks yet. Enjoy your day!</p>
                )}
                {initialTodos.map(todo => {
                    const subtasks = allSubtasks.filter(s => s.todoId === todo.id);
                    const isExpanded = expanded[todo.id];

                    return (
                        <div key={todo.id} className="todo-item-container">
                            <div
                                className={`todo-card ${todo.isCompleted ? 'completed' : ''}`}
                                onClick={() => toggleExpand(todo.id)}
                            >
                                <button
                                    className="todo-check"
                                    onClick={(e) => { e.stopPropagation(); handleToggleTodo(todo.id, todo.isCompleted); }}
                                >
                                    {todo.isCompleted ? <CheckCircle2 className="text-success" color="var(--success)" /> : <Circle color="var(--text-secondary)" />}
                                </button>
                                <div className="todo-content">
                                    <span className="todo-title">{todo.title}</span>
                                    {subtasks.length > 0 && (
                                        <span className="subtask-badge">{subtasks.filter(s => s.isCompleted).length}/{subtasks.length}</span>
                                    )}
                                </div>
                                <div className="todo-actions">
                                    <button className="btn-icon" onClick={(e) => { e.stopPropagation(); toggleExpand(todo.id); }}>
                                        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                    </button>
                                    <button className="btn-icon danger" onClick={(e) => handleDeleteTodo(todo.id, e)}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            {isExpanded && (
                                <div className="subtasks-container">
                                    {subtasks.map(subtask => (
                                        <div key={subtask.id} className={`subtask-item ${subtask.isCompleted ? 'completed' : ''}`}>
                                            <button
                                                className="todo-check"
                                                onClick={() => toggleSubtask(subtask.id, subtask.isCompleted)}
                                            >
                                                {subtask.isCompleted ? <CheckCircle2 size={16} color="var(--success)" /> : <Circle size={16} color="var(--text-secondary)" />}
                                            </button>
                                            <span className="subtask-title">{subtask.title}</span>
                                            <button className="btn-icon danger-small" onClick={() => deleteSubtask(subtask.id)}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}

                                    <form onSubmit={(e) => handleAddSubtask(todo.id, e)} className="add-subtask-form">
                                        <input
                                            type="text"
                                            className="input-field small-input"
                                            placeholder="Add subtask..."
                                            value={newSubtaskTitles[todo.id] || ''}
                                            onChange={e => setNewSubtaskTitles(prev => ({ ...prev, [todo.id]: e.target.value }))}
                                            disabled={loading}
                                        />
                                        <button type="submit" className="btn btn-primary small-btn" disabled={loading}>
                                            <Plus size={14} />
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
