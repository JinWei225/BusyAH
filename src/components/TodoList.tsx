'use client';

import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronRight, CheckCircle2, Circle, MoreVertical, Edit2, X, Check } from 'lucide-react';
import {
    createTodo, toggleTodo, deleteTodo, updateTodo,
    createSubtask, toggleSubtask, deleteSubtask, updateSubtask
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

    // Edit states
    const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
    const [editTodoTitle, setEditTodoTitle] = useState('');
    const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);
    const [editSubtaskTitle, setEditSubtaskTitle] = useState('');
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

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
        setActiveMenuId(null);
    };

    const handleUpdateTodo = async (id: string) => {
        if (!editTodoTitle.trim()) return;
        setLoading(true);
        await updateTodo(id, editTodoTitle);
        setEditingTodoId(null);
        setLoading(false);
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

    const handleUpdateSubtask = async (id: string) => {
        if (!editSubtaskTitle.trim()) return;
        setLoading(true);
        await updateSubtask(id, editSubtaskTitle);
        setEditingSubtaskId(null);
        setLoading(false);
    };

    const toggleMenu = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveMenuId(activeMenuId === id ? null : id);
    };

    return (
        <div className="todo-widget" onClick={() => setActiveMenuId(null)}>
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
                    const isEditing = editingTodoId === todo.id;
                    const isMenuOpen = activeMenuId === todo.id;

                    return (
                        <div key={todo.id} className="todo-item-container">
                            <div
                                className={`todo-card ${todo.isCompleted ? 'completed' : ''} ${isEditing ? 'editing' : ''}`}
                                onClick={() => !isEditing && toggleExpand(todo.id)}
                            >
                                <button
                                    className="todo-check"
                                    onClick={(e) => { e.stopPropagation(); handleToggleTodo(todo.id, todo.isCompleted); }}
                                    disabled={isEditing}
                                >
                                    {todo.isCompleted ? <CheckCircle2 className="text-success" color="var(--success)" /> : <Circle color="var(--text-secondary)" />}
                                </button>

                                <div className="todo-content">
                                    {isEditing ? (
                                        <input
                                            autoFocus
                                            className="edit-input"
                                            value={editTodoTitle}
                                            onChange={(e) => setEditTodoTitle(e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleUpdateTodo(todo.id);
                                                if (e.key === 'Escape') setEditingTodoId(null);
                                            }}
                                        />
                                    ) : (
                                        <>
                                            <span className="todo-title">{todo.title}</span>
                                            {subtasks.length > 0 && (
                                                <span className="subtask-badge">{subtasks.filter(s => s.isCompleted).length}/{subtasks.length}</span>
                                            )}
                                        </>
                                    )}
                                </div>

                                <div className="todo-actions">
                                    {isEditing ? (
                                        <div className="edit-actions">
                                            <button className="btn-icon success" onClick={(e) => { e.stopPropagation(); handleUpdateTodo(todo.id); }}>
                                                <Check size={18} />
                                            </button>
                                            <button className="btn-icon" onClick={(e) => { e.stopPropagation(); setEditingTodoId(null); }}>
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <button className="btn-icon" onClick={(e) => { e.stopPropagation(); toggleExpand(todo.id); }}>
                                                {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                            </button>
                                            <div className="menu-container">
                                                <button className="btn-icon" onClick={(e) => toggleMenu(todo.id, e)}>
                                                    <MoreVertical size={18} />
                                                </button>
                                                {isMenuOpen && (
                                                    <div className="dropdown-menu">
                                                        <button onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingTodoId(todo.id);
                                                            setEditTodoTitle(todo.title);
                                                            setActiveMenuId(null);
                                                        }}>
                                                            <Edit2 size={14} /> Edit
                                                        </button>
                                                        <button className="danger" onClick={(e) => handleDeleteTodo(todo.id, e)}>
                                                            <Trash2 size={14} /> Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {isExpanded && (
                                <div className="subtasks-container">
                                    {subtasks.map(subtask => {
                                        const isSubEditing = editingSubtaskId === subtask.id;
                                        const isSubMenuOpen = activeMenuId === subtask.id;

                                        return (
                                            <div key={subtask.id} className={`subtask-item ${subtask.isCompleted ? 'completed' : ''} ${isSubEditing ? 'editing' : ''}`}>
                                                <button
                                                    className="todo-check"
                                                    onClick={() => !isSubEditing && toggleSubtask(subtask.id, !subtask.isCompleted)}
                                                    disabled={isSubEditing}
                                                >
                                                    {subtask.isCompleted ? <CheckCircle2 size={16} color="var(--success)" /> : <Circle size={16} color="var(--text-secondary)" />}
                                                </button>

                                                <div className="subtask-content">
                                                    {isSubEditing ? (
                                                        <input
                                                            autoFocus
                                                            className="edit-input small"
                                                            value={editSubtaskTitle}
                                                            onChange={(e) => setEditSubtaskTitle(e.target.value)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') handleUpdateSubtask(subtask.id);
                                                                if (e.key === 'Escape') setEditingSubtaskId(null);
                                                            }}
                                                        />
                                                    ) : (
                                                        <span className="subtask-title">{subtask.title}</span>
                                                    )}
                                                </div>

                                                <div className="subtask-actions">
                                                    {isSubEditing ? (
                                                        <div className="edit-actions">
                                                            <button className="btn-icon success small" onClick={() => handleUpdateSubtask(subtask.id)}>
                                                                <Check size={14} />
                                                            </button>
                                                            <button className="btn-icon small" onClick={() => setEditingSubtaskId(null)}>
                                                                <X size={14} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="menu-container">
                                                            <button className="btn-icon" onClick={(e) => toggleMenu(subtask.id, e)}>
                                                                <MoreVertical size={14} />
                                                            </button>
                                                            {isSubMenuOpen && (
                                                                <div className="dropdown-menu small">
                                                                    <button onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setEditingSubtaskId(subtask.id);
                                                                        setEditSubtaskTitle(subtask.title);
                                                                        setActiveMenuId(null);
                                                                    }}>
                                                                        <Edit2 size={12} /> Edit
                                                                    </button>
                                                                    <button className="danger" onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        deleteSubtask(subtask.id);
                                                                        setActiveMenuId(null);
                                                                    }}>
                                                                        <Trash2 size={12} /> Delete
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}

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
