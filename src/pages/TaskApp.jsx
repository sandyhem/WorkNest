import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, FileText, Users, CheckSquare, PlusCircle, Search, X, Paperclip } from 'lucide-react';

// Mock data for team members
const teamMembers = [
  { id: 1, name: "Alex Johnson", email: "alex@example.com", avatar: "AJ" },
  { id: 2, name: "Sarah Miller", email: "sarah@example.com", avatar: "SM" },
  { id: 3, name: "David Lee", email: "david@example.com", avatar: "DL" },
  { id: 4, name: "Emily Chen", email: "emily@example.com", avatar: "EC" },
  { id: 5, name: "Robert Wilson", email: "robert@example.com", avatar: "RW" }
];

// Mock data for tasks
const initialTasks = [
  { 
    id: 1, 
    title: "Prepare Sprint Demo", 
    description: "Create slides and demos for the upcoming sprint review", 
    assignees: [1, 3], 
    dueDate: "2025-05-20T16:00", 
    priority: "High",
    documents: [],
    status: "In Progress" 
  },
  { 
    id: 2, 
    title: "Update Design System", 
    description: "Incorporate new brand guidelines into our design system", 
    assignees: [2], 
    dueDate: "2025-05-23T12:00", 
    priority: "Medium",
    documents: [],
    status: "Not Started" 
  },
  { 
    id: 3, 
    title: "Code Review", 
    description: "Review pull requests for the authentication service", 
    assignees: [1, 4, 5], 
    dueDate: "2025-05-19T17:00", 
    priority: "High",
    documents: [],
    status: "Not Started" 
  },
];

// Logo Component
const Logo = () => (
  <div className="flex items-center">
    <div className="w-8 h-8 rounded-md bg-white text-yellow-500 flex items-center justify-center mr-2 font-bold text-xl">
      TL
    </div>
    <span className="font-bold text-2xl">Team Leader</span>
  </div>
);

// Main App component
const TaskApp = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showCalendarView, setShowCalendarView] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [filteredTasks, setFilteredTasks] = useState(initialTasks);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    const filtered = tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === "All" || task.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
    
    setFilteredTasks(filtered);
  }, [tasks, searchQuery, filterStatus]);

  const handleAddTask = () => {
    setCurrentTask({
      id: tasks.length + 1,
      title: "",
      description: "",
      assignees: [],
      dueDate: "",
      priority: "Medium",
      documents: [],
      status: "Not Started"
    });
    setShowTaskModal(true);
  };

  const handleEditTask = (task) => {
    setCurrentTask({...task});
    setShowTaskModal(true);
  };

  const handleSaveTask = (task) => {
    if (tasks.find(t => t.id === task.id)) {
      setTasks(tasks.map(t => t.id === task.id ? task : t));
    } else {
      setTasks([...tasks, task]);
    }
    setShowTaskModal(false);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-yellow-500 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Logo />
          <div className="flex space-x-2">
            <button 
              className="bg-white text-yellow-900 px-3 py-1 rounded-md flex items-center"
              onClick={() => setShowCalendarView(!showCalendarView)}
            >
              {showCalendarView ? (
                <><CheckSquare className="w-4 h-4 mr-2" /> Task View</>
              ) : (
                <><Calendar className="w-4 h-4 mr-2" /> Calendar View</>
              )}
            </button>
            <button 
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-md flex items-center"
              onClick={handleAddTask}
            >
              <PlusCircle className="w-4 h-4 mr-2" /> New Task
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow container mx-auto p-4">
        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tasks..."
                className="pl-10 pr-4 py-2 w-full border rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <select 
                className="border rounded-md px-3 py-2"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {showCalendarView ? (
          <CalendarView tasks={tasks} onEditTask={handleEditTask} />
        ) : (
          <TaskListView 
            tasks={filteredTasks} 
            onEditTask={handleEditTask} 
            onDeleteTask={handleDeleteTask}
          />
        )}
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <TaskModal
          task={currentTask}
          onClose={() => setShowTaskModal(false)}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
};

