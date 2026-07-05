import { useState, useEffect } from "react";
import logoDark from "./logo-dark.svg";


const API_URL = "http://localhost:5223/todoitems";

interface Todo {
  id: number;
  title: string; // Asegúrate de si tu backend usa 'title' o 'name'
  isComplete: boolean;
}

export function Welcome() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar las tareas");
        return res.json();
      })
      .then((data) => setTodos(data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const taskToSend = {
      title: newTodo,
      isComplete: false,
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskToSend),
      });

      if (!response.ok) throw new Error("Error al crear la tarea");
      
      const createdTodo = await response.json();
      setTodos([...todos, createdTodo]);
      setNewTodo("");
    } catch (err) {
      console.error(err);
    }
  };


  const toggleTodo = async (id: number) => {
    const todoToUpdate = todos.find((t) => t.id === id);
    if (!todoToUpdate) return;

    const updatedTask = {
      ...todoToUpdate,
      isComplete: !todoToUpdate.isComplete,
    };

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) throw new Error("Error al actualizar la tarea");

      setTodos(todos.map((todo) => (todo.id === id ? updatedTask : todo)));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar la tarea");

      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-950 text-white">
      {/* Columna Izquierda: Información de la API */}
      <div className="hidden md:flex md:w-1/3 bg-neutral-900 flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <img src={logoDark} alt="TodoAPI Logo" className="h-8 w-auto" />
          <span className="font-semibold text-lg tracking-wider">TodoAPI</span>
        </div>

        <div>
          <h1 className="text-4xl font-bold tracking-tight">Welcome to TodoApi</h1>
          <p className="text-base text-neutral-400 mt-4 leading-relaxed">
            A simple REST API for managing todo items. Created with ASP.NET Core.
          </p>
        </div>

        <div className="text-xs text-neutral-500">
          &copy; {new Date().getFullYear()} TodoAPI.
        </div>
      </div>

      {/* Columna Derecha: El Todo App */}
      <div className="flex w-full md:w-2/3 justify-center items-start p-8 md:p-16 overflow-y-auto">
        <div className="w-full max-w-xl space-y-8">
          
          {/* Encabezado móvil */}
          <div className="block md:hidden text-center mb-6">
            <h1 className="text-3xl font-bold">TodoApi</h1>
            <p className="text-sm text-neutral-400 mt-1">Manage your daily tasks</p>
          </div>

          {/* Formulario para añadir tareas */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1 px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-neutral-100 placeholder-neutral-500"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-3 rounded-lg transition dynamic-shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Add
            </button>
          </form>

          {/* Lista de tareas */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl divide-y divide-neutral-800 hidden-scrollbar">
            {todos.length === 0 ? (
              <p className="p-6 text-center text-neutral-500 text-sm">No tasks yet. Add one above!</p>
            ) : (
              todos.map((todo) => (
                <div key={todo.id} className="flex items-center justify-between p-4 hover:bg-neutral-850 transition group">
                  <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => toggleTodo(todo.id)}>
                    <input
                      type="checkbox"
                      checked={todo.isComplete}
                      readOnly // Evita warnings de React, la acción la maneja el contenedor
                      className="h-5 w-5 rounded border-neutral-700 bg-neutral-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-neutral-900"
                    />
                    <span className={`text-sm transition-all ${todo.isComplete ? "line-through text-neutral-500" : "text-neutral-200"}`}>
                      {todo.title}
                    </span>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Evita que al hacer clic en borrar también se pulse el toggle
                      deleteTodo(todo.id);
                    }}
                    className="text-neutral-500 hover:text-red-400 p-1 rounded transition opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Delete task"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}