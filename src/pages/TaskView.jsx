import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar as CalendarIcon, Clock, FileText, Users, CheckSquare, PlusCircle, 
  Search, X, Paperclip, CheckCircle, User, LogOut, ChevronRight,
  Upload, Download, MessageSquare, ChevronLeft
} from 'lucide-react';

// Mock data for team members
const teamMembers = [
  { id: 1, name: "Alex Johnson", email: "alex@example.com", avatar: "AJ", role: "Frontend Developer" },
  { id: 2, name: "Sarah Miller", email: "sarah@example.com", avatar: "SM", role: "UI/UX Designer" },
  { id: 3, name: "David Lee", email: "david@example.com", avatar: "DL", role: "Backend Developer" },
  { id: 4, name: "Emily Chen", email: "emily@example.com", avatar: "EC", role: "Project Manager" },
  { id: 5, name: "Robert Wilson", email: "robert@example.com", avatar: "RW", role: "QA Engineer" }
];

// Mock data for tasks
const initialTasks = [
  { 
    id: 1, 
    title: "Prepare Sprint Demo", 
    description: "Create slides and demos for the upcoming sprint review. Make sure to include all the key features developed during this sprint and prepare a short script for the presentation.", 
    assignees: [1, 3], 
    dueDate: "2025-05-20T16:00", 
    priority: "High",
    documents: [
      { id: "doc1", name: "Sprint-Demo-Template.pptx", size: 2500000, type: "application/vnd.openxmlformats-officedocument.presentationml.presentation" },
      { id: "doc2", name: "Feature-List.xlsx", size: 1200000, type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
    ],
    status: "In Progress",
    comments: [
      { id: 1, userId: 4, text: "Please include the new authentication feature in the demo", timestamp: "2025-05-15T09:30:00" },
      { id: 2, userId: 1, text: "Will do. I'll prepare the slides by tomorrow", timestamp: "2025-05-15T10:15:00" }
    ]
  },
  { 
    id: 2, 
    title: "Update Design System", 
    description: "Incorporate new brand guidelines into our design system. Update all component styles to match the new color palette and typography.", 
    assignees: [2], 
    dueDate: "2025-05-23T12:00", 
    priority: "Medium",
    documents: [
      { id: "doc3", name: "Brand-Guidelines.pdf", size: 4500000, type: "application/pdf" }
    ],
    status: "Not Started",
    comments: [
      { id: 3, userId: 4, text: "The marketing team has finalized the new brand colors", timestamp: "2025-05-16T14:20:00" }
    ]
  },
  { 
    id: 3, 
    title: "Code Review", 
    description: "Review pull requests for the authentication service. Check for code quality, test coverage, and security issues.", 
    assignees: [1, 3, 5], 
    dueDate: "2025-05-19T17:00", 
    priority: "High",
    documents: [],
    status: "Not Started",
    comments: []
  },
  { 
    id: 4, 
    title: "User Testing Coordination", 
    description: "Schedule and coordinate user testing sessions for the new dashboard interface. Recruit participants and prepare testing scenarios.", 
    assignees: [2, 4], 
    dueDate: "2025-05-25T15:00", 
    priority: "Medium",
    documents: [
      { id: "doc4", name: "Testing-Scenarios.docx", size: 850000, type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }
    ],
    status: "Not Started",
    comments: []
  },
  { 
    id: 5, 
    title: "API Documentation", 
    description: "Update the API documentation with the newly added endpoints. Include examples and response formats.", 
    assignees: [3, 5], 
    dueDate: "2025-05-21T12:00", 
    priority: "Low",
    documents: [],
    status: "In Progress",
    comments: []
  }
];

const CalendarView = ({ tasks, onTaskSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);

  useEffect(() => {
    generateCalendarDays();
  }, [currentDate, tasks]);

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of month
    const firstDay = new Date(year, month, 1);
    // Last day of month
    const lastDay = new Date(year, month + 1, 0);
    
    // Starting from the first Sunday before the first day of month
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());
    
    // Ending with the last Saturday after the last day of month
    const endDate = new Date(lastDay);
    if (endDate.getDay() < 6) {
      endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));
    }
    
    const days = [];
    const currentDateValue = new Date(startDate);
    
    while (currentDateValue <= endDate) {
      // Get tasks for this date
      const dayTasks = tasks.filter(task => {
        const taskDate = new Date(task.dueDate);
        return taskDate.getDate() === currentDateValue.getDate() &&
               taskDate.getMonth() === currentDateValue.getMonth() &&
               taskDate.getFullYear() === currentDateValue.getFullYear();
      });
      
      days.push({
        date: new Date(currentDateValue),
        isCurrentMonth: currentDateValue.getMonth() === month,
        isToday: isSameDay(currentDateValue, new Date()),
        tasks: dayTasks
      });
      
      currentDateValue.setDate(currentDateValue.getDate() + 1);
    }
    
    setCalendarDays(days);
  };
  
  const isSameDay = (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const formatMonth = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-yellow-800">Calendar</h3>
        <div className="flex items-center space-x-2">
          <button onClick={prevMonth} className="p-1 hover:bg-yellow-100 rounded">
            <ChevronLeft className="w-5 h-5 text-yellow-700" />
          </button>
          <span className="font-medium">{formatMonth(currentDate)}</span>
          <button onClick={nextMonth} className="p-1 hover:bg-yellow-100 rounded">
            <ChevronRight className="w-5 h-5 text-yellow-700" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs font-medium text-yellow-700 py-1">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <div 
            key={index}
            className={`border rounded-md h-20 overflow-hidden relative ${
              day.isCurrentMonth 
                ? day.isToday 
                  ? 'bg-yellow-100 border-yellow-400' 
                  : 'bg-white border-yellow-200'
                : 'bg-yellow-50 border-yellow-100 text-yellow-400'
            }`}
          >
            <div className="p-1 text-right text-xs">{day.date.getDate()}</div>
            <div className="px-1 max-h-14 overflow-y-auto">
              {day.tasks.map(task => (
                <div 
                  key={task.id}
                  className="mb-1 text-xs truncate cursor-pointer hover:bg-yellow-100 rounded px-1 py-0.5"
                  onClick={() => onTaskSelect(task)}
                >
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-1 ${getPriorityColor(task.priority)}`}></div>
                    <span>{task.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


// Personal Dashboard Component
const TaskView = () => {
  // Use URL params to get user ID in real application
  // For demo, we'll hardcode to user ID 1 (Alex Johnson)
  const currentUserId = 1;
  const currentUser = teamMembers.find(m => m.id === currentUserId);
  
  const [tasks, setTasks] = useState(initialTasks);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [newComment, setNewComment] = useState("");
  const fileInputRef = useRef(null);
  const [viewMode, setViewMode] = useState("");
  // Filter tasks assigned to current user
  useEffect(() => {
    const userTasks = tasks.filter(task => task.assignees.includes(currentUserId));
    
    const filtered = userTasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === "All" || task.status === filterStatus;
      const matchesPriority = filterPriority === "All" || task.priority === filterPriority;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
    
    setFilteredTasks(filtered);
    
    // If no task is selected or the selected task is not in filtered tasks, select the first one
    if ((!selectedTask && filtered.length > 0) || 
        (selectedTask && !filtered.find(t => t.id === selectedTask.id))) {
      setSelectedTask(filtered[0] || null);
    }
  }, [tasks, searchQuery, filterStatus, filterPriority, currentUserId, selectedTask]);
  
  const handleTaskSelect = (task) => {
    setSelectedTask(task);
    if (viewMode === "calendar") {
      setViewMode("list"); // Switch to list view when selecting task from calendar
    }
  };

   const toggleViewMode = () => {
    setViewMode(viewMode === "list" ? "calendar" : "list");
  };
  const handleStatusChange = (newStatus) => {
    const updatedTasks = tasks.map(task => 
      task.id === selectedTask.id ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    setSelectedTask({ ...selectedTask, status: newStatus });
  };
  
  const handleFileUpload = (e) => {
    if (!selectedTask) return;
    
    const newFiles = Array.from(e.target.files).map(file => ({
      id: Date.now() + Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }));
    
    const updatedTask = {
      ...selectedTask,
      documents: [...selectedTask.documents, ...newFiles]
    };
    
    setTasks(tasks.map(task => 
      task.id === selectedTask.id ? updatedTask : task
    ));
    
    setSelectedTask(updatedTask);
  };
  
  const handleDeleteFile = (fileId) => {
    if (!selectedTask) return;
    
    const updatedFiles = selectedTask.documents.filter(doc => doc.id !== fileId);
    const updatedTask = {
      ...selectedTask,
      documents: updatedFiles
    };
    
    setTasks(tasks.map(task => 
      task.id === selectedTask.id ? updatedTask : task
    ));
    
    setSelectedTask(updatedTask);
  };
  
  const handleAddComment = () => {
    if (!newComment.trim() || !selectedTask) return;
    
    const comment = {
      id: Date.now(),
      userId: currentUserId,
      text: newComment.trim(),
      timestamp: new Date().toISOString()
    };
    
    const updatedComments = [...selectedTask.comments, comment];
    const updatedTask = {
      ...selectedTask,
      comments: updatedComments
    };
    
    setTasks(tasks.map(task => 
      task.id === selectedTask.id ? updatedTask : task
    ));
    
    setSelectedTask(updatedTask);
    setNewComment("");
    setShowCommentInput(false);
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
  
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  const getFileIcon = (fileType) => {
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word')) return '📝';
    if (fileType.includes('sheet') || fileType.includes('excel')) return '📊';
    if (fileType.includes('presentation') || fileType.includes('powerpoint')) return '📑';
    return '📎';
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Not Started': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-yellow-50">
      {/* Header Bar */}
      <header className="bg-yellow-500 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-yellow-700 text-white flex items-center justify-center text-lg font-bold">
              {currentUser?.avatar}
            </div>
            <div>
              <h1 className="text-xl font-semibold">{currentUser?.name}</h1>
              <p className="text-sm text-yellow-100">{currentUser?.role}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
             <button 
              className={`px-3 py-1 rounded-md flex items-center text-sm ${
                viewMode === "list" 
                ? "bg-yellow-600 hover:bg-yellow-700" 
                : "bg-yellow-400 hover:bg-yellow-500"
              }`}
              onClick={toggleViewMode}
            >
              {viewMode === "list" 
                ? <CalendarIcon className="w-4 h-4 mr-1" /> 
                : <Users className="w-4 h-4 mr-1" />
              }
              {viewMode === "list" ? "Calendar View" : "Task View"}
            </button>
            <button className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded-md flex items-center text-sm">
              <User className="w-4 h-4 mr-1" />
              Profile
            </button>
            <button className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded-md flex items-center text-sm">
              <LogOut className="w-4 h-4 mr-1" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-grow">
        {/* Side Panel - Task List */}
        <div className="w-72 bg-yellow-100 border-r border-yellow-200 shadow-md flex flex-col">
          <div className="p-4 border-b border-yellow-200">
            <h2 className="text-lg font-semibold text-yellow-800 mb-3">My Tasks</h2>
            <div className="relative mb-3">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-yellow-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks..."
                className="pl-8 pr-4 py-1.5 w-full border border-yellow-300 rounded-md bg-yellow-50 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex space-x-2 mb-2">
              <select 
                className="flex-1 text-xs border border-yellow-300 rounded-md px-2 py-1 bg-yellow-50 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <select 
                className="flex-1 text-xs border border-yellow-300 rounded-md px-2 py-1 bg-yellow-50 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="All">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
          <div className="flex-grow overflow-y-auto">
            {filteredTasks.length === 0 ? (
              <div className="p-4 text-center text-yellow-600">
                No tasks found
              </div>
            ) : (
              filteredTasks.map(task => (
                <div 
                  key={task.id}
                  className={`p-3 border-b border-yellow-200 cursor-pointer hover:bg-yellow-200 transition-colors ${
                    selectedTask?.id === task.id ? 'bg-yellow-200' : ''
                  }`}
                  onClick={() => handleTaskSelect(task)}
                >
                  <div className="flex items-center mb-1">
                    <div 
                      className={`w-2 h-2 rounded-full mr-2 ${
                        task.status === 'Completed' ? 'bg-green-500' : 
                        task.status === 'In Progress' ? 'bg-blue-500' : 'bg-gray-500'
                      }`}
                    />
                    <h3 className="font-medium text-yellow-900 truncate flex-grow">{task.title}</h3>
                    <ChevronRight className="w-4 h-4 text-yellow-500" />
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className={`px-1.5 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className="text-yellow-700">
                      Due: {formatDate(task.dueDate).split(',')[0]}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Main Content - Task Details */}
        <div className="flex-grow p-6 overflow-y-auto">

           {viewMode === "calendar" ? (
            <CalendarView tasks={tasks.filter(task => task.assignees.includes(currentUserId))} onTaskSelect={handleTaskSelect} />
          ):selectedTask ? (
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center mb-2">
                    <h2 className="text-2xl font-bold text-yellow-900">{selectedTask.title}</h2>
                  </div>
                  <div className="flex space-x-2 mb-1">
                    <span className={`text-sm px-2 py-0.5 rounded-full ${getStatusColor(selectedTask.status)}`}>
                      {selectedTask.status}
                    </span>
                    <span className={`text-sm px-2 py-0.5 rounded-full ${getPriorityColor(selectedTask.priority)}`}>
                      {selectedTask.priority}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-yellow-700">
                    <Clock className="w-4 h-4 mr-1" />
                    Due: {formatDate(selectedTask.dueDate)}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    className={`px-3 py-1.5 rounded-md flex items-center font-medium
                      ${selectedTask.status !== 'Completed' 
                        ? 'bg-green-500 hover:bg-green-600 text-white' 
                        : 'bg-yellow-200 text-yellow-700'}`}
                    onClick={() => handleStatusChange('Completed')}
                    disabled={selectedTask.status === 'Completed'}
                  >
                    <CheckCircle className="w-4 h-4 mr-1.5" />
                    {selectedTask.status === 'Completed' ? 'Completed' : 'Mark Complete'}
                  </button>
                  {selectedTask.status !== 'Completed' && selectedTask.status !== 'In Progress' && (
                    <button 
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-md flex items-center font-medium"
                      onClick={() => handleStatusChange('In Progress')}
                    >
                      <CheckSquare className="w-4 h-4 mr-1.5" />
                      Start Task
                    </button>
                  )}
                </div>
              </div>
              
              {/* Description */}
              <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">{selectedTask.description}</p>
              </div>
              
              {/* Assignees */}
              <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-3">Team Members</h3>
                <div className="flex flex-wrap">
                  {selectedTask.assignees.map(assigneeId => {
                    const member = teamMembers.find(m => m.id === assigneeId);
                    return member ? (
                      <div key={assigneeId} className="flex items-center mr-4 mb-2">
                        <div className="w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center mr-2">
                          {member.avatar}
                        </div>
                        <div>
                          <div className="font-medium text-yellow-900">{member.name}</div>
                          <div className="text-xs text-yellow-700">{member.role}</div>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Comments Section */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-yellow-800">Comments</h3>
                    <button 
                      className="text-sm bg-yellow-200 hover:bg-yellow-300 text-yellow-800 px-2 py-1 rounded flex items-center"
                      onClick={() => setShowCommentInput(!showCommentInput)}
                    >
                      <MessageSquare className="w-3 h-3 mr-1" />
                      Add Comment
                    </button>
                  </div>
                  
                  {showCommentInput && (
                    <div className="mb-4">
                      <textarea
                        className="w-full border border-yellow-300 rounded-md p-2 mb-2 text-sm"
                        placeholder="Type your comment here..."
                        rows={3}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                      <div className="flex justify-end space-x-2">
                        <button 
                          className="text-sm text-yellow-800 px-2 py-1 hover:bg-yellow-100 rounded"
                          onClick={() => setShowCommentInput(false)}
                        >
                          Cancel
                        </button>
                        <button 
                          className="text-sm bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                          onClick={handleAddComment}
                          disabled={!newComment.trim()}
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {selectedTask.comments.length === 0 ? (
                      <div className="text-sm text-yellow-600 text-center py-4">
                        No comments yet
                      </div>
                    ) : (
                      selectedTask.comments.map(comment => {
                        const commenter = teamMembers.find(m => m.id === comment.userId);
                        return (
                          <div key={comment.id} className="border-b border-yellow-100 pb-3 last:border-b-0">
                            <div className="flex items-center mb-1">
                              <div className="w-6 h-6 rounded-full bg-yellow-200 text-yellow-800 flex items-center justify-center text-xs mr-2">
                                {commenter?.avatar || '??'}
                              </div>
                              <div className="text-sm font-medium">{commenter?.name || 'Unknown'}</div>
                              <div className="text-xs text-yellow-600 ml-auto">
                                {formatDate(comment.timestamp)}
                              </div>
                            </div>
                            <div className="text-sm text-gray-700 pl-8">{comment.text}</div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
                
                {/* Files Section */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-yellow-800">Files & Attachments</h3>
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        multiple
                        onChange={handleFileUpload}
                      />
                      <button 
                        className="text-sm bg-yellow-200 hover:bg-yellow-300 text-yellow-800 px-2 py-1 rounded flex items-center"
                        onClick={() => fileInputRef.current.click()}
                      >
                        <Upload className="w-3 h-3 mr-1" />
                        Upload Files
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {selectedTask.documents.length === 0 ? (
                      <div className="text-sm text-yellow-600 text-center py-8 border border-dashed border-yellow-300 rounded-md">
                        <Paperclip className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                        No files attached
                      </div>
                    ) : (
                      selectedTask.documents.map((document, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between p-2 bg-yellow-50 border border-yellow-200 rounded-md"
                        >
                          <div className="flex items-center truncate">
                            <span className="text-xl mr-2">{getFileIcon(document.type)}</span>
                            <div className="truncate">
                              <div className="text-sm font-medium truncate">{document.name}</div>
                              <div className="text-xs text-yellow-600">{formatFileSize(document.size)}</div>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <button 
                              className="p-1 text-blue-600 hover:text-blue-800"
                              title="Download file"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button 
                              className="p-1 text-red-600 hover:text-red-800"
                              title="Delete file"
                              onClick={() => handleDeleteFile(document.id)}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-yellow-600">
              <div className="text-center">
                <Paperclip className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
                <p>Select a task to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskView;