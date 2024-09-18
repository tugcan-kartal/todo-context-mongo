"use client";

import { useState, useEffect } from "react";

interface Todo {
  _id: string;
  text: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await fetch("/api/todos");
      const data = await response.json();
      setTodos(data);
    };

    fetchTodos();
  }, []);

  const addTodo = async () => {
    const response = await fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: newTodo }),
    });
    const todo = await response.json();
    setTodos([...todos, todo]);
    setNewTodo("");
  };

  const deleteTodo = async (id: string) => {
    await fetch("/api/todos", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    setTodos(todos.filter((todo) => todo._id !== id));
  };

  const editTodo = async (id: string) => {
    const response = await fetch("/api/todos", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, text: editText }),
    });
    const updatedTodo = await response.json();
    setTodos(todos.map((todo) => (todo._id === id ? updatedTodo : todo)));
    setEditingTodo(null); // Düzenleme modunu kapat
    setEditText(""); // Düzenleme alanını temizle
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">TODO List</h1>

      <div className="w-full max-w-md">
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add a new todo"
          />
          <button
            onClick={addTodo}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Add
          </button>
        </div>

        <ul className="space-y-3">
          {todos.map((todo) => (
            <li
              key={todo._id}
              className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md"
            >
              {editingTodo?._id === todo._id 
                ? 
                (
                  <div className="flex flex-1 gap-2">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => editTodo(todo._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition duration-300"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                <>
                  <span className="flex-1 text-gray-700">{todo.text}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingTodo(todo)}
                      className="bg-yellow-400 text-white px-3 py-1 rounded-lg hover:bg-yellow-500 transition duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTodo(todo._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
