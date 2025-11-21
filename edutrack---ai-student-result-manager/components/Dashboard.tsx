import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Student } from '../types';
import { Users, BookOpen, Trophy, AlertTriangle } from 'lucide-react';

interface DashboardProps {
  students: Student[];
}

const Dashboard: React.FC<DashboardProps> = ({ students }) => {
  const totalStudents = students.length;
  
  // Calculate averages per subject
  const subjects = ['math', 'science', 'english', 'history', 'programming'];
  const data = subjects.map(subject => {
    const total = students.reduce((sum, s) => sum + (s.marks[subject as keyof typeof s.marks] || 0), 0);
    return {
      name: subject.charAt(0).toUpperCase() + subject.slice(1),
      average: totalStudents ? Math.round(total / totalStudents) : 0
    };
  });

  // Calculate pass rate (assume pass if avg > 40)
  const passedCount = students.filter(s => {
    const avg = Object.values(s.marks).reduce((a, b) => a + b, 0) / 5;
    return avg >= 40;
  }).length;

  const topPerformer = students.reduce((prev, current) => {
    const prevAvg = Object.values(prev?.marks || {}).reduce((a, b) => a + b, 0);
    const currAvg = Object.values(current.marks).reduce((a, b) => a + b, 0);
    return (prevAvg > currAvg) ? prev : current;
  }, students[0]);

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Users} 
          label="Total Students" 
          value={totalStudents} 
          color="bg-blue-500" 
        />
        <StatCard 
          icon={BookOpen} 
          label="Class Average" 
          value={totalStudents ? `${Math.round(data.reduce((acc, curr) => acc + curr.average, 0) / 5)}%` : 'N/A'} 
          color="bg-indigo-500" 
        />
        <StatCard 
          icon={Trophy} 
          label="Pass Rate" 
          value={totalStudents ? `${Math.round((passedCount / totalStudents) * 100)}%` : 'N/A'} 
          color="bg-emerald-500" 
        />
        <StatCard 
          icon={AlertTriangle} 
          label="Top Performer" 
          value={topPerformer ? topPerformer.name.split(' ')[0] : '-'} 
          color="bg-amber-500" 
        />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Subject Performance Overview</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
              <Tooltip 
                cursor={{fill: 'transparent'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="average" radius={[4, 4, 0, 0]} barSize={50}>
                 {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b'][index % 5]} />
                  ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
