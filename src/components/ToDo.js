import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSave } from '@fortawesome/free-solid-svg-icons';
import '../ToDo.css';

function ToDo() {
    const initialTodos = JSON.parse(localStorage.getItem('todos')) || [];
    const [todos, setTodos] = useState(initialTodos);
    const [task, setTask] = useState('');
    const [editTask, setEditTask] = useState('');
    const [isOverflowing, setIsOverflowing] = useState(false);

    const ulRef = useRef(null);

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    useEffect(() => {
        const ulElement = ulRef.current;
        if (ulElement) {
            setIsOverflowing(ulElement.scrollHeight > ulElement.clientHeight);
        }
    }, [todos]);

    const handleInputChange = (event) => {
        setTask(event.target.value.slice(0, 40));
    };

    const handleAddTodo = () => {
        if (task.trim() === '') return;
        const newTodo = {
            id: uuidv4(),
            task,
            completed: false,
            isEditing: false,
        };
        setTodos([...todos, newTodo]);
        setTask('');
    };

    const handleStartEditing = (id, currentTask) => {
        setEditTask(currentTask);
        setTodos(
            todos.map((todo) =>
                todo.id === id ? { ...todo, isEditing: true } : { ...todo, isEditing: false }
            )
        );
    };

    const handleUpdateTodo = (id) => {
        const todoToUpdate = todos.find((todo) => todo.id === id);
        if (todoToUpdate && editTask.trim() === '') {
            return;
        }

        setTodos(
            todos.map((todo) =>
                todo.id === id ? { ...todo, task: editTask, isEditing: false } : todo
            )
        );
    };

    const handleToggleComplete = (id) => {
        setTodos(
            todos.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    const handleDeleteTodo = (id) => {
        setTodos(todos.filter((todo) => todo.id !== id));
    };

    return (
        <div className="todo-container">
            <h1 className="todo-title">Todo App</h1>
            <div className="input-container">
                <input
                    type="text"
                    value={task}
                    onChange={handleInputChange}
                    placeholder="Add a new task..."
                />
                <button className="add-button" onClick={handleAddTodo}>
                    Add
                </button>
            </div>
            <ul
                ref={ulRef}
                className={`todo-list ${isOverflowing ? 'overflowing' : ''}`}
            >
                {todos.map((todo) => (
                    <li key={todo.id}>
                        <div
                            className="todo-item"
                            style={{ backgroundColor: todo.completed ? '#28a745' : '#dc3545' }}
                        >
                            {todo.isEditing ? (
                                <div>
                                    <input
                                        type="text"
                                        value={editTask}
                                        onChange={(e) => setEditTask(e.target.value)}
                                    />
                                    <button className="save-button" onClick={() => handleUpdateTodo(todo.id)}>
                                        <FontAwesomeIcon icon={faSave} />
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <input
                                        type="checkbox"
                                        checked={todo.completed}
                                        onChange={() => handleToggleComplete(todo.id)}
                                    />
                                    <span
                                        className={todo.completed ? 'completed-task' : 'task'}
                                        onClick={() => handleToggleComplete(todo.id)}
                                    >
                                        {todo.task}
                                    </span>
                                    <button className="edit-button" onClick={() => handleStartEditing(todo.id, todo.task)}>
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <button className="delete-button" onClick={() => handleDeleteTodo(todo.id)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}


export default ToDo