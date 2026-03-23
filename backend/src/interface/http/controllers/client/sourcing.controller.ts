import { Request, Response } from 'express';
import { SourceCandidatesUseCase } from '../../../../application/use-cases/client/sourcing/source-candidates.use-case';
import { GetSourcingLeadsUseCase } from '../../../../application/use-cases/client/sourcing/get-sourcing-leads.use-case';
import { SourcingLeadRepository } from '../../../../infrastructure/database/repositories/client/sourcing-lead.repository';
import type { SourcingSource, SourcingStatus } from '../../../../domain/entities/client/sourcing-lead';

const sourcingLeadRepository = new SourcingLeadRepository();

// [POST] /sourcing/search
export const searchCandidates = async (req: Request, res: Response): Promise<void> => {
  try {
    const { keywords, sources, limit, jobID } = req.body;
    console.log(req.body);

    if (!keywords || typeof keywords !== 'string' || !keywords.trim()) {
      res.status(400).json({ success: false, message: 'Thiếu từ khoá tìm kiếm!' });
      return;
    }

    const validSources: SourcingSource[] = ['github', 'linkedin'];
    const requestedSources: SourcingSource[] = Array.isArray(sources)
      ? sources.filter((s: any) => validSources.includes(s))
      : ['github'];

    if (requestedSources.length === 0) {
      res.status(400).json({ success: false, message: 'Nguồn tìm kiếm không hợp lệ. Chọn "github" hoặc "linkedin".' });
      return;
    }

    const useCase = new SourceCandidatesUseCase(sourcingLeadRepository);
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
  } catch (error: unknown) {
    const e = error as { message?: string };
    console.error('[Sourcing] searchCandidates error:', e.message);
    res.status(500).json({ success: false, message: e.message ?? 'Lỗi khi tìm kiếm ứng viên!' });
  }
};

// [GET] /sourcing/leads
export const getLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    const { jobID, source } = req.query;

    const validSources: SourcingSource[] = ['github', 'linkedin'];
    const sourceFilter = validSources.includes(source as SourcingSource)
      ? (source as SourcingSource)
      : undefined;

    const useCase = new GetSourcingLeadsUseCase(sourcingLeadRepository);
    const leads = await useCase.execute({
      jobID: jobID as string | undefined,
      source: sourceFilter,
    });

    res.status(200).json({
      success: true,
      message: 'Thành công',
      total: leads.length,
      leads: leads.map((l) => l.getSummary()),
    });
  } catch (error: unknown) {
    const e = error as { message?: string };
    res.status(500).json({ success: false, message: e.message ?? 'Lỗi khi lấy danh sách leads!' });
  }
};

// [PATCH] /sourcing/leads/:id/status
export const updateLeadStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses: SourcingStatus[] = ['new', 'contacted', 'rejected'];
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
  } catch (error: unknown) {
    const e = error as { message?: string };
    res.status(500).json({ success: false, message: e.message ?? 'Lỗi khi cập nhật trạng thái!' });
  }
};

// [DELETE] /sourcing/leads/:id
export const deleteLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await sourcingLeadRepository.deleteById(id);

    if (!deleted) {
      res.status(404).json({ success: false, message: 'Không tìm thấy lead để xoá!' });
      return;
    }

    res.status(200).json({ success: true, message: 'Xoá lead thành công!' });
  } catch (error: unknown) {
    const e = error as { message?: string };
    res.status(500).json({ success: false, message: e.message ?? 'Lỗi khi xoá lead!' });
  }
};
