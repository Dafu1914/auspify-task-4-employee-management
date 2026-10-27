import axios from 'axios';

const API_URL = 'http://localhost:5000/api/employees';

export interface Employee {
  _id?: string;
  name: string;
  email: string;
  department: string;
  position: string;
  salary: number;
}

export const getEmployees = async (department?: string): Promise<Employee[]> => {
  const url = department ? `${API_URL}?department=${department}` : API_URL;
  const res = await axios.get(url);
  return res.data.data;
};

export const createEmployee = async (employee: Employee): Promise<Employee> => {
  const res = await axios.post(API_URL, employee);
  return res.data.data;
};

export const updateEmployee = async (id: string, employee: Employee): Promise<Employee> => {
  const res = await axios.put(`${API_URL}/${id}`, employee);
  return res.data.data;
};

export const deleteEmployee = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};