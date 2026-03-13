import { useState, useEffect, useMemo } from "react";
import candidateService from "../../../services/client/candidateService";
import { toast } from "react-toastify";
import "../../../styles/client/pages/candidateManagement.css";

const ITEMS_PER_PAGE = 5;

const CandidateManagement = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchSkill, setSearchSkill] = useState("");
  const [searchExp, setSearchExp] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchCandidates();
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

  // Filter logic
  const filtered = useMemo(() => {
    return candidates.filter((c) => {
      const skillMatch =
        !searchSkill ||
        (c.topSkills || []).some((s) =>
          s.toLowerCase().includes(searchSkill.toLowerCase())
        );
      const statusMatch =
        filterStatus === "all" ||
        (filterStatus === "active" && c.status === true) ||
        (filterStatus === "inactive" && c.status === false);
      return skillMatch && statusMatch;
    });
  }, [candidates, searchSkill, searchExp, filterStatus]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginatedData = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchSkill, searchExp, filterStatus]);

  // Checkbox
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getStatusLabel = (status) => {
    if (status === true) return "Đã kiểm chứng";
    return "Rủi ro";
  };

  const getStatusClass = (status) => {
    if (status === true) return "status-verified";
    return "status-risk";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN");
  };

  const getInitial = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
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
          <span className="filter-icon">🔍</span>
          <input
            type="text"
            placeholder="Kĩ năng"
            value={searchSkill}
            onChange={(e) => setSearchSkill(e.target.value)}
          />
        </div>
        <div className="candidate-page__filter-input">
          <span className="filter-icon">🔍</span>
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
          <option value="active">Đã kiểm chứng</option>
          <option value="inactive">Rủi ro</option>
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
                    <td>
                      <div className="candidate-page__user-cell">
                        <div className="candidate-page__avatar">
                          {getInitial(c.fullName)}
                        </div>
                        <span>{c.fullName}</span>
                      </div>
                    </td>
                    <td>{(c.topSkills || []).slice(0, 2).join(", ") || "—"}</td>
                    <td>{c.topSkills?.length || 0}</td>
                    <td>{formatDate(c.appliedAt)}</td>
                    <td>
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

      {/* Footer: Pagination + Send Email */}
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
        <button className="candidate-page__btn-email">
          ✉ Gửi email
        </button>
      </div>
    </div>
  );
};

export default CandidateManagement;
