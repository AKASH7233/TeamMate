import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { getProjectById } from '../../redux/projectSlice'
import { getTasksByProject } from '../../redux/taskSlice'
import { ArrowLeft, Plus, Bot, Calendar, Users, BarChart3 } from 'lucide-react'
import KanbanColumn from './KanbanColumn'
import TaskForm from './TaskForm'
import AIAssistant from './AIAssistant'
import Header from '../Header'

const ProjectBoard = () => {
    const { projectId } = useParams()
    const dispatch = useDispatch()
    const { currentProject } = useSelector((state) => state.projects)
    const { tasks, loading } = useSelector((state) => state.tasks)
    const [showTaskForm, setShowTaskForm] = useState(false)
    const [showAIAssistant, setShowAIAssistant] = useState(false)
    const [selectedColumn, setSelectedColumn] = useState('todo')

    useEffect(() => {
        if (projectId) {
            dispatch(getProjectById(projectId))
            dispatch(getTasksByProject(projectId))
        }
    }, [dispatch, projectId])

    const columns = [
        { id: 'todo', title: 'To Do', color: 'border-red-500/30 bg-red-500/5', headerColor: 'bg-red-500/10 text-red-400', iconColor: 'text-red-400' },
        { id: 'inprogress', title: 'In Progress', color: 'border-yellow-500/30 bg-yellow-500/5', headerColor: 'bg-yellow-500/10 text-yellow-400', iconColor: 'text-yellow-400' },
        { id: 'done', title: 'Done', color: 'border-green-500/30 bg-green-500/5', headerColor: 'bg-green-500/10 text-green-400', iconColor: 'text-green-400' }
    ]

    const handleAddTask = (columnId) => {
        setSelectedColumn(columnId)
        setShowTaskForm(true)
    }

    const getTotalTasks = () => {
        return Object.values(tasks).flat().length
    }

    const getCompletedTasks = () => {
        return tasks.done ? tasks.done.length : 0
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    if (loading && !currentProject) {
        return (
            <>
                <Header />
                <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-slate-900">
                    <div className="text-center glass-dark rounded-2xl p-8 border border-slate-700/50">
                        <div className="loading-dots mx-auto mb-4">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                        <p className="text-slate-300 font-medium">Loading project...</p>
                    </div>
                </div>
            </>
        )
    }

    if (!currentProject) {
        return (
            <>
                <Header />
                <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-slate-900">
                    <div className="text-center glass-dark p-8 rounded-3xl shadow-2xl border border-slate-700/50 max-w-md mx-4">
                        <h2 className="text-2xl font-bold text-slate-200 mb-4">Project not found</h2>
                        <p className="text-slate-400 mb-6">The project you're looking for doesn't exist or has been deleted.</p>
                        <Link 
                            to="/" 
                            className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary-500/25 transform hover:scale-105"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Go back to projects</span>
                        </Link>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <Header />
            <DndProvider backend={HTML5Backend}>
                <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-slate-900">
                    {/* Project Header Section */}
                    <div className="glass-dark shadow-2xl border-b border-slate-700/50">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="py-4 sm:py-6">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 sm:mb-6 space-y-4 lg:space-y-0">
                                    <div className="flex items-start space-x-3 sm:space-x-4">
                                        <Link
                                            to="/"
                                            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-xl transition-all duration-200 border border-transparent hover:border-slate-600/50 mt-1"
                                        >
                                            <ArrowLeft size={20} />
                                        </Link>
                                        <div className="min-w-0 flex-1">
                                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-1 sm:mb-2 line-clamp-2">
                                                {currentProject.name}
                                            </h1>
                                            <p className="text-slate-400 text-sm sm:text-base line-clamp-2">
                                                {currentProject.description || 'No description provided'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                                        <button
                                            onClick={() => setShowAIAssistant(true)}
                                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-accent-600 to-primary-600 hover:from-accent-500 hover:to-primary-500 text-white px-4 sm:px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-accent-500/25 transform hover:scale-105 font-medium text-sm sm:text-base"
                                        >
                                            <Bot size={18} />
                                            <span className="hidden sm:inline">AI Assistant</span>
                                            <span className="sm:hidden">AI</span>
                                        </button>
                                        <button
                                            onClick={() => handleAddTask('todo')}
                                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white px-4 sm:px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary-500/25 transform hover:scale-105 font-medium text-sm sm:text-base"
                                        >
                                            <Plus size={18} />
                                            <span className="hidden sm:inline">Add Task</span>
                                            <span className="sm:hidden">Add</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6">
                                    <div className="glass-dark p-3 sm:p-4 rounded-xl border border-primary-500/20 hover:border-primary-500/40 transition-all duration-200">
                                        <div className="flex items-center space-x-2 sm:space-x-3">
                                            <div className="p-1.5 sm:p-2 bg-primary-600 rounded-lg">
                                                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-xs sm:text-sm text-primary-400 font-medium">Total</p>
                                                <p className="text-lg sm:text-2xl font-bold text-primary-300">{getTotalTasks()}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="glass-dark p-3 sm:p-4 rounded-xl border border-green-500/20 hover:border-green-500/40 transition-all duration-200">
                                        <div className="flex items-center space-x-2 sm:space-x-3">
                                            <div className="p-1.5 sm:p-2 bg-green-600 rounded-lg">
                                                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-xs sm:text-sm text-green-400 font-medium">Done</p>
                                                <p className="text-lg sm:text-2xl font-bold text-green-300">{getCompletedTasks()}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="glass-dark p-3 sm:p-4 rounded-xl border border-accent-500/20 hover:border-accent-500/40 transition-all duration-200">
                                        <div className="flex items-center space-x-2 sm:space-x-3">
                                            <div className="p-1.5 sm:p-2 bg-accent-600 rounded-lg">
                                                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-xs sm:text-sm text-accent-400 font-medium">Created</p>
                                                <p className="text-sm sm:text-lg font-bold text-accent-300 truncate">{formatDate(currentProject.createdAt)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="glass-dark p-3 sm:p-4 rounded-xl border border-orange-500/20 hover:border-orange-500/40 transition-all duration-200">
                                        <div className="flex items-center space-x-2 sm:space-x-3">
                                            <div className="p-1.5 sm:p-2 bg-orange-600 rounded-lg">
                                                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-xs sm:text-sm text-orange-400 font-medium">Members</p>
                                                <p className="text-lg sm:text-2xl font-bold text-orange-300">1</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Kanban Board */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                            {columns.map((column) => (
                                <KanbanColumn
                                    key={column.id}
                                    column={column}
                                    tasks={tasks[column.id] || []}
                                    onAddTask={() => handleAddTask(column.id)}
                                    projectId={projectId}
                                />
                            ))}
                        </div>
                    </div>

                    {showTaskForm && (
                        <TaskForm
                            onClose={() => setShowTaskForm(false)}
                            projectId={projectId}
                            initialStatus={selectedColumn}
                        />
                    )}

                    {showAIAssistant && (
                        <AIAssistant
                            onClose={() => setShowAIAssistant(false)}
                            projectId={projectId}
                        />
                    )}
                </div>
            </DndProvider>
        </>
    )
}

export default ProjectBoard