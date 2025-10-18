import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser, clearError } from '../redux/authSlice'
import { Eye, EyeOff, User, Mail, Lock, UserCircle, Sparkles, ArrowRight } from 'lucide-react'

const Register = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { loading, error } = useSelector((state) => state.auth)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        password: ''
    })

    // Clear error when component mounts or unmounts
    useEffect(() => {
        dispatch(clearError())
        return () => dispatch(clearError())
    }, [dispatch])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await dispatch(registerUser(formData)).unwrap()
            navigate('/login')
        } catch (error) {
            console.error('Registration failed:', error)
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-slate-900 flex items-center justify-center p-3 sm:p-4 md:p-6 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-accent-500/20 rounded-full blur-2xl sm:blur-3xl animate-pulse-slow"></div>
                <div className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-primary-500/20 rounded-full blur-2xl sm:blur-3xl animate-pulse-slow"></div>
                <div className="absolute top-1/3 left-1/3 w-60 h-60 sm:w-96 sm:h-96 bg-gradient-conic from-accent-500/10 via-primary-500/10 to-accent-500/10 rounded-full blur-2xl sm:blur-3xl animate-spin" style={{ animationDuration: '25s' }}></div>
            </div>

            <div className="w-full max-w-sm sm:max-w-md relative z-10 animate-fade-in-up">
                <div className="glass-dark rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-700/50">
                    {/* Header */}
                    <div className="text-center mb-6 sm:mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-accent-500 to-primary-500 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 shadow-lg animate-glow">
                            <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold gradient-text-accent mb-1 sm:mb-2">TaskMate</h1>
                        <p className="text-slate-400 font-medium text-sm sm:text-base">Create your account to get started</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                        {/* Full Name Field */}
                        <div className="space-y-1.5 sm:space-y-2">
                            <label htmlFor="fullName" className="text-xs sm:text-sm font-semibold text-slate-300">
                                Full Name
                            </label>
                            <div className="relative">
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg sm:rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500/50 transition-all duration-300 backdrop-blur-sm text-sm sm:text-base"
                                    placeholder="Enter your full name"
                                />
                                <User className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                            </div>
                        </div>

                        {/* Username Field */}
                        <div className="space-y-2">
                            <label htmlFor="username" className="text-sm font-semibold text-slate-300">
                                Username
                            </label>
                            <div className="relative">
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500/50 transition-all duration-300 backdrop-blur-sm"
                                    placeholder="Choose a username"
                                />
                                <UserCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-semibold text-slate-300">
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500/50 transition-all duration-300 backdrop-blur-sm"
                                    placeholder="Enter your email"
                                />
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-semibold text-slate-300">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-12 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500/50 transition-all duration-300 backdrop-blur-sm"
                                    placeholder="Create a password"
                                />
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <button
                                    type="button"
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors duration-200"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                Password should be at least 6 characters long
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm backdrop-blur-sm animate-fade-in">
                                {error}
                            </div>
                        )}

                        {/* Register Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full group relative overflow-hidden bg-gradient-to-r from-accent-600 to-primary-600 hover:from-accent-500 hover:to-primary-500 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-accent-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            <span className="relative z-10 flex items-center justify-center">
                                {loading ? (
                                    <div className="loading-dots">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                ) : (
                                    <>
                                        Create Account
                                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                                    </>
                                )}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-accent-400 to-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-slate-400">
                            Already have an account?{' '}
                            <Link 
                                to="/login" 
                                className="text-accent-400 hover:text-accent-300 font-semibold transition-colors duration-200 hover:underline"
                            >
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-accent-500/20 to-primary-500/20 rounded-full blur-xl animate-pulse-slow"></div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-full blur-xl animate-pulse-slow"></div>
            </div>
        </div>
    )
}

export default Register