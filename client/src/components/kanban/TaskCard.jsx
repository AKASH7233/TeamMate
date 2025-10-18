import { useState } from 'react'
import { useDrag } from 'react-dnd'
import { useDispatch } from 'react-redux'
import { deleteTask } from '../../redux/taskSlice'
import { Edit, Trash2, Calendar, GripVertical } from 'lucide-react'
import TaskForm from './TaskForm'

const TaskCard = ({ task, index, projectId }) => {
    const dispatch = useDispatch()
    const [showEditForm, setShowEditForm] = useState(false)

    const [{ isDragging }, drag] = useDrag({
        type: 'TASK',
        item: {
            id: task._id,
            status: task.status,
            index
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    })

    const handleDeleteTask = async () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            await dispatch(deleteTask(task._id))
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        })
    }

    const getStatusConfig = () => {
        switch (task.status) {
            case 'todo':
                return {
                    bg: 'bg-red-500/10',
                    text: 'text-red-400',
                    border: 'border-red-500/30',
                    label: 'To Do'
                }
            case 'inprogress':
                return {
                    bg: 'bg-yellow-500/10',
                    text: 'text-yellow-400',
                    border: 'border-yellow-500/30',
                    label: 'In Progress'
                }
            case 'done':
                return {
                    bg: 'bg-green-500/10',
                    text: 'text-green-400',
                    border: 'border-green-500/30',
                    label: 'Done'
                }
            default:
                return {
                    bg: 'bg-slate-500/10',
                    text: 'text-slate-400',
                    border: 'border-slate-500/30',
                    label: 'Unknown'
                }
        }
    }

    const statusConfig = getStatusConfig()

    return (
        <>
            <div
                ref={drag}
                className={`group glass-dark rounded-xl p-4 shadow-lg hover:shadow-2xl border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 cursor-move card-hover ${
                    isDragging ? 'opacity-50 scale-95 rotate-3' : 'hover:scale-105'
                }`}
            >
                {/* Task Header */}
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-start space-x-2 flex-1 min-w-0">
                        <GripVertical className="text-slate-500 mt-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" size={14} />
                        <h4 className="font-semibold text-slate-200 line-clamp-2 text-sm sm:text-base leading-tight group-hover:text-primary-400 transition-colors duration-200">
                            {task.title}
                        </h4>
                    </div>
                    <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                        <button
                            onClick={() => setShowEditForm(true)}
                            className="text-slate-400 hover:text-primary-400 transition-colors p-1.5 rounded-lg hover:bg-slate-800/50"
                            title="Edit task"
                        >
                            <Edit size={12} />
                        </button>
                        <button
                            onClick={handleDeleteTask}
                            className="text-slate-400 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10"
                            title="Delete task"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                </div>

                {/* Task Description */}
                {task.description && (
                    <p className="text-slate-300 text-xs sm:text-sm mb-4 line-clamp-3 leading-relaxed">
                        {task.description}
                    </p>
                )}

                {/* Task Footer */}
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center text-slate-400">
                        <Calendar size={10} className="mr-1.5" />
                        <span>{formatDate(task.createdAt)}</span>
                    </div>
                    <div className={`px-2 py-1 rounded-lg text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                        {statusConfig.label}
                    </div>
                </div>

                {/* Hover indicator */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>

            {showEditForm && (
                <TaskForm
                    onClose={() => setShowEditForm(false)}
                    projectId={projectId}
                    task={task}
                />
            )}
        </>
    )
}

export default TaskCard