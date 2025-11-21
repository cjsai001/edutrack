import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Plus, 
  Search, 
  Trash2, 
  Edit2, 
  Sparkles,
  BarChart2,
  BrainCircuit,
  Database
} from 'lucide-react';
import { Student, ViewState, AIAnalysisResult } from './types';
import StudentForm from './components/StudentForm';
import Dashboard from './components/Dashboard';
import { analyzeStudentPerformance, generateMockData } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('DASHBOARD');
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  
  // AI State
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<{name: string, result: AIAnalysisResult} | null>(null);
  const [generatingData, setGeneratingData] = useState(false);

  // Load mock data on first visit if empty
  useEffect(() => {
    const saved = localStorage.getItem('edutrack_students');
    if (saved) {
      setStudents(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('edutrack_students', JSON.stringify(students));
  }, [students]);

  const handleGenerateData = async () => {
    setGeneratingData(true);
    const data = await generateMockData();
    if (data.length > 0) {
      setStudents(prev => [...prev, ...data]);
    }
    setGeneratingData(false);
  };

  const handleSaveStudent = (student: Student) => {
    if (editingStudent) {
      setStudents(students.map(s => s.id === student.id ? student : s));
    } else {
      setStudents([...students, student]);
    }
    setIsFormOpen(false);
    setEditingStudent(null);
  };

  const handleDeleteStudent = (id: string) => {
    if (window.confirm('Are you sure you want to delete this student record?')) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setIsFormOpen(true);
  };

  const handleAnalyze = async (student: Student) => {
    setAnalyzingId(student.id);
    const result = await analyzeStudentPerformance(student);
    setAnalyzingId(null);
    setSelectedAnalysis({ name: student.name, result });
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex z-10">
        <div className="p-6 flex items-center gap-3 border-b border-gray-100">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <GraduationCap className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-xl text-gray-800">EduTrack</span>
        </div>
        
        <nav className="p-4 space-y-2 flex-1">
          <button 
            onClick={() => setView('DASHBOARD')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
              ${view === 'DASHBOARD' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}
            `}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>
          <button 
            onClick={() => setView('STUDENTS')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
              ${view === 'STUDENTS' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}
            `}
          >
            <Users size={20} />
            Students & Results
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
           <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <BrainCircuit size={20} />
                <span className="font-semibold text-sm">AI Powered</span>
              </div>
              <p className="text-xs text-indigo-100 leading-relaxed">
                Use Gemini to analyze student performance gaps instantly.
              </p>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
          <h1 className="text-xl font-semibold text-gray-800">
            {view === 'DASHBOARD' ? 'Overview' : 'Student Management'}
          </h1>
          
          <div className="flex items-center gap-4">
             {/* Mobile Menu Button (implied visible on small screens via standard Tailwind display utilities if we added them, keeping simple here) */}
             <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Instructor Mode</span>
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xs border border-indigo-200">
                  IM
                </div>
             </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {view === 'DASHBOARD' ? (
            <Dashboard students={students} />
          ) : (
            <div className="space-y-6">
              {/* Toolbar */}
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="Search by name or roll number..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                   {students.length === 0 && (
                      <button 
                        onClick={handleGenerateData}
                        disabled={generatingData}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition disabled:opacity-50"
                      >
                         {generatingData ? <span className="animate-spin">⏳</span> : <Database size={18} />}
                         {generatingData ? 'Generating...' : 'Populate Mock Data'}
                      </button>
                   )}
                  <button 
                    onClick={() => { setEditingStudent(null); setIsFormOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition shadow-sm hover:shadow"
                  >
                    <Plus size={20} />
                    Add Result
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 font-semibold text-gray-700">Student Info</th>
                        <th className="px-6 py-4 font-semibold text-gray-700 text-center">Math</th>
                        <th className="px-6 py-4 font-semibold text-gray-700 text-center">Sci</th>
                        <th className="px-6 py-4 font-semibold text-gray-700 text-center">Eng</th>
                        <th className="px-6 py-4 font-semibold text-gray-700 text-center">Hist</th>
                        <th className="px-6 py-4 font-semibold text-gray-700 text-center">Prog</th>
                        <th className="px-6 py-4 font-semibold text-gray-700 text-center">Total</th>
                        <th className="px-6 py-4 font-semibold text-gray-700 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                            No students found. Add one or generate mock data.
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map((student) => {
                          const total = Object.values(student.marks).reduce((a, b) => a + b, 0);
                          const avg = total / 5;
                          const isFailing = Object.values(student.marks).some(m => m < 35);
                          
                          return (
                            <tr key={student.id} className="hover:bg-gray-50 transition-colors group">
                              <td className="px-6 py-4">
                                <div>
                                  <p className="font-semibold text-gray-900">{student.name}</p>
                                  <p className="text-xs text-gray-500">{student.rollNumber}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center font-medium text-gray-600">{student.marks.math}</td>
                              <td className="px-6 py-4 text-center font-medium text-gray-600">{student.marks.science}</td>
                              <td className="px-6 py-4 text-center font-medium text-gray-600">{student.marks.english}</td>
                              <td className="px-6 py-4 text-center font-medium text-gray-600">{student.marks.history}</td>
                              <td className="px-6 py-4 text-center font-medium text-gray-600">{student.marks.programming}</td>
                              <td className="px-6 py-4 text-center">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                  ${isFailing ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}
                                `}>
                                  {total} ({avg.toFixed(1)}%)
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    onClick={() => handleAnalyze(student)}
                                    disabled={analyzingId === student.id}
                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg tooltip-trigger relative group/btn"
                                    title="AI Analysis"
                                  >
                                    {analyzingId === student.id ? (
                                      <span className="animate-spin block w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full"></span>
                                    ) : (
                                      <Sparkles size={18} />
                                    )}
                                  </button>
                                  <button 
                                    onClick={() => handleEditStudent(student)}
                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                    title="Edit"
                                  >
                                    <Edit2 size={18} />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteStudent(student.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                    title="Delete"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        {isFormOpen && (
          <StudentForm 
            initialData={editingStudent} 
            onSave={handleSaveStudent} 
            onClose={() => setIsFormOpen(false)} 
          />
        )}

        {selectedAnalysis && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="text-yellow-300" size={24} />
                    AI Performance Review
                  </h3>
                  <p className="text-indigo-100 text-sm mt-1">For {selectedAnalysis.name}</p>
                </div>
                <button onClick={() => setSelectedAnalysis(null)} className="text-white/80 hover:text-white transition">
                  <span className="text-2xl">&times;</span>
                </button>
              </div>
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                <div>
                   <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Summary</h4>
                   <p className="text-gray-800 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                     {selectedAnalysis.result.summary}
                   </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-green-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-green-500"></span> Strengths
                    </h4>
                    <ul className="space-y-1">
                      {selectedAnalysis.result.strengths.map((s, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                           <span className="text-green-500 mt-1">✓</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-amber-500"></span> Focus Areas
                    </h4>
                    <ul className="space-y-1">
                      {selectedAnalysis.result.weaknesses.map((w, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                           <span className="text-amber-500 mt-1">!</span> {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
                  <h4 className="text-sm font-bold text-indigo-700 uppercase tracking-wider mb-2">Teacher's Recommendation</h4>
                  <p className="text-indigo-900 text-sm italic">
                    "{selectedAnalysis.result.recommendation}"
                  </p>
                </div>
              </div>
              <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
                <button 
                  onClick={() => setSelectedAnalysis(null)}
                  className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition shadow-sm"
                >
                  Close Report
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
