import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createProject, updateProject } from '../../redux/projectSlice'
import { X, FolderPlus, Edit3 } from 'lucide-react'

const ProjectForm = ({ onClose, project = null }) => {
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({
        name: project?.name || '',
        description: project?.description || ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (project) {
            await dispatch(updateProject({
                projectId: project._id,
                projectData: formData
            }))
        } else {
            await dispatch(createProject(formData))
        }
        
        onClose()
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 p-2 sm:p-4 md:p-6 animate-fade-in overflow-y-auto ai-modal-container">
            <div className="glass-dark rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto my-4 sm:my-auto shadow-2xl border border-slate-700/50 animate-scale-in modal-container">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl shadow-lg">
                            {project ? (
                                <Edit3 className="h-5 w-5 text-white" />
                            ) : (
                                <FolderPlus className="h-5 w-5 text-white" />
                            )}
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold gradient-text">
                            {project ? 'Edit Project' : 'Create New Project'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-xl transition-all duration-200 border border-transparent hover:border-slate-600/50"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Project Name Field */}
                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-semibold text-slate-300">
                            Project Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-300 backdrop-blur-sm"
                            placeholder="Enter a descriptive project name"
                            required
                        />
                    </div>

                    {/* Description Field */}
                    <div className="space-y-2">
                        <label htmlFor="description" className="block text-sm font-semibold text-slate-300">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-300 backdrop-blur-sm resize-none"
                            placeholder="Describe what this project is about..."
                            required
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 text-slate-300 bg-slate-800/50 border border-slate-600/50 rounded-xl hover:bg-slate-700/50 hover:border-slate-500/50 transition-all duration-200 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary-500/25 transform hover:scale-105 font-medium"
                        >
                            {project ? 'Update Project' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ProjectForm