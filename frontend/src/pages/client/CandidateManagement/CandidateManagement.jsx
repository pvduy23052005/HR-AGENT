import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MdSearch } from "react-icons/md";
import candidateService from "../../../services/client/candidateService";
import jobService from "../../../services/client/jobService";
import { toast } from "react-toastify";
import "../../../styles/client/pages/candidateManagement.css";

const ITEMS_PER_PAGE = 5;

const CandidateManagement = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  // Input values (before clicking search)
  const [searchSkillInput, setSearchSkillInput] = useState("");
  const [searchExpInput, setSearchExpInput] = useState("");
  const [filterStatusInput, setFilterStatusInput] = useState("all");
  // Applied filters (after clicking search)
  const [searchSkill, setSearchSkill] = useState("");
  const [searchExp, setSearchExp] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [hoveredCandidateId, setHoveredCandidateId] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [hoveredCandidateData, setHoveredCandidateData] = useState(null);

  useEffect(() => {
    fetchCandidates();
    fetchJobs();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const res = await candidateService.getAll();
      setCandidates(res.candidates || []);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách ứng viên!");
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await jobService.getAll();
      setJobs(res.jobs || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách job:", error);
    }
  };

  
  const matchesSkill = (candidate, searchTerm) => {
    if (!searchTerm) return true;
    
    let skills = candidate.allSkills || [];
    
    // Xử lý nếu skills là string
    if (typeof skills === "string") {
      skills = skills.split(",").map(s => s.trim()).filter(s => s);
    }
    
    // Đảm bảo là mảng
    if (!Array.isArray(skills)) {
      skills = [];
    }
    
    const trimmedSearchTerm = searchTerm.trim().toLowerCase();
    
    return skills.some(skill => {
      if (!skill) return false;
      return skill.toLowerCase().trim().includes(trimmedSearchTerm);
    });
  };

  const matchesExperience = (candidate, searchTerm) => {
    if (!searchTerm) return true;
    const years = candidate.yearsOfExperience || candidate.experiences?.length || 0;
    return years.toString().includes(searchTerm.trim());
  };

  const matchesStatus = (candidate, status) => {
    if (status === "all") return true; 
    return candidate.status === status;
  };


  const filtered = useMemo(() => {
    return candidates.filter((candidate) => {
      const hasSkill = matchesSkill(candidate, searchSkill);
      const hasExp = matchesExperience(candidate, searchExp);
      const hasStatus = matchesStatus(candidate, filterStatus);
      return hasSkill && hasExp && hasStatus; 
    });
  }, [candidates, searchSkill, searchExp, filterStatus]);


  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE; 
  const endIndex = currentPage * ITEMS_PER_PAGE;         
  const paginatedData = filtered.slice(startIndex, endIndex);

 
  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
     
      const isAlreadySelected = prev.includes(id);
      if (isAlreadySelected) {
       
        return prev.filter((selectedId) => selectedId !== id);
      } else {
    
        return [...prev, id];
      }
    });
  };

  const getRecruitmentStatusLabel = (status) => {
    const labels = {
      applied: "Ứng tuyển",
      screening: "Sàng lọc",
      interview: "Phỏng vấn",
      offer: "Đề nghị",
    };
    return labels[status] || status || "—";
  };

  const getRecruitmentStatusClass = (status) => {
    const classes = {
      applied: "status-applied",
      screening: "status-screening",
      interview: "status-interview",
      offer: "status-offer",
    };
    return classes[status] || "";
  };

  const getVerificationStatusLabel = (status) => {
    const labels = {
      unverified: "Chưa kiểm chứng",
      verified: "Đã kiểm chứng ✅",
      risky: "Rủi ro ⚠️",
    };
    return labels[status] || status || "—";
  };

  const getVerificationStatusClass = (status) => {
    const classes = {
      unverified: "status-unanalyzed",
      verified: "status-verified",
      risky: "status-risk",
    };
    return classes[status] || "";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN");
  };



  const getJobTitle = (jobID) => {
    if (!jobID) return "—";
    const job = jobs.find((j) => j.id === jobID || j._id === jobID);
    return job ? job.title : "—";
  };

  const handleSearch = () => {
    setSearchSkill(searchSkillInput);
    setSearchExp(searchExpInput);
    setFilterStatus(filterStatusInput);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchSkillInput("");
    setSearchExpInput("");
    setFilterStatusInput("all");
    setSearchSkill("");
    setSearchExp("");
    setFilterStatus("all");
    setCurrentPage(1);
  };

  const handleAvatarHover = async (e, candidateId) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
    setHoveredCandidateId(candidateId);
    
    // Fetch full candidate data để lấy githubLink
    try {
      const res = await candidateService.getById(candidateId);
      setHoveredCandidateData(res.candidate);
    } catch (error) {
      console.error("Error fetching candidate detail:", error);
    }
  };

  const handleAvatarLeave = () => {
    setHoveredCandidateId(null);
    setHoveredCandidateData(null);
  };

  return (
    <div className="candidate-page">
      <div className="candidate-page__header">
        <h1 className="candidate-page__title">Quản lý ứng viên</h1>
        <p className="candidate-page__subtitle">Quản lý ứng viên</p>
      </div>

   
      <div className="candidate-page__filters">
        <div className="candidate-page__filter-input">
          <MdSearch className="filter-icon" />
          <input
            type="text"
            placeholder="Kĩ năng"
            value={searchSkillInput}
            onChange={(e) => setSearchSkillInput(e.target.value)}
          />
        </div>
        <div className="candidate-page__filter-input">
          <MdSearch className="filter-icon" />
          <input
            type="text"
            placeholder="Năm kinh nghiệm"
            value={searchExpInput}
            onChange={(e) => setSearchExpInput(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <select
            className="candidate-page__filter-select"
            value={filterStatusInput}
            onChange={(e) => setFilterStatusInput(e.target.value)}
          >
            <option value="all">Tất cả quy trình</option>
            <option value="applied">Ứng tuyển</option>
            <option value="screening">Sàng lọc</option>
            <option value="interview">Phỏng vấn</option>
            <option value="offer">Đề nghị</option>
          </select>
          <button 
            className="candidate-page__btn-clear"
            onClick={handleClearFilters}
            title="Xóa bộ lọc"
          >
            ✕
          </button>
        </div>
        <button className="candidate-page__btn-search" onClick={handleSearch}>
          Tìm kiếm
        </button>
      </div>

    
      <div className="candidate-page__table-wrapper">
        {loading ? (
          <div className="candidate-page__loading">Đang tải dữ liệu...</div>
        ) : (
          <table className="candidate-page__table">
            <thead>
              <tr>
                <th style={{ width: 40 }}></th>
                <th>Ứng viên</th>
                <th>Chức danh</th>
                <th>Năm kinh nghiệm</th>
                <th>Ngày Lưu</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="candidate-page__empty">
                    Không có ứng viên nào
                  </td>
                </tr>
              ) : (
                paginatedData.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(c.id)}
                        onChange={() => toggleSelect(c.id)}
                      />
                    </td>
                    
                    <td
                      onClick={() => navigate(`/candidates/${c.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <div 
                        className="candidate-page__user-cell"
                        onMouseEnter={(e) => handleAvatarHover(e, c.id)}
                        onMouseLeave={handleAvatarLeave}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="candidate-page__avatar">
                          {c.fullName.charAt(0)}
                        </div>
                        <span>{c.fullName}</span>
                      </div>
                    </td>
                    <td
                      onClick={() => navigate(`/candidates/${c.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      {getJobTitle(c.jobID)}
                    </td>
                    <td
                      onClick={() => navigate(`/candidates/${c.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      {c.yearsOfExperience || c.experiences?.length || 0}
                    </td>
                    <td
                      onClick={() => navigate(`/candidates/${c.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      {formatDate(c.appliedAt)}
                    </td>
                    <td
                      onClick={() => navigate(`/candidates/${c.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <span
                        className={`candidate-page__status ${getRecruitmentStatusClass(
                          c.status
                        )}`}
                      >
                        {getRecruitmentStatusLabel(c.status)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

    
      <div className="candidate-page__footer">
        <div className="candidate-page__pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`candidate-page__page-btn ${
                page === currentPage ? "active" : ""
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
        </div>
        <div className="candidate-page__actions">
          <button 
            className="candidate-page__btn-email"
            onClick={() => {
              if (selectedIds.length === 0) {
                toast.warning("Vui lòng chọn ít nhất một ứng viên!");
                return;
              }
          
              navigate("/candidates/emails", { 
                state: { selectedCandidateIds: selectedIds } 
              });
            }}
          >
           Gửi email
          </button>
        </div>
      </div>

      {/* Quick Preview Tooltip */}
      {hoveredCandidateId && hoveredCandidateData && (
        <div
          className="candidate-page__tooltip"
          style={{
            position: "fixed",
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y - 10}px`,
            transform: "translate(-50%, -100%)",
            zIndex: 1000,
          }}
        >
          <div className="candidate-page__tooltip-content">
            {/* Avatar */}
            <div className="candidate-page__tooltip-avatar">
              {hoveredCandidateData?.personal?.fullName.charAt(0)}
            </div>

            {/* Name */}
            <p className="candidate-page__tooltip-name">
              {hoveredCandidateData?.personal?.fullName}
            </p>

            {/* Job Title */}
            <p className="candidate-page__tooltip-title">
              {getJobTitle(hoveredCandidateData?.jobID)}
            </p>

            {/* GitHub Link */}
            <div className="candidate-page__tooltip-github">
              {hoveredCandidateData?.personal?.githubLink ? (
                <a
                  href={hoveredCandidateData?.personal?.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="candidate-page__tooltip-github-link"
                >
                  {hoveredCandidateData?.personal?.githubLink}
                </a>
              ) : (
                <span className="candidate-page__tooltip-no-github">
                  Không có
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateManagement;
