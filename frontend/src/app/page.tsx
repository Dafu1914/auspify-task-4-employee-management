'use client';

import { useEffect, useState } from 'react';
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  Employee,
} from '@/lib/api';

export default function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [form, setForm] = useState<Employee>({
    name: '',
    email: '',
    department: '',
    position: '',
    salary: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  const loadEmployees = async () => {
    try {
      const data = await getEmployees(departmentFilter || undefined);
      setEmployees(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, [departmentFilter]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === 'salary' ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateEmployee(editingId, form);
        setEditingId(null);
      } else {
        await createEmployee(form);
      }
      setForm({ name: '', email: '', department: '', position: '', salary: 0 });
      loadEmployees();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error saving employee');
    }
  };

  const handleEdit = (emp: Employee) => {
    setForm({
      name: emp.name,
      email: emp.email,
      department: emp.department,
      position: emp.position,
      salary: emp.salary,
    });
    setEditingId(emp._id!);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this employee?')) {
      await deleteEmployee(id);
      loadEmployees();
    }
  };

  const filteredEmployees = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.position.toLowerCase().includes(search.toLowerCase())
  );

  const departments = Array.from(new Set(employees.map((e) => e.department)));
  
  // Reports calculations
  const totalEmployees = employees.length;
  const totalPayroll = employees.reduce((sum, e) => sum + e.salary, 0);

  return (
    <main className="min-h-screen bg-slate-900 p-8 font-sans text-slate-200">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-8">
          🏢 Employee Management System
        </h1>

        {/* REPORTS DASHBOARD */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
            <p className="text-slate-400 text-sm font-semibold mb-1">Total Employees</p>
            <p className="text-3xl font-bold text-white">{totalEmployees}</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
            <p className="text-slate-400 text-sm font-semibold mb-1">Total Monthly Payroll</p>
            <p className="text-3xl font-bold text-emerald-400">${totalPayroll.toFixed(2)}</p>
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="department"
            value={form.department}
            onChange={handleChange}
            placeholder="Department"
            required
            className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="position"
            value={form.position}
            onChange={handleChange}
            placeholder="Position"
            required
            className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="salary"
            type="number"
            value={form.salary || ''}
            onChange={handleChange}
            placeholder="Salary ($)"
            required
            className="bg-slate-900 border border-slate-700 p-3 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition"
          >
            {editingId ? 'Update Employee' : 'Add Employee'}
          </button>
        </form>

        {/* FILTERS */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="🔍 Search by name, email, or position..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-700 p-3 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 p-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-300">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Department</th>
                <th className="p-4">Position</th>
                <th className="p-4">Salary</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No employees found. Add one above!
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp._id} className="border-b border-slate-700/50 hover:bg-slate-700/50 transition">
                    <td className="p-4 text-white font-medium">{emp.name}</td>
                    <td className="p-4 text-slate-300">{emp.email}</td>
                    <td className="p-4 text-slate-300">
                      <span className="bg-slate-900 px-3 py-1 rounded-full text-xs font-semibold text-indigo-400 border border-slate-700">
                        {emp.department}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300">{emp.position}</td>
                    <td className="p-4 text-emerald-400 font-semibold">${emp.salary.toFixed(2)}</td>
                    <td className="p-4 flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleEdit(emp)}
                        className="bg-amber-500/10 text-amber-400 px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-amber-500/20"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(emp._id!)}
                        className="bg-rose-500/10 text-rose-400 px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-rose-500/20"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}