// Task List View Component
const TaskListView = ({ tasks, onEditTask, onDeleteTask }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.map(task => (
        <TaskCard 
          key={task.id} 
          task={task} 
          onEdit={() => onEditTask(task)} 
          onDelete={() => onDeleteTask(task.id)} 
        />
      ))}
      {tasks.length === 0 && (
        <div className="col-span-full text-center py-10 text-gray-500">
          No tasks found. Create a new task to get started!
        </div>
      )}
    </div>
  );
};

// Task Card Component
const TaskCard = ({ task, onEdit, onDelete }) => {
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Not Started': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{task.title}</h3>
          <div className="flex space-x-2">
            <button 
              className="text-blue-500 hover:text-blue-700"
              onClick={onEdit}
            >
              Edit
            </button>
            <button 
              className="text-red-500 hover:text-red-700"
              onClick={onDelete}
            >
              Delete
            </button>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 text-sm h-12 overflow-hidden">
          {task.description}
        </p>
        
        <div className="flex justify-between mb-2">
          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
            {task.status}
          </span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Clock className="w-4 h-4 mr-1" />
          {formatDate(task.dueDate)}
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Users className="w-4 h-4 mr-1" />
          <div className="flex -space-x-2">
            {task.assignees.map(assigneeId => {
              const member = teamMembers.find(m => m.id === assigneeId);
              return member ? (
                <div 
                  key={assigneeId}
                  className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold"
                  title={member.name}
                >
                  {member.avatar}
                </div>
              ) : null;
            })}
          </div>
        </div>
        
        {task.documents && task.documents.length > 0 && (
          <div className="mt-2">
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <Paperclip className="w-4 h-4 mr-1" />
              <span>Attachments ({task.documents.length})</span>
            </div>
            {task.documents.slice(0, 2).map((doc, index) => (
              <div key={index} className="text-xs text-blue-600 truncate">
                {doc.name}
              </div>
            ))}
            {task.documents.length > 2 && (
              <div className="text-xs text-gray-500">
                +{task.documents.length - 2} more
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Task Modal Component
const TaskModal = ({ task, onClose, onSave }) => {
  const [formData, setFormData] = useState(task);
  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleAssigneeChange = (memberId) => {
    const assignees = [...formData.assignees];
    const index = assignees.indexOf(memberId);
    
    if (index >= 0) {
      assignees.splice(index, 1);
    } else {
      assignees.push(memberId);
    }
    
    setFormData({ ...formData, assignees });
  };
  
  const handleFileClick = () => {
    fileInputRef.current.click();
  };
  
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files).map(file => ({
      id: Date.now() + Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }));
    
    setFormData({
      ...formData,
      documents: [...formData.documents, ...newFiles]
    });
  };
  
  const handleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    dropAreaRef.current.classList.remove('bg-blue-50', 'border-blue-300');
    
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files).map(file => ({
        id: Date.now() + Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        file: file
      }));
      
      setFormData({
        ...formData,
        documents: [...formData.documents, ...newFiles]
      });
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropAreaRef.current.classList.add('bg-blue-50', 'border-blue-300');
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropAreaRef.current.classList.remove('bg-blue-50', 'border-blue-300');
  };
  
  const removeFile = (fileId) => {
    setFormData({
      ...formData,
      documents: formData.documents.filter(doc => doc.id !== fileId)
    });
  };
  
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  useEffect(() => {
    // Add event listeners for drag and drop
    const dropArea = dropAreaRef.current;
    if (dropArea) {
      dropArea.addEventListener('dragover', handleDragOver);
      dropArea.addEventListener('dragleave', handleDragLeave);
      dropArea.addEventListener('drop', handleFileDrop);
      
      return () => {
        dropArea.removeEventListener('dragover', handleDragOver);
        dropArea.removeEventListener('dragleave', handleDragLeave);
        dropArea.removeEventListener('drop', handleFileDrop);
      };
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">
            {task.id ? 'Edit Task' : 'Create New Task'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 h-24"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="datetime-local"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assignees
            </label>
            <div className="border rounded-md p-3 max-h-40 overflow-y-auto">
              {teamMembers.map(member => (
                <div key={member.id} className="flex items-center mb-2 last:mb-0">
                  <input
                    type="checkbox"
                    id={`member-${member.id}`}
                    checked={formData.assignees.includes(member.id)}
                    onChange={() => handleAssigneeChange(member.id)}
                    className="mr-2"
                  />
                  <label htmlFor={`member-${member.id}`} className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-2">
                      {member.avatar}
                    </div>
                    <span>{member.name}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attachments
            </label>
            <div 
              ref={dropAreaRef}
              className="border border-dashed rounded-md p-6 text-center transition-colors duration-200"
              onClick={handleFileClick}
            >
              <FileText className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">
                Drop files here or click to upload
              </p>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                multiple
                onChange={handleFileChange}
              />
              <button
                type="button"
                className="mt-2 bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFileClick();
                }}
              >
                Browse Files
              </button>
            </div>
            
            {formData.documents && formData.documents.length > 0 && (
              <div className="mt-4 border rounded-md p-3 max-h-40 overflow-y-auto">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files</h4>
                {formData.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between py-1 border-b last:border-b-0">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm truncate max-w-xs">{doc.name}</div>
                        <div className="text-xs text-gray-500">{formatFileSize(doc.size)}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeFile(doc.id)}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Calendar View Component
const CalendarView = ({ tasks, onEditTask }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState([]);
  
  useEffect(() => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1));
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    
    setWeekDates(dates);
  }, [currentDate]);
  
  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };
  
  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      
      const taskDate = new Date(task.dueDate);
      return taskDate.getDate() === date.getDate() &&
             taskDate.getMonth() === date.getMonth() &&
             taskDate.getFullYear() === date.getFullYear();
    });
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'border-l-4 border-red-500';
      case 'Medium': return 'border-l-4 border-yellow-500';
      case 'Low': return 'border-l-4 border-green-500';
      default: return '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex justify-between items-center p-4 border-b">
        <button 
          onClick={() => navigateWeek(-1)}
          className="p-1 rounded-full hover:bg-gray-200"
        >
          &lt;
        </button>
        <h2 className="text-lg font-semibold">{formatMonthYear(currentDate)}</h2>
        <button 
          onClick={() => navigateWeek(1)}
          className="p-1 rounded-full hover:bg-gray-200"
        >
          &gt;
        </button>
      </div>
      
      <div className="grid grid-cols-7 border-b">
        {weekDates.map((date, index) => (
          <div 
            key={index} 
            className={`p-2 text-center border-r last:border-r-0 ${
              date.toDateString() === new Date().toDateString() ? 'bg-blue-50' : ''
            }`}
          >
            <div className="text-sm text-gray-500">
              {date.toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            <div className="font-semibold">
              {date.getDate()}
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 min-h-[500px]">
        {weekDates.map((date, index) => (
          <div key={index} className="border-r last:border-r-0 p-2 overflow-y-auto">
            {getTasksForDate(date).map(task => (
              <div 
                key={task.id}
                className={`p-2 mb-2 bg-white rounded shadow text-sm cursor-pointer hover:bg-gray-50 ${getPriorityColor(task.priority)}`}
                onClick={() => onEditTask(task)}
              >
                <div className="font-medium truncate">{task.title}</div>
                <div className="text-xs text-gray-500">
                  {new Date(task.dueDate).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit'
                  })}
                </div>
                <div className="flex mt-1">
                  {task.assignees.slice(0, 3).map(assigneeId => {
                    const member = teamMembers.find(m => m.id === assigneeId);
                    return member ? (
                      <div 
                        key={assigneeId}
                        className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs -ml-1 first:ml-0"
                        title={member.name}
                      >
                        {member.avatar}
                      </div>
                    ) : null;
                  })}
                  {task.assignees.length > 3 && (
                    <div className="w-5 h-5 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-xs -ml-1">
                      +{task.assignees.length - 3}
                    </div>
                  )}
                </div>
                {task.documents && task.documents.length > 0 && (
                  <div className="mt-1 flex items-center text-xs text-gray-500">
                    <Paperclip className="w-3 h-3 mr-1" />
                    {task.documents.length}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskApp;