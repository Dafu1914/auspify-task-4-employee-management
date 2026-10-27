import express from 'express';
import {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employeeController';

const router = express.Router();

router.route('/').get(getEmployees).post(createEmployee);
router.route('/:id').put(updateEmployee).delete(deleteEmployee);

export default router;