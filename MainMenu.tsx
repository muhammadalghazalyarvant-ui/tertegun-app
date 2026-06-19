import React, { useState, useEffect, KeyboardEvent } from "react";

// --- TIPE DATA ---
type TaskStatus = "UNDONE" | "DONE";
type TaskPriority = "HIGH" | "MEDIUM" | "LOW";

interface Task {
  id: number;
  name: string;
  priority: TaskPriority;
  status: TaskStatus;
  date: string;
}

// --- KOMPONEN PRIORITY BADGE ---
const PriorityBadge = ({
  priority,
  onClick,
}: {
  priority: TaskPriority;
  onClick: () => void;
}) => {
  const getBadgeVisuals = () => {
    switch (priority) {
      case "HIGH":
        return {
          bg: (
            <svg
              viewBox="0 0 100 100"
              className="absolute w-full h-full drop-shadow-md"
            >
              <polygon points="50,10 100,90 0,90" fill="#FF0000" />
            </svg>
          ),
          text: "HIGH",
          textClass: "mt-4 text-lg",
        };
      case "MEDIUM":
        return {
          bg: (
            <svg
              viewBox="0 0 100 100"
              className="absolute w-full h-full drop-shadow-md"
            >
              <rect
                x="5"
                y="20"
                width="90"
                height="60"
                rx="15"
                fill="#FFD700"
              />
            </svg>
          ),
          text: "MEDIUM",
          textClass: "text-sm",
        };
      case "LOW":
        return {
          bg: (
            <svg
              viewBox="0 0 100 100"
              className="absolute w-full h-full drop-shadow-md"
            >
              <circle cx="50" cy="50" r="40" fill="#007BFF" />
            </svg>
          ),
          text: "LOW",
          textClass: "text-xl",
        };
    }
  };

  const visual = getBadgeVisuals();

  return (
    <button
      onClick={onClick}
      className="relative w-[90px] h-[75px] flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
      title="Click to change priority"
    >
      {visual.bg}
      <span
        className={`relative font-black text-black [-webkit-text-stroke:0.2px_white] z-10 ${visual.textClass} [font-family:'Bakbak_One-Regular',Helvetica,sans-serif]`}
      >
        {visual.text}
      </span>
    </button>
  );
};

