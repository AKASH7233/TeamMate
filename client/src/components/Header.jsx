import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { logout } from '../redux/authSlice'
import { LogOut, Home, FolderOpen, Sparkles } from 'lucide-react'

const Header = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useSelector((state) => state.auth)

    const handleLogout = () => {
        dispatch(logout())
        navigate('/login')
    }

    const isActive = (path) => {
        return location.pathname === path
    }

    return (
        <header className="glass-dark shadow-2xl border-b border-slate-700/50 sticky top-0 z-50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-4 sm:space-x-8">
                        <Link 
                            to="/" 
                            className="flex items-center space-x-2 sm:space-x-3 group"
                        >
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 animate-glow">
                                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                            </div>
                            <h1 className="text-xl sm:text-2xl font-bold gradient-text group-hover:scale-105 transition-transform duration-200">
                                TaskMate
                            </h1>
                        </Link>

                        <nav className="hidden md:flex space-x-2">
                            <Link 
                                to="/" 
                                className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                    isActive('/') 
                                        ? 'text-primary-400 bg-primary-500/10 border border-primary-500/30 shadow-lg shadow-primary-500/20' 
                                        : 'text-slate-300 hover:text-primary-400 hover:bg-slate-800/50 border border-transparent hover:border-slate-600/50'
                                }`}
                            >
                                <Home className="h-4 w-4" />
                                <span>Projects</span>
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="flex items-center space-x-2 sm:space-x-3 glass-dark rounded-xl px-2 sm:px-3 py-2 border border-slate-600/30">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-accent-500 to-primary-500 rounded-full flex items-center justify-center shadow-lg">
                                    <span className="text-white text-xs sm:text-sm font-semibold">
                                        {user?.fullName?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </span>
                                </div>
                                <div className="hidden sm:block">
                                    <div className="text-sm font-medium text-slate-200">
                                        {user?.fullName || user?.name || 'User'}
                                    </div>
                                    <div className="text-xs text-slate-400">
                                        @{user?.username || 'username'}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 rounded-xl transition-all duration-200 shadow-lg hover:shadow-red-500/20"
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header