import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import jobService from "../../../services/client/jobService";
import "../../../styles/client/pages/uploadCV.css";

const UploadCV = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const userDropdownRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [jobId, setJobId] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [jobList, setJobList] = useState([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Load job list for dropdown from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await jobService.getAll();
        if (response.success && response.jobs) {
          const fetchedJobs = response.jobs.map((j) => ({
            id: j._id || j.id,
            title: j.title,
          }));
          setJobList(fetchedJobs);
        } else {
          setJobList([]);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách công việc:", error);
      }
    };
    fetchJobs();
  }, []);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
    };
    if (showUserDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserDropdown]);

  const userName = (() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.fullName || "Người dùng";
    } catch {
      return "Người dùng";
    }
  })();

  // Get first letter of name for avatar
  const avatarLetter = userName.charAt(0).toUpperCase();

  const handleLogout = () => {
    setShowUserDropdown(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Đăng xuất thành công!");
    navigate("/auth/login");
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const validateFile = (file) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Chỉ chấp nhận file PDF, DOC, DOCX!");
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File không được vượt quá 10MB!");
      return false;
    }
    return true;
  };

  const handleFileSelect = (file) => {
    if (file && validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      handleFileSelect(file);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Vui lòng chọn file CV!");
      return;
    }

    if (!jobId.trim()) {
      toast.error("Vui lòng nhập Job ID trước khi upload!");
      return;
    }

    setUploading(true);
    setAnalysisResult(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Bạn chưa đăng nhập.");
        setUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append("cv", selectedFile);
      formData.append("jobID", jobId.trim());

      const baseURL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5050";

      const uploadRes = await axios.post(`${baseURL}/upload/cv`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      const { cvLink, newCandidate } = uploadRes.data || {};
      const candidateID = newCandidate?.id || newCandidate?._id;

      const newFile = {
        id: candidateID || Date.now(),
        name: selectedFile.name,
        size: selectedFile.size,
        date: new Date().toLocaleDateString("vi-VN"),
        cvLink,
      };
      setUploadedFiles((prev) => [newFile, ...prev]);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success("Upload CV thành công!");

      if (candidateID) {
        setAnalyzing(true);
        try {
          const analyzeRes = await axios.post(
            `${baseURL}/ai/analyize`,
            { jobID: jobId.trim(), candidateID },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            },
          );

          if (analyzeRes.data?.success) {
            setAnalysisResult(analyzeRes.data.aiAnalyize);
            toast.success("Phân tích CV bằng AI thành công!");
          } else {
            toast.error(analyzeRes.data?.message || "Phân tích AI thất bại.");
          }
        } catch (error) {
          console.error(error);
          toast.error("Lỗi khi gọi API phân tích AI.");
        } finally {
          setAnalyzing(false);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Upload CV thất bại!");
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (name) => {
    if (name.endsWith(".pdf")) return "📄";
    if (name.endsWith(".doc") || name.endsWith(".docx")) return "📝";
    return "📎";
  };

  const handleVerify = () => {
    if (!window.chrome?.runtime) return alert("❌ Chưa cài/bật Nanobrowser!");

    window.chrome.runtime.sendMessage(
      "jjkplkmkajifbfgiafkfgogihdoellof",
      { action: "NANO_START_TASK", url: "https://github.com/pvduy23052005" },
      (res) => console.log("✅ Phản hồi từ Extension:", res),
    );
  };

  return (
    <div className="upload-cv-page">
      <button
        onClick={() => {
          handleVerify("https://github.com/pvduy23052005");
        }}
      >
        {" "}

      </button>

      {/* ── Header ── */}
      <header className="upload-cv-header">
        <div className="logo">
          <div className="logo-icon">N</div>
          <span className="logo-text">Hr-agent</span>
        </div>

        {/* User dropdown trigger */}
        <div
          className={`ucv-user-trigger${showUserDropdown ? " ucv-user-trigger--open" : ""}`}
          ref={userDropdownRef}
          onClick={() => setShowUserDropdown((prev) => !prev)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setShowUserDropdown((p) => !p)}
        >
          {/* Avatar circle */}
          {/* <div className="ucv-avatar">{avatarLetter}</div> */}

          {/* Name + role */}
          {/* <div className="ucv-user-info">
            <span className="ucv-user-name">{userName}</span>
            <span className="ucv-user-role">Ứng viên</span>
          </div> */}

          {/* Chevron */}
          <svg
            className={`ucv-chevron${showUserDropdown ? " ucv-chevron--open" : ""}`}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>

          {/* Dropdown menu */}
          {/* {showUserDropdown && (
            <div className="ucv-dropdown" onClick={(e) => e.stopPropagation()}>
              <div className="ucv-dropdown__header">
                <span className="ucv-dropdown__name">{userName}</span>
                <span className="ucv-dropdown__role">Ứng viên</span>
              </div>
              <div className="ucv-dropdown__divider" />
              <button className="ucv-dropdown__item ucv-dropdown__item--danger" onClick={handleLogout}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Đăng xuất
              </button>
            </div>
          )} */}
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="upload-cv-content">
        <h1 className="upload-cv-title">Upload CV của bạn</h1>
        <p className="upload-cv-subtitle">
          Tải lên hồ sơ để ứng tuyển các vị trí phù hợp
        </p>

        {/* ── Job Dropdown ── */}
        <div className="job-id-input-wrapper">
          <label className="job-id-label">
            Vị trí ứng tuyển
            <div className="job-select-wrap">
              <select
                className="job-id-select"
                value={jobId}
                onChange={(e) => setJobId(e.target.value)}
              >
                <option value="">-- Chọn công việc --</option>
                {jobList.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>
              {/* Custom chevron overlay */}
              <svg
                className="job-select-chevron"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </label>
        </div>

        {/* ── Drop Zone ── */}
        <div
          className={`upload-dropzone ${isDragging ? "dragging" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <span className="upload-icon">☁️</span>
          <p className="upload-text">Kéo thả file vào đây</p>
          <p className="upload-hint">
            hoặc <span>chọn file</span> từ máy tính
          </p>
          <div className="upload-formats">
            <span className="format-badge">PDF</span>
            <span className="format-badge">DOC</span>
            <span className="format-badge">DOCX</span>
            <span className="format-badge">≤ 10MB</span>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            accept=".pdf,.doc,.docx"
            onChange={handleInputChange}
          />
        </div>

        {/* ── File Preview ── */}
        {selectedFile && (
          <div className="file-preview">
            <div className="file-icon">{getFileIcon(selectedFile.name)}</div>
            <div className="file-info">
              <div className="file-name">{selectedFile.name}</div>
              <div className="file-size">
                {formatFileSize(selectedFile.size)}
              </div>
            </div>
            <button className="file-remove" onClick={handleRemoveFile}>
              ✕
            </button>
          </div>
        )}

        {/* ── Upload Button ── */}
        <button
          className={`btn-upload ${uploading ? "uploading" : ""}`}
          disabled={!selectedFile || uploading}
          onClick={handleUpload}
        >
          {uploading ? "Đang tải lên..." : "📤 Upload CV & Phân tích AI"}
        </button>

        {/* ── Uploaded Files List ── */}
        {uploadedFiles.length > 0 && (
          <div className="uploaded-list">
            <h3>📁 CV đã tải lên</h3>
            {uploadedFiles.map((file) => (
              <div key={file.id} className="uploaded-item">
                <span className="item-icon">{getFileIcon(file.name)}</span>
                <div className="item-info">
                  <div className="item-name">{file.name}</div>
                  <div className="item-date">{file.date}</div>
                </div>
                <span className="item-status">Đã tải lên</span>
              </div>
            ))}
          </div>
        )}

        {/* ── AI Analysis Result ── */}
        {analyzing && (
          <div className="ai-analysis-card">
            <h3>🧠 Đang phân tích CV bằng AI...</h3>
          </div>
        )}

        {analysisResult && (
          <div className="ai-analysis-card">
            <h3>🧠 Kết quả phân tích AI</h3>
            <p className="ai-summary">{analysisResult.summary}</p>
            <p className="ai-score">
              Điểm phù hợp: <strong>{analysisResult.matchingScore}</strong>/100
            </p>
            {analysisResult.redFlags?.length > 0 && (
              <div className="ai-section">
                <h4>Các điểm cần lưu ý:</h4>
                <ul>
                  {analysisResult.redFlags.map((flag, idx) => (
                    <li key={idx}>{flag}</li>
                  ))}
                </ul>
              </div>
            )}
            {analysisResult.suggestedQuestions?.length > 0 && (
              <div className="ai-section">
                <h4>Câu hỏi gợi ý cho phỏng vấn:</h4>
                <ul>
                  {analysisResult.suggestedQuestions.map((q, idx) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default UploadCV;
