import { Response } from 'express';
import { AuthRequest, LeadQueryParams, LeadStatus, LeadSource } from '../types';
import { Lead } from '../models/Lead';

// ─── GET ALL LEADS (with filter, search, sort, pagination) ────────────────────
export const getLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '10',
      status,
      source,
      search,
      sort = 'latest',
    } = req.query as LeadQueryParams;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Build filter object
    const filter: Record<string, unknown> = {};

    // Role-based: sales users only see their own leads
    if (req.user?.role === 'sales') {
      filter.createdBy = req.user.id;
    }

    if (status) filter.status = status;
    if (source) filter.source = source;

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ name: regex }, { email: regex }];
    }

    const sortOrder: Record<string, 1 | -1> = sort === 'oldest'
      ? { createdAt: 1 }
      : { createdAt: -1 };

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .populate('createdBy', 'name email')
        .sort(sortOrder)
        .skip(skip)
        .limit(limitNum),
      Lead.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      message: 'Leads fetched successfully.',
      data: leads,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch {
    res.status(500).json({ success: false, message: 'Server error fetching leads.' });
  }
};

// ─── GET SINGLE LEAD ──────────────────────────────────────────────────────────
export const getLeadById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email');

    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead not found.' });
      return;
    }

    // Sales users can only view their own leads
    if (req.user?.role === 'sales' && lead.createdBy.toString() !== req.user.id) {
      res.status(403).json({ success: false, message: 'Access denied.' });
      return;
    }

    res.status(200).json({ success: true, message: 'Lead fetched.', data: lead });
  } catch {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── CREATE LEAD ──────────────────────────────────────────────────────────────
export const createLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, status, source, notes } = req.body;

    const lead = await Lead.create({
      name,
      email,
      status: status || 'New',
      source,
      notes,
      createdBy: req.user!.id,
    });

    res.status(201).json({ success: true, message: 'Lead created.', data: lead });
  } catch (error: unknown) {
    const err = error as { code?: number; message?: string };
    if (err.code === 11000) {
      res.status(409).json({ success: false, message: 'A lead with this email already exists.' });
      return;
    }
    res.status(500).json({ success: false, message: 'Server error creating lead.' });
  }
};

// ─── UPDATE LEAD ──────────────────────────────────────────────────────────────
export const updateLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead not found.' });
      return;
    }

    // Sales users can only update their own leads
    if (req.user?.role === 'sales' && lead.createdBy.toString() !== req.user.id) {
      res.status(403).json({ success: false, message: 'Access denied.' });
      return;
    }

    const updated = await Lead.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    res.status(200).json({ success: true, message: 'Lead updated.', data: updated });
  } catch {
    res.status(500).json({ success: false, message: 'Server error updating lead.' });
  }
};

// ─── DELETE LEAD ──────────────────────────────────────────────────────────────
export const deleteLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead not found.' });
      return;
    }

    // Only admins can delete leads
    if (req.user?.role === 'sales') {
      res.status(403).json({ success: false, message: 'Only admins can delete leads.' });
      return;
    }

    await lead.deleteOne();

    res.status(200).json({ success: true, message: 'Lead deleted successfully.' });
  } catch {
    res.status(500).json({ success: false, message: 'Server error deleting lead.' });
  }
};

// ─── EXPORT LEADS AS CSV ──────────────────────────────────────────────────────
export const exportLeadsCSV = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.user?.role === 'sales') filter.createdBy = req.user.id;

    const { status, source, search } = req.query as LeadQueryParams;
    if (status) filter.status = status;
    if (source) filter.source = source;
    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ name: regex }, { email: regex }];
    }

    const leads = await Lead.find(filter).populate('createdBy', 'name email').lean();

    const csvRows = [
      ['Name', 'Email', 'Status', 'Source', 'Notes', 'Created By', 'Created At'],
      ...leads.map((lead) => {
        const creator = lead.createdBy as unknown as { name: string; email: string };
        return [
          lead.name,
          lead.email,
          lead.status,
          lead.source,
          lead.notes || '',
          creator?.name || '',
          new Date(lead.createdAt).toISOString(),
        ];
      }),
    ];

    const csvContent = csvRows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
    res.status(200).send(csvContent);
  } catch {
    res.status(500).json({ success: false, message: 'Server error exporting CSV.' });
  }
};

// ─── GET LEAD STATS (admin only) ──────────────────────────────────────────────
export const getLeadStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.user?.role === 'sales') filter.createdBy = req.user.id;

    const [statusStats, sourceStats, total] = await Promise.all([
      Lead.aggregate([
        { $match: filter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Lead.aggregate([
        { $match: filter },
        { $group: { _id: '$source', count: { $sum: 1 } } },
      ]),
      Lead.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      message: 'Stats fetched.',
      data: { total, byStatus: statusStats, bySource: sourceStats },
    });
  } catch {
    res.status(500).json({ success: false, message: 'Server error fetching stats.' });
  }
};
