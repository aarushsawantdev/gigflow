import { Router } from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCSV,
  getLeadStats,
} from '../controllers/lead.controller';
import { protect, requireRole } from '../middleware/auth';
import { leadValidation } from '../middleware/validate';

const router = Router();

// All routes require authentication
router.use(protect);

router.get('/stats', getLeadStats);
router.get('/export/csv', exportLeadsCSV);

router.get('/', getLeads);
router.post('/', leadValidation, createLead);

router.get('/:id', getLeadById);
router.put('/:id', leadValidation, updateLead);
router.delete('/:id', requireRole('admin'), deleteLead);

export default router;
