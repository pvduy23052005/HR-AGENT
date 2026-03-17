"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLead = exports.updateLeadStatus = exports.getLeads = exports.searchCandidates = void 0;
const source_candidates_use_case_1 = require("../../../../application/use-cases/client/sourcing/source-candidates.use-case");
const get_sourcing_leads_use_case_1 = require("../../../../application/use-cases/client/sourcing/get-sourcing-leads.use-case");
const sourcing_lead_repository_1 = require("../../../../infrastructure/database/repositories/client/sourcing-lead.repository");
const sourcingLeadRepository = new sourcing_lead_repository_1.SourcingLeadRepository();
// [POST] /sourcing/search
const searchCandidates = async (req, res) => {
    try {
        const { keywords, sources, limit, jobID } = req.body;
        if (!keywords || typeof keywords !== 'string' || !keywords.trim()) {
            res.status(400).json({ success: false, message: 'Thiếu từ khoá tìm kiếm!' });
            return;
        }
        const validSources = ['github', 'linkedin'];
        const requestedSources = Array.isArray(sources)
            ? sources.filter((s) => validSources.includes(s))
            : ['github'];
        if (requestedSources.length === 0) {
            res.status(400).json({ success: false, message: 'Nguồn tìm kiếm không hợp lệ. Chọn "github" hoặc "linkedin".' });
            return;
        }
        const useCase = new source_candidates_use_case_1.SourceCandidatesUseCase(sourcingLeadRepository);
        const leads = await useCase.execute({
            keywords: keywords.trim(),
            sources: requestedSources,
            limit: typeof limit === 'number' ? limit : 10,
            jobID,
        });
        res.status(200).json({
            success: true,
            message: `Tìm thấy ${leads.length} ứng viên tiềm năng`,
            total: leads.length,
            leads: leads.map((l) => l.getSummary()),
        });
    }
    catch (error) {
        const e = error;
        console.error('[Sourcing] searchCandidates error:', e.message);
        res.status(500).json({ success: false, message: e.message ?? 'Lỗi khi tìm kiếm ứng viên!' });
    }
};
exports.searchCandidates = searchCandidates;
// [GET] /sourcing/leads
const getLeads = async (req, res) => {
    try {
        const { jobID, source } = req.query;
        const validSources = ['github', 'linkedin'];
        const sourceFilter = validSources.includes(source)
            ? source
            : undefined;
        const useCase = new get_sourcing_leads_use_case_1.GetSourcingLeadsUseCase(sourcingLeadRepository);
        const leads = await useCase.execute({
            jobID: jobID,
            source: sourceFilter,
        });
        res.status(200).json({
            success: true,
            message: 'Thành công',
            total: leads.length,
            leads: leads.map((l) => l.getSummary()),
        });
    }
    catch (error) {
        const e = error;
        res.status(500).json({ success: false, message: e.message ?? 'Lỗi khi lấy danh sách leads!' });
    }
};
exports.getLeads = getLeads;
// [PATCH] /sourcing/leads/:id/status
const updateLeadStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const validStatuses = ['new', 'contacted', 'rejected'];
        if (!validStatuses.includes(status)) {
            res.status(400).json({ success: false, message: 'Status không hợp lệ. Chọn: new | contacted | rejected' });
            return;
        }
        const updated = await sourcingLeadRepository.updateStatus(id, status);
        if (!updated) {
            res.status(404).json({ success: false, message: 'Không tìm thấy lead!' });
            return;
        }
        res.status(200).json({ success: true, message: 'Cập nhật trạng thái thành công', lead: updated.getSummary() });
    }
    catch (error) {
        const e = error;
        res.status(500).json({ success: false, message: e.message ?? 'Lỗi khi cập nhật trạng thái!' });
    }
};
exports.updateLeadStatus = updateLeadStatus;
// [DELETE] /sourcing/leads/:id
const deleteLead = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await sourcingLeadRepository.deleteById(id);
        if (!deleted) {
            res.status(404).json({ success: false, message: 'Không tìm thấy lead để xoá!' });
            return;
        }
        res.status(200).json({ success: true, message: 'Xoá lead thành công!' });
    }
    catch (error) {
        const e = error;
        res.status(500).json({ success: false, message: e.message ?? 'Lỗi khi xoá lead!' });
    }
};
exports.deleteLead = deleteLead;
//# sourceMappingURL=sourcing.controller.js.map