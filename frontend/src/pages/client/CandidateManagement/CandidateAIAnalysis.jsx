import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import aiService from "../../../services/client/aiService";
import candidateService from "../../../services/client/candidateService";
import "../../../styles/client/pages/candidateDetail.css";
import "../../../styles/client/pages/candidateAIAnalysis.css";

const CandidateAIAnalysis = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    fetchAndAnalyze();
  }, [id]);

  const fetchAndAnalyze = async () => {
    try {
      setLoading(true);
      const res = await candidateService.getById(id);
      const cand = res.candidate;
      setCandidate(cand);
      
      if (!cand) {
        toast.error("Không tìm thấy ứng viên!");
        return;
      }

      if (!cand.jobID) {
        toast.error("Ứng viên này chưa gắn với vị trí công việc nào!");
        return;
      }

      await runAnalysis(cand.jobID, id);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi tải thông tin ứng viên!");
    } finally {
      setLoading(false);
    }
  };

  const runAnalysis = async (jobID, candidateID) => {
      setAnalyzing(true);
      const res = await aiService.analyzeCandidate({ jobID, candidateID });
      if (res.success) {
        setAiResult(res.aiAnalyze);
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
       setAnalyzing(false);
  };

  const handleReanalyze = async () => {
    if (!candidate?.jobID) return;
    setAiResult(null);
    await runAnalysis(candidate.jobID, id);
  };

  const handlePrint = () => {
    window.print();
  };

  const isLoading = loading || analyzing;

  return (
    <div className="caa-page">
      <button className="caa-back" onClick={() => navigate(`/candidates/${id}`)}>
        ← Quay lại
      </button>

      {isLoading && (
        <div className="caa-loading">
          <div className="caa-loading-spinner" />
          <span>Đang phân tích hồ sơ ứng viên...</span>
        </div>
      )}

     
      {!isLoading && aiResult && candidate && (
        <div className="caa-container">
          <div className="caa-header">
            <h1>Phân tích AI cho ứng viên</h1>
            <p>Thông tin chi tiết của ứng viên</p>
          </div>

          <div className="caa-form-card">
          
            <div className="caa-form-group">
              <label className="caa-form-label">Họ tên</label>
              <div className="caa-form-value">
                {candidate?.personal?.fullName || "—"}
              </div>
            </div>

         
            <div className="caa-form-group">
              <label className="caa-form-label">Điểm phủ hợp</label>
              <div className="caa-score-display">
                <div className="caa-score-badge">{aiResult.matchingScore}%</div>
                <span className="caa-score-status">
                  {aiResult.matchingScore >= 80
                    ? "Rất phù hợp"
                    : aiResult.matchingScore >= 60
                    ? "Phù hợp trung bình"
                    : "Chưa đủ yêu cầu"}
                </span>
              </div>
            </div>

          
            <div className="caa-form-group">
              <label className="caa-form-label">Tóm tắt năng lực</label>
              <div className="caa-form-value caa-form-value--textarea">
                {aiResult.summary || "—"}
              </div>
            </div>

            {aiResult.redFlags && aiResult.redFlags.length > 0 && (
              <div className="caa-form-group">
                <label className="caa-form-label caa-form-label--danger">Kỹ năng còn thiếu</label>
                <div className="caa-form-value caa-form-value--list">
                  <ul className="caa-list">
                    {aiResult.redFlags.map((flag, i) => (
                      <li key={i}>{flag}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

         
            {aiResult.suggestedQuestions && aiResult.suggestedQuestions.length > 0 && (
              <div className="caa-form-group">
                <label className="caa-form-label">Câu hỏi phỏng vấn gợi ý</label>
                <div className="caa-form-value caa-form-value--list">
                  <ol className="caa-list">
                    {aiResult.suggestedQuestions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

          
            <div className="caa-actions">
              <button className="caa-btn caa-btn--secondary" onClick={() => navigate(`/candidates/${id}`)}>
                Hủy
              </button>
              <button className="caa-btn caa-btn--secondary" onClick={handlePrint}>
                In
              </button>
              <button className="caa-btn caa-btn--secondary" onClick={handleReanalyze} disabled={analyzing}>
                {analyzing ? "Đang phân tích..." : "Phân tích lại"}
              </button>
            </div>
          </div>
        </div>
      )}

   
      {!isLoading && !aiResult && candidate && !candidate.jobID && (
        <div className="caa-empty">
          <div className="caa-empty-text">
            <h3>Chưa gắn vị trí công việc</h3>
            <p>Ứng viên này chưa được liên kết với job nào. Vui lòng upload CV qua đúng vị trí tuyển dụng.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateAIAnalysis;
