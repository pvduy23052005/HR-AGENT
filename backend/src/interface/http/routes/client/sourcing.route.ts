import express from 'express';
import * as controller from '../../controllers/client/sourcing.controller';

const router = express.Router();

// POST /sourcing/search — trigger sourcing from GitHub / LinkedIn
router.post('/search', controller.searchCandidates);

// GET /sourcing/leads — get saved leads (optional ?jobID=&source=)
router.get('/leads', controller.getLeads);

// PATCH /sourcing/leads/:id/status — update lead status
router.patch('/leads/:id/status', controller.updateLeadStatus);

// DELETE /sourcing/leads/:id — remove a lead
router.delete('/leads/:id', controller.deleteLead);

export const sourcingRoute: express.Router = router;
