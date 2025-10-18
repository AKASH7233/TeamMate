import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { store } from './redux/store'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Project from './pages/Project'
import './App.css'

function App() {
    return (
        <Provider store={store}>
            <div className="dark">
                <Router>
                    <div className="App min-h-screen bg-dark-950 text-slate-100">
                        <Toaster
                            position="top-center"
                            containerClassName="!top-4 !left-4 !right-4 !max-w-none sm:!top-6 sm:!left-auto sm:!right-6 sm:!max-w-sm"
                            toastOptions={{
                                duration: 4000,
                                className: '!bg-slate-800 !text-slate-100 !border-slate-600 !shadow-2xl !rounded-xl !p-4 !text-sm sm:!text-base !max-w-full sm:!max-w-sm',
                                style: {
                                    background: '#1e293b',
                                    color: '#e2e8f0',
                                    border: '1px solid #334155',
                                    borderRadius: '12px',
                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                    padding: '12px 16px',
                                    fontSize: '14px',
                                    lineHeight: '1.4',
                                },
                                success: {
                                    iconTheme: {
                                        primary: '#10b981',
                                        secondary: '#1e293b',
                                    },
                                },
                                error: {
                                    iconTheme: {
                                        primary: '#ef4444',
                                        secondary: '#1e293b',
                                    },
                                },
                            }}
                        />
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/" element={
                                <ProtectedRoute>
                                    <Home />
                                </ProtectedRoute>
                            } />
                            <Route path="/projects/:projectId" element={
                                <ProtectedRoute>
                                    <Project />
                                </ProtectedRoute>
                            } />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </div>
                </Router>
            </div>
        </Provider>
    )
}

export default App