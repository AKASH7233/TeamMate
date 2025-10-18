import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { summarizeTasks, askAboutTasks, clearSummary, clearAnswer, clearError } from '../../redux/aiSlice'
import { X, Bot, Sparkles, MessageSquare, AlertCircle } from 'lucide-react'

const AIAssistant = ({ onClose, projectId }) => {
    const dispatch = useDispatch()
    const { summary, answer, loading, error } = useSelector((state) => state.ai)
    const [question, setQuestion] = useState('')
    const [activeTab, setActiveTab] = useState('summary')

    // Clear errors when component mounts
    useEffect(() => {
        dispatch(clearError())
    }, [dispatch])

    const handleSummarize = async () => {
        try {
            console.log('[AIAssistant] Starting summarize for project:', projectId)
            dispatch(clearError())
            const result = await dispatch(summarizeTasks(projectId)).unwrap()
            console.log('[AIAssistant] Summarize completed successfully:', result)
        } catch (error) {
            console.error('[AIAssistant] Failed to summarize tasks:', error)
            console.error('[AIAssistant] Error type:', typeof error)
            console.error('[AIAssistant] Error details:', error)
        }
    }

    const handleAsk = async (e) => {
        e.preventDefault()
        if (question.trim()) {
            try {
                dispatch(clearError())
                await dispatch(askAboutTasks({
                    projectId,
                    question: question.trim()
                })).unwrap()
                setQuestion('')
            } catch (error) {
                console.error('Failed to get AI response:', error)
            }
        }
    }

    const handleTabChange = (tab) => {
        setActiveTab(tab)
        dispatch(clearError())
        if (tab === 'summary') {
            dispatch(clearAnswer())
        } else {
            dispatch(clearSummary())
        }
    }

    const handleClose = () => {
        dispatch(clearError())
        dispatch(clearSummary())
        dispatch(clearAnswer())
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 p-2 sm:p-4 md:p-6 animate-fade-in overflow-y-auto ai-modal-container">
            <div className="glass-dark rounded-2xl sm:rounded-3xl w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl mx-auto my-4 sm:my-auto max-h-[95vh] sm:max-h-[90vh] md:max-h-[85vh] flex flex-col shadow-2xl border border-slate-700/50 animate-scale-in modal-container">
                <div className="flex justify-between items-center p-3 sm:p-4 md:p-6 border-b border-slate-700/50 flex-shrink-0">
                    <div className="flex items-center">
                        <div className="p-1.5 sm:p-2 bg-gradient-to-br from-accent-500 to-primary-500 rounded-lg sm:rounded-xl shadow-lg mr-2 sm:mr-3">
                            <Bot className="text-white h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                        </div>
                        <h2 className="text-base sm:text-lg md:text-xl font-bold gradient-text">AI Assistant</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg sm:rounded-xl transition-all duration-200 border border-transparent hover:border-slate-600/50"
                    >
                        <X size={16} className="sm:w-5 sm:h-5" />
                    </button>
                </div>

                <div className="flex border-b border-slate-700/50 flex-shrink-0">
                    <button
                        onClick={() => handleTabChange('summary')}
                        className={`flex-1 px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm font-medium flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 transition-all duration-200 ${
                            activeTab === 'summary'
                                ? 'text-accent-400 border-b-2 border-accent-500 bg-accent-500/10'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                        }`}
                    >
                        <Sparkles size={12} className="sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                        <span className="hidden sm:inline">Summarize</span>
                        <span className="sm:hidden">Summary</span>
                    </button>
                    <button
                        onClick={() => handleTabChange('qa')}
                        className={`flex-1 px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm font-medium flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 transition-all duration-200 ${
                            activeTab === 'qa'
                                ? 'text-primary-400 border-b-2 border-primary-500 bg-primary-500/10'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                        }`}
                    >
                        <MessageSquare size={12} className="sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                        <span className="hidden sm:inline">Questions</span>
                        <span className="sm:hidden">Q&A</span>
                    </button>
                </div>

                <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto custom-scrollbar min-h-0">
                    {/* Error Display */}
                    {error && (
                        <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-red-500/10 border border-red-500/30 rounded-lg sm:rounded-xl max-w-full">
                            <div className="flex items-start gap-2 sm:gap-3">
                                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <div className="min-w-0 flex-1">
                                    <h4 className="text-red-400 font-medium text-xs sm:text-sm mb-1">Error</h4>
                                    <p className="text-red-300 text-xs sm:text-sm leading-relaxed break-words">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'summary' ? (
                        <div>
                            <div className="mb-3 sm:mb-4 md:mb-6">
                                <button
                                    onClick={handleSummarize}
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-accent-600 to-primary-600 hover:from-accent-500 hover:to-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-accent-500/25 transform hover:scale-105 disabled:transform-none text-xs sm:text-sm md:text-base font-medium"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="loading-dots scale-50 sm:scale-75">
                                                <div></div>
                                                <div></div>
                                                <div></div>
                                                <div></div>
                                            </div>
                                            <span className="text-xs sm:text-sm">AI is thinking...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <Sparkles size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
                                            <span className="hidden sm:inline">Generate Summary</span>
                                            <span className="sm:hidden">Generate</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            {summary && (
                                <div className="glass-dark rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border border-slate-600/30">
                                    <h3 className="font-semibold text-slate-200 mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm md:text-base">Project Summary</h3>
                                    <div className="prose prose-sm max-w-none">
                                        {summary.split('\n').map((line, index) => {
                                            const trimmedLine = line.trim();
                                            if (!trimmedLine) return null;
                                            
                                            // Handle headers (### or ##)
                                            if (trimmedLine.startsWith('### ')) {
                                                return (
                                                    <h4 key={index} className="text-accent-400 font-semibold text-sm sm:text-base mt-4 mb-2 first:mt-0">
                                                        {trimmedLine.replace('### ', '')}
                                                    </h4>
                                                );
                                            }
                                            if (trimmedLine.startsWith('## ')) {
                                                return (
                                                    <h3 key={index} className="text-primary-400 font-bold text-base sm:text-lg mt-4 mb-3 first:mt-0">
                                                        {trimmedLine.replace('## ', '')}
                                                    </h3>
                                                );
                                            }
                                            
                                            // Handle bullet points
                                            if (trimmedLine.startsWith('*   ') || trimmedLine.startsWith('* ')) {
                                                const bulletText = trimmedLine.replace(/^\*\s+/, '');
                                                return (
                                                    <div key={index} className="flex items-start gap-2 mb-1.5 sm:mb-2 ml-4">
                                                        <span className="text-accent-400 mt-1">•</span>
                                                        <span 
                                                            className="text-slate-300 leading-relaxed text-xs sm:text-sm"
                                                            dangerouslySetInnerHTML={{
                                                                __html: bulletText
                                                                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-100 font-semibold">$1</strong>')
                                                                    .replace(/\*(.*?)\*/g, '<em class="text-slate-200 italic">$1</em>')
                                                            }}
                                                        />
                                                    </div>
                                                );
                                            }
                                            
                                            // Handle horizontal rules
                                            if (trimmedLine === '---') {
                                                return <hr key={index} className="border-slate-600/50 my-3 sm:my-4" />;
                                            }
                                            
                                            // Handle regular paragraphs with bold and italic formatting
                                            return (
                                                <p 
                                                    key={index} 
                                                    className="mb-1.5 sm:mb-2 text-slate-300 leading-relaxed text-xs sm:text-sm"
                                                    dangerouslySetInnerHTML={{
                                                        __html: trimmedLine
                                                            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-100 font-semibold">$1</strong>')
                                                            .replace(/\*(.*?)\*/g, '<em class="text-slate-200 italic">$1</em>')
                                                    }}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <form onSubmit={handleAsk} className="mb-3 sm:mb-4 md:mb-6">
                                <div className="flex flex-col gap-2 sm:gap-3">
                                    <input
                                        type="text"
                                        value={question}
                                        onChange={(e) => setQuestion(e.target.value)}
                                        placeholder="Ask about your tasks..."
                                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg sm:rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-300 backdrop-blur-sm text-xs sm:text-sm md:text-base"
                                        disabled={loading}
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading || !question.trim()}
                                        className="w-full sm:w-auto bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 sm:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary-500/25 transform hover:scale-105 disabled:transform-none text-xs sm:text-sm md:text-base font-medium"
                                    >
                                        {loading ? (
                                            <div className="flex items-center gap-2">
                                                <div className="loading-dots scale-50 sm:scale-75">
                                                    <div></div>
                                                    <div></div>
                                                    <div></div>
                                                    <div></div>
                                                </div>
                                                <span className="text-xs sm:text-sm">AI is thinking...</span>
                                            </div>
                                        ) : (
                                            'Ask AI'
                                        )}
                                    </button>
                                </div>
                            </form>

                            {answer && (
                                <div className="glass-dark rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border border-slate-600/30 mb-3 sm:mb-4 md:mb-6">
                                    <h3 className="font-semibold text-slate-200 mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm md:text-base">AI Response</h3>
                                    <div className="prose prose-sm max-w-none">
                                        {answer.split('\n').map((line, index) => {
                                            const trimmedLine = line.trim();
                                            if (!trimmedLine) return null;
                                            
                                            // Handle headers (### or ##)
                                            if (trimmedLine.startsWith('### ')) {
                                                return (
                                                    <h4 key={index} className="text-accent-400 font-semibold text-sm sm:text-base mt-4 mb-2 first:mt-0">
                                                        {trimmedLine.replace('### ', '')}
                                                    </h4>
                                                );
                                            }
                                            if (trimmedLine.startsWith('## ')) {
                                                return (
                                                    <h3 key={index} className="text-primary-400 font-bold text-base sm:text-lg mt-4 mb-3 first:mt-0">
                                                        {trimmedLine.replace('## ', '')}
                                                    </h3>
                                                );
                                            }
                                            
                                            // Handle bullet points
                                            if (trimmedLine.startsWith('*   ') || trimmedLine.startsWith('* ')) {
                                                const bulletText = trimmedLine.replace(/^\*\s+/, '');
                                                return (
                                                    <div key={index} className="flex items-start gap-2 mb-1.5 sm:mb-2 ml-4">
                                                        <span className="text-accent-400 mt-1">•</span>
                                                        <span 
                                                            className="text-slate-300 leading-relaxed text-xs sm:text-sm"
                                                            dangerouslySetInnerHTML={{
                                                                __html: bulletText
                                                                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-100 font-semibold">$1</strong>')
                                                                    .replace(/\*(.*?)\*/g, '<em class="text-slate-200 italic">$1</em>')
                                                            }}
                                                        />
                                                    </div>
                                                );
                                            }
                                            
                                            // Handle horizontal rules
                                            if (trimmedLine === '---') {
                                                return <hr key={index} className="border-slate-600/50 my-3 sm:my-4" />;
                                            }
                                            
                                            // Handle regular paragraphs with bold and italic formatting
                                            return (
                                                <p 
                                                    key={index} 
                                                    className="mb-1.5 sm:mb-2 text-slate-300 leading-relaxed text-xs sm:text-sm"
                                                    dangerouslySetInnerHTML={{
                                                        __html: trimmedLine
                                                            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-100 font-semibold">$1</strong>')
                                                            .replace(/\*(.*?)\*/g, '<em class="text-slate-200 italic">$1</em>')
                                                    }}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="glass-dark rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-600/30">
                                <p className="font-medium mb-2 sm:mb-3 text-slate-300 text-xs sm:text-sm">Example questions:</p>
                                <ul className="space-y-1 sm:space-y-2 text-slate-400">
                                    <li className="text-xs sm:text-sm">• What tasks are overdue?</li>
                                    <li className="text-xs sm:text-sm">• How many tasks are completed?</li>
                                    <li className="text-xs sm:text-sm">• What should I work on next?</li>
                                    <li className="text-xs sm:text-sm">• Summarize progress this week</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AIAssistant