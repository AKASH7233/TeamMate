import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllProjects, deleteProject } from '../../redux/projectSlice'
import { Link } from 'react-router-dom'
import { Plus, Trash2, Calendar, FolderOpen, Users, Clock } from 'lucide-react'
import ProjectForm from './ProjectForm'
import Header from '../Header'

const ProjectList = () => {
    const dispatch = useDispatch()
    const { projects, loading } = useSelector((state) => state.projects)
    const [showForm, setShowForm] = useState(false)

    useEffect(() => {
        dispatch(getAllProjects())
    }, [dispatch])

    const handleDeleteProject = async (projectId) => {
        if (window.confirm('Are you sure you want to delete this project? This will also delete all associated tasks.')) {
            await dispatch(deleteProject(projectId))
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    if (loading) {
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
                        <p className="text-slate-300 font-medium">Loading projects...</p>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-slate-900 py-4 sm:py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
                        <div className="text-center sm:text-left">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-2 animate-fade-in">
                                Your Projects
                            </h1>
                            <p className="text-slate-400 text-sm sm:text-base animate-fade-in-up">
                                Manage and organize your projects efficiently
                            </p>
                        </div>
                        <button
                            onClick={() => setShowForm(true)}
                            className="group bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white px-4 sm:px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary-500/25 transform hover:scale-105 animate-fade-in font-medium"
                        >
                            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                            <span className="hidden sm:inline">New Project</span>
                            <span className="sm:hidden">New</span>
                        </button>
                    </div>

                    {projects.length === 0 ? (
                        <div className="text-center py-12 sm:py-20 animate-fade-in-up">
                            <div className="glass-dark rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-700/50 max-w-2xl mx-auto">
                                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
                                    <FolderOpen size={32} className="sm:w-12 sm:h-12 text-primary-400" />
                                </div>
                                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-200 mb-3">
                                    No projects yet
                                </h3>
                                <p className="text-slate-400 mb-8 text-sm sm:text-base lg:text-lg leading-relaxed max-w-md mx-auto">
                                    Get started by creating your first project and begin organizing your tasks with our intuitive Kanban board
                                </p>
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="group bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary-500/25 transform hover:scale-105 font-medium text-sm sm:text-base"
                                >
                                    <span className="flex items-center gap-2">
                                        Create Your First Project
                                        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                                    </span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                            {projects.map((project, index) => (
                                <div
                                    key={project._id}
                                    className="glass-dark rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-4 sm:p-6 border border-slate-700/50 hover:border-primary-500/30 transform hover:-translate-y-2 hover:scale-105 card-hover group animate-fade-in"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    {/* Project Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg sm:text-xl font-bold text-slate-200 mb-2 line-clamp-1 group-hover:text-primary-400 transition-colors duration-200">
                                                {project.name}
                                            </h3>
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-xs sm:text-sm text-slate-400">
                                                <div className="flex items-center space-x-1">
                                                    <Calendar size={12} className="flex-shrink-0" />
                                                    <span className="truncate">{formatDate(project.createdAt)}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Users size={12} className="flex-shrink-0" />
                                                    <span>1 member</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteProject(project._id)}
                                            className="text-slate-400 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg border border-transparent hover:border-red-500/30 ml-2 flex-shrink-0"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    
                                    {/* Project Description */}
                                    <p className="text-slate-300 mb-4 sm:mb-6 line-clamp-3 text-sm leading-relaxed">
                                        {project.description || 'No description provided'}
                                    </p>
                                    
                                    {/* Project Meta */}
                                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                                        <div className="flex items-center space-x-2 text-xs text-slate-400">
                                            <Clock size={12} />
                                            <span className="truncate">Updated {formatDate(project.updatedAt)}</span>
                                        </div>
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-400 rounded-full animate-pulse"></div>
                                            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                        </div>
                                    </div>
                                    
                                    {/* Open Board Button */}
                                    <Link
                                        to={`/projects/${project._id}`}
                                        className="block w-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white text-center py-2 sm:py-3 rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:shadow-primary-500/25 transform hover:scale-105 text-sm sm:text-base"
                                    >
                                        Open Board
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {showForm && (
                    <ProjectForm
                        onClose={() => setShowForm(false)}
                    />
                )}
            </div>
        </>
    )
}

export default ProjectList