// --- KOMPONEN UTAMA MAIN MENU ---
export const MainMenu = (): JSX.Element => {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [taskInput, setTaskInput] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  // State untuk fitur EDIT
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const savedTasks = localStorage.getItem("tertegun_history");
    if (savedTasks) {
      setAllTasks(JSON.parse(savedTasks));
    }
    const today = new Date().toISOString().split("T")[0];
    setCurrentDate(today);
  }, []);

  useEffect(() => {
    localStorage.setItem("tertegun_history", JSON.stringify(allTasks));
  }, [allTasks]);

  // --- LOGIKA CRUD ---
  const addTask = () => {
    if (!taskInput.trim()) return;
    setAllTasks([
      ...allTasks,
      {
        id: Date.now(),
        name: taskInput.trim(),
        priority: "HIGH",
        status: "UNDONE",
        date: currentDate,
      },
    ]);
    setTaskInput("");
  };

  const deleteTask = (id: number) => {
    setAllTasks(allTasks.filter((task) => task.id !== id));
  };

  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditText(task.name);
  };

  const saveEdit = (id: number) => {
    if (!editText.trim()) {
      setEditingId(null);
      return;
    }
    setAllTasks(
      allTasks.map((task) =>
        task.id === id ? { ...task, name: editText.trim() } : task,
      ),
    );
    setEditingId(null);
  };

  // --- EVENT HANDLERS ---
  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTask();
    }
  };

  const handleEditKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    id: number,
  ) => {
    if (e.key === "Enter") saveEdit(id);
    if (e.key === "Escape") setEditingId(null); // Batal edit jika tekan Escape
  };

  const cyclePriority = (id: number) => {
    setAllTasks(
      allTasks.map((task) => {
        if (task.id === id) {
          const nextPriority =
            task.priority === "HIGH"
              ? "MEDIUM"
              : task.priority === "MEDIUM"
                ? "LOW"
                : "HIGH";
          return { ...task, priority: nextPriority };
        }
        return task;
      }),
    );
  };

  const toggleStatus = (id: number) => {
    setAllTasks(
      allTasks.map((task) =>
        task.id === id
          ? { ...task, status: task.status === "UNDONE" ? "DONE" : "UNDONE" }
          : task,
      ),
    );
  };

  // --- FILTER & SORTING ---
  const priorityWeight: Record<TaskPriority, number> = {
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1,
  };
  const filteredTasks = allTasks.filter((task) => task.date === currentDate);
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (priorityWeight[a.priority] === priorityWeight[b.priority])
      return a.id - b.id;
    return priorityWeight[b.priority] - priorityWeight[a.priority];
  });

  return (
    <main className="min-h-screen bg-[#e8c9de] p-10 flex flex-col items-center select-none">
      <div className="w-full max-w-[1200px] relative">
        {/* HEADER & DATE */}
        <header className="flex justify-between items-start mb-12">
          <h1 className="text-[70px] font-serif tracking-tight leading-tight text-black">
            What's the plan for today?
          </h1>
          <div className="flex items-center bg-white rounded-lg border-2 border-black w-[300px] h-[50px] mt-4 px-4 text-xl">
            <span className="font-semibold mr-auto">Date:</span>
            <input
              type="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer font-bold"
            />
          </div>
        </header>

        {/* INPUT TASK */}
        <div className="flex gap-4 mb-8">
          <input
            type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Input your task..."
            className="flex-1 h-[60px] bg-white rounded-lg border-2 border-black px-6 text-xl placeholder-black/60 focus:outline-none"
          />
          <button
            onClick={addTask}
            className="w-[150px] h-[60px] bg-[#d5ffc2] rounded-lg border-2 border-black text-xl hover:bg-[#bbf0a3] active:bg-[#a4db8b] transition-colors"
          >
            ENTER
          </button>
        </div>

        {/* TABLE CONTAINER */}
        <div className="bg-[#9af5ab] rounded-xl border-2 border-black overflow-hidden shadow-sm min-h-[300px]">
          <div className="grid grid-cols-[1fr_200px_200px] border-b-2 border-black bg-[#8ae09a]">
            <div className="p-4 text-center text-xl font-bold border-r-2 border-black">
              Task Name
            </div>
            <div className="p-4 text-center text-xl font-bold border-r-2 border-black">
              Priority Scale
            </div>
            <div className="p-4 text-center text-xl font-bold">Status</div>
          </div>

          <div className="flex flex-col">
            {sortedTasks.length === 0 && (
              <div className="p-10 text-center text-black/60 text-xl font-bold">
                No tasks for this date. Enjoy your day!
              </div>
            )}

            {sortedTasks.map((task, index) => (
              <div
                key={task.id}
                className={`grid grid-cols-[1fr_200px_200px] group ${index !== sortedTasks.length - 1 ? "border-b-2 border-black" : ""}`}
              >
                {/* Task Name Column with Edit/Delete features */}
                <div className="p-6 flex items-center justify-between border-r-2 border-black">
                  {editingId === task.id ? (
                    // TAMPILAN SAAT SEDANG DI-EDIT
                    <div className="flex w-full gap-2">
                      <input
                        autoFocus
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => handleEditKeyDown(e, task.id)}
                        className="flex-1 px-3 py-2 border-2 border-black rounded-lg text-xl focus:outline-none"
                      />
                      <button
                        onClick={() => saveEdit(task.id)}
                        className="bg-[#d5ffc2] px-4 py-2 rounded-lg border-2 border-black font-bold text-sm hover:bg-[#bbf0a3]"
                      >
                        SAVE
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-[#ff7e7e] px-4 py-2 rounded-lg border-2 border-black font-bold text-sm hover:bg-[#ff5c5c]"
                      >
                        CANCEL
                      </button>
                    </div>
                  ) : (
                    // TAMPILAN NORMAL
                    <>
                      <p
                        className={`text-xl font-bold leading-relaxed transition-all duration-300 pr-4
                        ${
                          task.status === "DONE"
                            ? "text-black [-webkit-text-stroke:1px_white] line-through decoration-white decoration-[4px]"
                            : "text-black"
                        }`}
                      >
                        {task.name}
                      </p>

                      {/* Tombol Edit & Delete (Muncul saat di-hover) */}
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEditing(task)}
                          className="bg-[#FFD700] px-3 py-1.5 rounded-md border-2 border-black text-sm font-bold shadow-[2px_2px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000] active:translate-y-[2px] active:shadow-none"
                        >
                          EDIT
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="bg-[#ff7e7e] px-3 py-1.5 rounded-md border-2 border-black text-sm font-bold shadow-[2px_2px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000] active:translate-y-[2px] active:shadow-none"
                        >
                          DEL
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <div className="p-4 flex justify-center items-center border-r-2 border-black">
                  <PriorityBadge
                    priority={task.priority}
                    onClick={() => cyclePriority(task.id)}
                  />
                </div>

                <div className="p-4 flex justify-center items-center">
                  <button
                    onClick={() => toggleStatus(task.id)}
                    className={`w-[140px] h-[55px] rounded-lg border-2 border-black text-2xl font-bold tracking-wider transition-colors duration-200
                      ${task.status === "UNDONE" ? "bg-[#6a6a6a] text-black hover:bg-[#a3a3a3]" : "bg-[#4ade80] text-black"}
                    `}
                  >
                    {task.status}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainMenu;
