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
      const cand = res.candidate || null;
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
        setAiResult(res.aiAnalyize);
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

  const isLoading = loading || analyzing;

  return (
    <div className="cd-page">
      <button className="cd-back" onClick={() => navigate(`/candidates/${id}`)}>
        ← Quay lại chi tiết ứng viên
      </button>

      <div className="cd-header">
        <h1>Phân tích AI cho ứng viên</h1>
        <p>Kết quả phân tích độ phù hợp giữa ứng viên và vị trí ứng tuyển</p>
      </div>

      {/* === LOADING === */}
      {isLoading && (
        <div className="ai-loading-panel">
          <div className="ai-loading-icon">🤖</div>
          <div className="ai-loading-text">
            <span className="ai-loading-title">Đang phân tích hồ sơ ứng viên...</span>
            <span className="ai-loading-sub">Gemini AI đang đánh giá độ phù hợp, vui lòng đợi</span>
          </div>
          <div className="ai-dots">
            <span /><span /><span />
          </div>
        </div>
      )}

      {/* === KẾT QUẢ === */}
      {!isLoading && aiResult && (
        <div className="ai-result-wrap">

          {/* Score card */}
          <div className="ai-score-card">
            <div className="ai-score-label">Điểm phù hợp</div>
            <div className="ai-score-ring">
              <svg viewBox="0 0 120 120" className="ai-ring-svg">
                <circle cx="60" cy="60" r="50" className="ai-ring-bg" />
                <circle
                  cx="60" cy="60" r="50"
                  className="ai-ring-fill"
                  strokeDasharray={`${(aiResult.matchingScore / 100) * 314} 314`}
                />
              </svg>
              <div className="ai-score-num">{aiResult.matchingScore}%</div>
            </div>
            <div className="ai-score-hint">
              {aiResult.matchingScore >= 80
                ? "✅ Rất phù hợp"
                : aiResult.matchingScore >= 60
                ? "🔶 Phù hợp trung bình"
                : "❌ Chưa đủ yêu cầu"}
            </div>
          </div>

          {/* Tóm tắt */}
          <div className="cd-card ai-section">
            <div className="ai-section-title">📝 Tóm tắt năng lực</div>
            <p className="ai-summary-text">{aiResult.summary || "—"}</p>
          </div>

          {/* Red flags */}
          {aiResult.redFlags && aiResult.redFlags.length > 0 && (
            <div className="cd-card ai-section">
              <div className="ai-section-title ai-section-title--red">⚠️ Kỹ năng còn thiếu / Cảnh báo</div>
              <ul className="ai-list ai-list--red">
                {aiResult.redFlags.map((flag, i) => (
                  <li key={i} className="ai-list-item">
                    <span className="ai-list-dot ai-list-dot--red">●</span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Câu hỏi phỏng vấn */}
          {aiResult.suggestedQuestions && aiResult.suggestedQuestions.length > 0 && (
            <div className="cd-card ai-section">
              <div className="ai-section-title">💬 Câu hỏi phỏng vấn gợi ý</div>
              <ol className="ai-list ai-list--questions">
                {aiResult.suggestedQuestions.map((q, i) => (
                  <li key={i} className="ai-list-item ai-list-item--question">
                    <span className="ai-q-num">{i + 1}.</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Actions */}
          <div className="cd-actions">
            <button className="cd-btn cd-btn--cancel" onClick={() => navigate(`/candidates/${id}`)}>
              ← Quay lại
            </button>
            <button className="cd-btn cd-btn--schedule">Lên lịch phỏng vấn</button>
            <button className="cd-btn cd-btn--verify">Cập nhật trạng thái</button>
            <button className="cd-btn cd-btn--ai" onClick={handleReanalyze} disabled={analyzing}>
              🔄 Phân tích lại
            </button>
          </div>
        </div>
      )}

      {/* Không có jobID */}
      {!isLoading && !aiResult && candidate && !candidate.jobID && (
        <div className="cd-card" style={{ textAlign: "center", padding: 40, color: "#888" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Chưa gắn vị trí công việc</div>
          <div style={{ fontSize: 14 }}>Ứng viên này chưa được liên kết với job nào. Vui lòng upload CV qua đúng vị trí tuyển dụng.</div>
        </div>
      )}
    </div>
  );
};

export default CandidateAIAnalysis;
