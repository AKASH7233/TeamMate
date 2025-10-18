import { useDrop } from 'react-dnd'
import { useDispatch } from 'react-redux'
import { moveTask, optimisticMoveTask } from '../../redux/taskSlice'
import { Plus, Circle, Clock, CheckCircle } from 'lucide-react'
import TaskCard from './TaskCard'

const KanbanColumn = ({ column, tasks, onAddTask, projectId }) => {
    const dispatch = useDispatch()

    const [{ isOver }, drop] = useDrop({
        accept: 'TASK',
        drop: (item) => {
            if (item.status !== column.id) {
                const sourceIndex = tasks.findIndex(t => t._id === item.id)
                const destinationIndex = tasks.length

                dispatch(optimisticMoveTask({
                    taskId: item.id,
                    sourceStatus: item.status,
                    destinationStatus: column.id,
                    sourceIndex: item.index,
                    destinationIndex
                }))

                dispatch(moveTask({
                    taskId: item.id,
                    newStatus: column.id,
                    newPosition: destinationIndex
                }))
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver()
        })
    })

    const getIcon = () => {
        switch (column.id) {
            case 'todo':
                return <Circle className="h-4 w-4" />
            case 'inprogress':
                return <Clock className="h-4 w-4" />
            case 'done':
                return <CheckCircle className="h-4 w-4" />
            default:
                return <Circle className="h-4 w-4" />
        }
    }

    return (
        <div
            ref={drop}
            className={`glass-dark ${column.color} rounded-2xl p-4 sm:p-6 min-h-[400px] sm:min-h-[500px] transition-all duration-300 ${
                isOver ? 'ring-2 ring-primary-400 scale-105 shadow-2xl shadow-primary-500/20' : 'hover:shadow-xl'
            }`}
        >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className={`p-2 rounded-lg ${column.headerColor} transition-colors duration-200`}>
                        <span className={column.iconColor}>
                            {getIcon()}
                        </span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-200 text-sm sm:text-base">
                            {column.title}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${column.headerColor} ${column.iconColor}`}>
                            {tasks.length} task{tasks.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>
                <button
                    onClick={onAddTask}
                    className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-all duration-200 border border-transparent hover:border-slate-600/50 group"
                    title={`Add task to ${column.title}`}
                >
                    <Plus size={16} className="group-hover:rotate-90 transition-transform duration-200" />
                </button>
            </div>

            {/* Tasks Container */}
            <div className="space-y-3 sm:space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar">
                {tasks.map((task, index) => (
                    <TaskCard
                        key={task._id}
                        task={task}
                        index={index}
                        projectId={projectId}
                    />
                ))}
            </div>

            {/* Empty State */}
            {tasks.length === 0 && (
                <div className="text-center py-8 sm:py-12">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full ${column.headerColor} flex items-center justify-center mx-auto mb-4 animate-pulse-slow`}>
                        <span className={`${column.iconColor} text-lg sm:text-xl`}>
                            {getIcon()}
                        </span>
                    </div>
                    <p className="text-slate-400 text-sm mb-4">No tasks in {column.title.toLowerCase()}</p>
                    <button
                        onClick={onAddTask}
                        className={`text-sm font-medium transition-all duration-200 px-4 py-2 rounded-lg border border-dashed ${column.color} hover:bg-slate-800/30 ${column.iconColor} hover:border-solid`}
                    >
                        Add your first task
                    </button>
                </div>
            )}
        </div>
    )
}

export default KanbanColumn