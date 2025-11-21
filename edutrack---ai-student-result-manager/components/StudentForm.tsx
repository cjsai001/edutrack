import React, { useState, useEffect } from 'react';
import { Student, SubjectMarks } from '../types';
import { X, Save } from 'lucide-react';

interface StudentFormProps {
  initialData?: Student | null;
  onSave: (student: Student) => void;
  onClose: () => void;
}

const emptyMarks: SubjectMarks = { math: 0, science: 0, english: 0, history: 0, programming: 0 };

const StudentForm: React.FC<StudentFormProps> = ({ initialData, onSave, onClose }) => {
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [email, setEmail] = useState('');
  const [marks, setMarks] = useState<SubjectMarks>(emptyMarks);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setRollNumber(initialData.rollNumber);
      setEmail(initialData.email);
      setMarks(initialData.marks);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialData ? initialData.id : crypto.randomUUID(),
      name,
      rollNumber,
      email,
      marks,
      aiAnalysis: initialData?.aiAnalysis 
    });
  };

  const handleMarkChange = (subject: keyof SubjectMarks, value: string) => {
    const numValue = Math.min(100, Math.max(0, Number(value) || 0));
    setMarks(prev => ({ ...prev, [subject]: numValue }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-indigo-600">
          <h2 className="text-xl font-bold text-white">
            {initialData ? 'Edit Student Result' : 'Add New Student Result'}
          </h2>
          <button onClick={onClose} className="text-white hover:bg-indigo-700 p-2 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 border-b pb-2">Student Details</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                <input
                  required
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="2024-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 border-b pb-2">Subject Marks (0-100)</h3>
              <div className="grid grid-cols-2 gap-4">
                {(Object.keys(emptyMarks) as Array<keyof SubjectMarks>).map((subject) => (
                  <div key={subject}>
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{subject}</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={marks[subject]}
                      onChange={(e) => handleMarkChange(subject, e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition
                        ${marks[subject] < 35 ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                      `}
                    />
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded">
                * Marks below 35 are highlighted as potential fail grades.
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center gap-2 transition shadow-md hover:shadow-lg"
            >
              <Save size={18} />
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
