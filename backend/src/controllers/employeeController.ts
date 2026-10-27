import { Request, Response } from 'express';
import Employee from '../models/Employee';

// Create an employee
export const createEmployee = async (req: Request, res: Response) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json({ success: true, data: employee });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all employees (with optional department filter)
export const getEmployees = async (req: Request, res: Response) => {
  try {
    const department = req.query.department as string | undefined;
    const filter = department ? { department } : {};
    const employees = await Employee.find(filter);
    res.status(200).json({ success: true, count: employees.length, data: employees });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update an employee
export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!employee) return res.status(404).json({ success: false, error: 'Employee not found' });
    res.status(200).json({ success: true, data: employee });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete an employee
export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ success: false, error: 'Employee not found' });
    res.status(200).json({ success: true, message: 'Employee deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};