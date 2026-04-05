import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import jobService from "../../../services/client/jobService";
import "../../../styles/client/pages/uploadCV.css";

const UploadCV = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const userDropdownRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
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


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target)
      ) {
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
      
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Chỉ chấp nhận ảnh hoặc tài liệu (JPG, PNG, GIF, WEBP, PDF, DOC, DOCX)!",
      );
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File không được vượt quá 10MB!");
      return false;
    }
    return true;
  };

  const validateImage = (file) => {
    const allowedImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedImageTypes.includes(file.type)) {
      toast.error("Chỉ chấp nhận ảnh JPG, PNG, GIF, WEBP!");
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ảnh không được vượt quá 5MB!");
      return false;
    }
    return true;
  };

  const handleFileSelect = (file) => {
    if (file && validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleImageSelect = (file) => {
    if (file && validateImage(file)) {
      setSelectedImage(file);
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

  const handleImageDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDraggingImage(true);
  }, []);

  const handleImageDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDraggingImage(false);
  }, []);

  const handleImageDrop = useCallback((e) => {
    e.preventDefault();
    setIsDraggingImage(false);
    const file = e.dataTransfer.files[0];
    handleImageSelect(file);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      handleFileSelect(file);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleImageInputChange = (e) => {
    const file = e.target.files[0];
    handleImageSelect(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
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
      if (selectedImage) {
        formData.append("avatar", selectedImage);
      }
      formData.append("jobID", jobId.trim());

      const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5050";

      // call api upload .
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
      setSelectedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (imageInputRef.current) imageInputRef.current.value = "";
      toast.success(
        "Upload CV" + (selectedImage ? " và ảnh" : "") + " thành công!",
      );
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Upload thất bại!");
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (name) => {
    if (name.endsWith(".pdf")) return "";
    if (name.endsWith(".doc") || name.endsWith(".docx")) return "";
    if (
      name.endsWith(".jpg") ||
      name.endsWith(".jpeg") ||
      name.endsWith(".png") ||
      name.endsWith(".gif") ||
      name.endsWith(".webp")
    )
      return "";
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
      {/* ── Header ── */}
      <header className="upload-cv-header">
        <div className="header-spacer"></div>
      </header>

      {/* ── Main Content ── */}
      <main className="upload-cv-content">
        {/* ── Hero Section ── */}
        <div className="hero-section">

          <h1 className="upload-cv-title">Upload CV của bạn</h1>
          <p className="upload-cv-subtitle">
            Chia sẻ hồ sơ để ứng tuyển và nhận được phân tích từ AI
          </p>
        </div>

        {/* ── Main Card ── */}
        <div className="upload-card">
          {/* ── Job Selection ── */}
          <div className="job-section">
            <label className="job-label">

              <span className="label-text">Chọn vị trí ứng tuyển</span>
            </label>
            <div className="job-select-wrap">
              <select
                className="job-select"
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
              <svg
                className="select-chevron"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="card-divider"></div>

          {/* ── Drop Zone ── */}
          <div
            className={`upload-dropzone ${isDragging ? "dragging" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="dropzone-content">
              <div className="upload-icon">�</div>
              <p className="upload-text">Kéo thả CV hoặc ảnh CV vào đây</p>
              <p className="upload-hint">
                hay{" "}
                <button
                  className="browse-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  duyệt thư viện
                </button>
              </p>
              <div className="upload-formats">
                <span className="format-badge">PDF</span>
                <span className="format-badge">DOC</span>
                <span className="format-badge">DOCX</span>
                <span className="format-badge">JPG</span>
                <span className="format-badge">PNG</span>
                <span className="format-badge">GIF</span>
                <span className="format-badge">WEBP</span>
                <span className="format-badge-size">Max 10MB</span>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp,image/*"
              onChange={handleInputChange}
            />
          </div>

          {/* ── Avatar Upload Section ── */}
          {/* <div className="avatar-section">
            <label className="avatar-label">
              <span className="label-icon"></span>
              <span className="label-text">Tải ảnh đại diện (tùy chọn)</span>
            </label>
            <div
              className={`upload-avatar-zone ${isDraggingImage ? "dragging" : ""}`}
              onDragOver={handleImageDragOver}
              onDragLeave={handleImageDragLeave}
              onDrop={handleImageDrop}
              onClick={() => imageInputRef.current?.click()}
            >
              <div className="avatar-content">
                {selectedImage ? (
                  <>
                    <div className="avatar-preview-icon">🖼️</div>
                    <p className="avatar-preview-name">{selectedImage.name}</p>
                  </>
                ) : (
                  <>
                    <div className="avatar-icon">📸</div>
                    <p className="avatar-text">Kéo thả ảnh vào đây</p>
                    <p className="avatar-hint">hoặc <button className="browse-btn" onClick={(e) => {
                      e.stopPropagation();
                      imageInputRef.current?.click();
                    }}>chọn ảnh</button></p>
                  </>
                )}
              </div>
              <input
                type="file"
                ref={imageInputRef}
                accept=".jpg,.jpeg,.png,.gif,.webp"
                onChange={handleImageInputChange}
              />
            </div>
            {selectedImage && (
              <button className="avatar-remove" onClick={handleRemoveImage} title="Xóa ảnh">
                ✕ Xóa ảnh
              </button>
            )}
          </div> */}

          {/* ── File Preview ── */}
          {selectedFile && (
            <div className="file-preview">
              <div className="preview-content">
                <div className="preview-icon">
                  {getFileIcon(selectedFile.name)}
                </div>
                <div className="preview-info">
                  <div className="preview-name" title={selectedFile.name}>
                    {selectedFile.name}
                  </div>
                  <div className="preview-size">
                    {formatFileSize(selectedFile.size)}
                  </div>
                </div>
              </div>
              <button
                className="preview-remove"
                onClick={handleRemoveFile}
                title="Xóa file"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          )}

          {/* ── Upload Button ── */}
          <button
            className={`btn-upload ${uploading ? "loading" : ""}`}
            disabled={!selectedFile || uploading || !jobId.trim()}
            onClick={handleUpload}
          >

            <span className="btn-text">
              {uploading ? "Đang tải lên..." : "Upload CV"}
            </span>
          </button>

          {/* ── Form Help Text ── */}
          <p className="form-helptext">
            CV sẽ được lưu vào cột "Ứng tuyển" để bạn quản lý
          </p>
        </div>

        {/* ── Uploaded Files Section ── */}
        {uploadedFiles.length > 0 && (
          <div className="uploaded-section">
            <h2 className="section-title">CV Của Bạn</h2>
            <div className="uploaded-grid">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="uploaded-card">
                  <div className="uploaded-header">
                    <span className="uploaded-icon">
                      {getFileIcon(file.name)}
                    </span>
                    <span className="uploaded-badge">✓ Đã tải</span>
                  </div>
                  <div className="uploaded-body">
                    <div className="uploaded-name" title={file.name}>
                      {file.name}
                    </div>
                    <div className="uploaded-date">{file.date}</div>
                  </div>
                  <div className="uploaded-footer">
                    {file.cvLink && (
                      <a
                        href={file.cvLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="view-link"
                      >
                        Xem file →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── AI Analysis Result ── */}
        {analyzing && (
          <div className="analysis-section">
            <div className="analyzing-card">
              <div className="analyzing-spinner"></div>
              <h3>Đang phân tích CV bằng AI...</h3>
              <p>Vui lòng chờ, AI sẽ phân tích hồ sơ của bạn trong giây lát</p>
            </div>
          </div>
        )}

        {analysisResult && (
          <div className="analysis-section">
            <div className="analysis-card">
              <div className="analysis-header">
                <span className="analysis-icon"></span>
                <h3>Kết quả Phân tích AI</h3>
              </div>

              <div className="analysis-score">
                <span className="score-label">Mức độ phù hợp</span>
                <div className="score-bar">
                  <div
                    className="score-fill"
                    style={{ width: `${analysisResult.matchingScore}%` }}
                  ></div>
                </div>
                <span className="score-value">
                  {analysisResult.matchingScore}%
                </span>
              </div>

              <p className="analysis-summary">{analysisResult.summary}</p>

              {analysisResult.redFlags?.length > 0 && (
                <div className="analysis-item alerts">
                  <h4>Điểm cần lưu ý</h4>
                  <ul>
                    {analysisResult.redFlags.map((flag, idx) => (
                      <li key={idx}>{flag}</li>
                    ))}
                  </ul>
                </div>
              )}

              {analysisResult.suggestedQuestions?.length > 0 && (
                <div className="analysis-item questions">
                  <h4>Gợi ý câu hỏi phỏng vấn</h4>
                  <ul>
                    {analysisResult.suggestedQuestions.map((q, idx) => (
                      <li key={idx}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UploadCV;
