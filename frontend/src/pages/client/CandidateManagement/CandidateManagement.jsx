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
  const [searchSkill, setSearchSkill] = useState("");
  const [searchExp, setSearchExp] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);

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

  // Kiểm tra ứng viên có kỹ năng tìm kiếm không
  const matchesSkill = (candidate, searchTerm) => {
    if (!searchTerm) return true; // Nếu không nhập từ khóa thì match tất cả
    const skills = candidate.topSkills || [];
    return skills.some(skill => 
      skill.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Kiểm tra ứng viên có trạng thái lọc không
  const matchesStatus = (candidate, status) => {
    if (status === "all") return true; // Nếu chọn tất cả thì match tất cả
    return candidate.status === status;
  };

  // Filter logic
  const filtered = useMemo(() => {
    return candidates.filter((candidate) => {
      const hasSkill = matchesSkill(candidate, searchSkill);
      const hasStatus = matchesStatus(candidate, filterStatus);
      return hasSkill && hasStatus; // Cả 2 điều kiện phải đúng
    });
  }, [candidates, searchSkill, filterStatus]);

  // Phân trang: lấy dữ liệu của trang hiện tại
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;  // vị trí bắt đầu
  const endIndex = currentPage * ITEMS_PER_PAGE;          // vị trí kết thúc
  const paginatedData = filtered.slice(startIndex, endIndex);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchSkill, searchExp, filterStatus]);

  // Checkbox
  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      // Kiểm tra id có trong danh sách đã chọn không
      const isAlreadySelected = prev.includes(id);
      if (isAlreadySelected) {
        // Nếu đã chọn rồi -> xóa khỏi danh sách
        return prev.filter((selectedId) => selectedId !== id);
      } else {
        // Nếu chưa chọn -> thêm vào danh sách
        return [...prev, id];
      }
    });
  };

  const getStatusLabel = (status) => {
    const labels = {
      unverified: "Chưa kiểm chứng",
      verified: "Đã kiểm chứng",
      scheduled: "Phỏng vấn",
      risky: "Rủi ro",
    };

    return labels[status] || status || "—";
  };

  const getStatusClass = (status) => {
    const classes = {
      unverified: "status-unanalyzed",
      verified: "status-verified",
      scheduled: "status-scheduled",
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
    setCurrentPage(1);
  };

  return (
    <div className="candidate-page">
      <div className="candidate-page__header">
        <h1 className="candidate-page__title">Quản lý ứng viên</h1>
        <p className="candidate-page__subtitle">Quản lý ứng viên</p>
      </div>

      {/* Search Filters */}
      <div className="candidate-page__filters">
        <div className="candidate-page__filter-input">
          <MdSearch className="filter-icon" />
          <input
            type="text"
            placeholder="Kĩ năng"
            value={searchSkill}
            onChange={(e) => setSearchSkill(e.target.value)}
          />
        </div>
        <div className="candidate-page__filter-input">
          <MdSearch className="filter-icon" />
          <input
            type="text"
            placeholder="Năm kinh nghiệm"
            value={searchExp}
            onChange={(e) => setSearchExp(e.target.value)}
          />
        </div>
        <select
          className="candidate-page__filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="unverified">Chưa kiểm chứng</option>
          <option value="verified">Đã kiểm chứng</option>
          <option value="scheduled">Đã lên lịch</option>
          <option value="risky">Rủi ro</option>
        </select>
        <button className="candidate-page__btn-search" onClick={handleSearch}>
          Tìm kiếm
        </button>
      </div>

      {/* Table */}
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
                      <div className="candidate-page__user-cell">
                        <div className="candidate-page__avatar">
                          
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
                        className={`candidate-page__status ${getStatusClass(
                          c.status
                        )}`}
                      >
                        {getStatusLabel(c.status)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer: Pagination + Send Email + Schedule Interview */}
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
              // Truyền dữ liệu qua React Router state
              navigate("/candidates/emails", { 
                state: { selectedCandidateIds: selectedIds } 
              });
            }}
          >
           Gửi email
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateManagement;
