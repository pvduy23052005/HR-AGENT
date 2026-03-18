import { useState, useEffect, useMemo } from "react";
import { MdSearch, MdLink, MdDelete, MdCheck } from "react-icons/md";
import { SiLinkedin, SiGithub } from "react-icons/si";
import { toast } from "react-toastify";
import sourcingService from "../../../services/client/sourcingService";
import "../../../styles/client/pages/sourcing.css";

const ITEMS_PER_PAGE = 7;

const Sourcing = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Sourcing form state
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchSource, setSearchSource] = useState("linkedin");
  const [searchLimit, setSearchLimit] = useState(10);

  // Filters state
  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await sourcingService.getLeads();
      setLeads(res.leads || []);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách ứng viên tiềm năng!");
    } finally {
      setLoading(false);
    }
  };

  const handleSourcing = async () => {
    if (!searchKeyword.trim()) {
      toast.warning("Vui lòng nhập từ khóa tìm kiếm!");
      return;
    }

    try {
      setIsSearching(true);
      toast.info("Đang tiến hành quét ứng viên (Có thể mất vài phút)...");
      const res = await sourcingService.searchCandidates({
        keywords: searchKeyword,
        sources: searchSource,
        limit: searchLimit,
      });

      toast.success(`Đã tìm thấy ${res.data?.length || 0} ứng viên tiềm năng!`);
      // Reload the leads table
      fetchLeads();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Lỗi khi quét ứng viên!");
    } finally {
      setIsSearching(false);
    }
  };

  const handleDeleteLead = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa ứng viên này?")) return;

    try {
      await sourcingService.deleteLead(id);
      toast.success("Đã xóa ứng viên!");
      fetchLeads();
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    } catch (error) {
      console.error(error);
      toast.error("Không thể xóa ứng viên!");
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await sourcingService.updateLeadStatus(id, newStatus);
      toast.success("Đã cập nhật trạng thái!");
      fetchLeads();
    } catch (error) {
      console.error(error);
      toast.error("Không thể cập nhật trạng thái!");
    }
  };

  // Filter logic
  const filtered = useMemo(() => {
    return leads.filter((lead) => {
      const keywordMatch =
        !filterKeyword ||
        (lead.name && lead.name.toLowerCase().includes(filterKeyword.toLowerCase())) ||
        (lead.title && lead.title.toLowerCase().includes(filterKeyword.toLowerCase()));

      const statusMatch =
        filterStatus === "all" ||
        lead.status === filterStatus;

      return keywordMatch && statusMatch;
    });
  }, [leads, filterKeyword, filterStatus]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginatedData = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filterKeyword, filterStatus]);

  // Checkbox
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getStatusLabel = (status) => {
    const labels = {
      new: "Mới",
      contacted: "Đã liên hệ",
      rejected: "Từ chối",
      converted: "Đã chuyển đổi",
    };
    return labels[status] || status || "Mới";
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

  return (
    <div className="sourcing-page">
      <div className="sourcing-page__header">
        <h1 className="sourcing-page__title">Sourcing Ứng viên</h1>
        <p className="sourcing-page__subtitle">Tự động tìm kiếm và thu thập ứng viên từ LinkedIn, GitHub</p>
      </div>

      {/* Sourcing Action Form */}
      <div className="sourcing-page__filters" style={{ backgroundColor: "#f8faff", padding: "16px", borderRadius: "12px", border: "1px dashed #bcdcfe" }}>
        <div className="sourcing-page__filter-input" style={{ flexGrow: 1 }}>
          <MdSearch className="filter-icon" />
          <input
            type="text"
            placeholder="Từ khóa (VD: Frontend Developer React, Data Scientist Python...)"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            disabled={isSearching}
          />
        </div>

        <select
          className="sourcing-page__filter-select"
          value={searchSource}
          onChange={(e) => setSearchSource(e.target.value)}
          disabled={isSearching}
        >
          <option value="linkedin">LinkedIn</option>
          <option value="github">GitHub</option>
        </select>

        <input 
          type="number"
          placeholder="Số lượng"
          value={searchLimit}
          onChange={(e) => setSearchLimit(e.target.value)}
          disabled={isSearching}
        />

        <button
          className="sourcing-page__btn-search"
          onClick={handleSourcing}
          disabled={isSearching}
        >
          {isSearching ? "Đang quét..." : "Tiến hành quét"}
        </button>
      </div>

      <hr style={{ borderTop: "1px solid #eee", margin: "24px 0" }} />

      {/* Table Filters */}
      <div className="sourcing-page__filters">
        <div className="sourcing-page__filter-input">
          <MdSearch className="filter-icon" />
          <input
            type="text"
            placeholder="Lọc trong danh sách (Tên, chức danh)..."
            value={filterKeyword}
            onChange={(e) => setFilterKeyword(e.target.value)}
          />
        </div>

        <select
          className="sourcing-page__filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="new">Mới</option>
          <option value="contacted">Đã liên hệ</option>
          <option value="converted">Đã chuyển đổi</option>
          <option value="rejected">Từ chối</option>
        </select>
      </div>

      {/* Table */}
      <div className="sourcing-page__table-wrapper">
        {loading ? (
          <div className="sourcing-page__loading">Đang tải dữ liệu...</div>
        ) : (
          <table className="sourcing-page__table">
            <thead>
              <tr>
                <th style={{ width: 40 }}></th>
                <th>Ứng viên</th>
                <th>Chức danh</th>
                <th>Nguồn</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="sourcing-page__empty">
                    Chưa có ứng viên tiềm năng nào. Hãy dùng công cụ quét bên trên!
                  </td>
                </tr>
              ) : (
                paginatedData.map((lead) => (
                  <tr key={lead._id || lead.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(lead._id || lead.id)}
                        onChange={() => toggleSelect(lead._id || lead.id)}
                      />
                    </td>
                    <td>
                      <div className="sourcing-page__user-cell">
                        <div className="sourcing-page__avatar">
                          {getInitial(lead.name)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 500 }}>{lead.name || "Không xác định"}</div>
                          {lead.profileUrl && (
                            <a href={lead.profileUrl} target="_blank" rel="noopener noreferrer" className="sourcing-page__link" style={{ fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                              <MdLink /> Xem hồ sơ
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{lead.title || "—"}</td>
                    <td>
                      <span className={`sourcing-page__source-badge ${lead.source}`}>
                        {lead.source === 'linkedin' && <SiLinkedin />}
                        {lead.source === 'github' && <SiGithub />}
                        {lead.source === 'linkedin' ? 'LinkedIn' : lead.source === 'github' ? 'GitHub' : lead.source}
                      </span>
                    </td>
                    <td>
                      <select
                        value={lead.status || "new"}
                        onChange={(e) => handleUpdateStatus(lead._id || lead.id, e.target.value)}
                        className={`sourcing-page__status ${lead.status || "new"}`}
                        style={{ border: "none", outline: "none", cursor: "pointer" }}
                      >
                        <option value="new">Mới</option>
                        <option value="contacted">Đã liên hệ</option>
                        <option value="converted">Đã chuyển đổi</option>
                        <option value="rejected">Từ chối</option>
                      </select>
                    </td>
                    <td>{formatDate(lead.createdAt || lead.date)}</td>
                    <td>
                      <button
                        className="sourcing-page__btn-delete"
                        onClick={() => handleDeleteLead(lead._id || lead.id)}
                        title="Xóa ứng viên"
                      >
                        <MdDelete size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer: Pagination */}
      <div className="sourcing-page__footer">
        <div className="sourcing-page__pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`sourcing-page__page-btn ${page === currentPage ? "active" : ""
                }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sourcing;
