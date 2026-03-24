import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import jobService from "../../../services/client/jobService";

const UploadCVPanel = () => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [jobList, setJobList] = useState([]);
  const [jobId, setJobId] = useState("");

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
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách công việc:", error);
      }
    };
    fetchJobs();
  }, []);

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
        "Chỉ chấp nhận ảnh hoặc tài liệu (JPG, PNG, GIF, WEBP, PDF, DOC, DOCX)!"
      );
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

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  }, []);

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

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Vui lòng chọn file CV!");
      return;
    }

    if (!jobId.trim()) {
      toast.error("Vui lòng chọn công việc!");
      return;
    }

    setUploading(true);

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

      await axios.post(`${baseURL}/upload/cv`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success("Upload CV thành công!");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Upload thất bại!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-cv-panel">
      <div className="upload-cv-panel__header">
        <h2 className="upload-cv-panel__title">Upload CV</h2>
        <p className="upload-cv-panel__subtitle">
          Chia sẻ hồ sơ ứng tuyển
        </p>
      </div>

      <div className="upload-cv-panel__content">
        {/* Job Selection */}
        <div className="upload-cv-panel__section">
          <label className="upload-cv-panel__label">Chọn vị trí ứng tuyển</label>
          <select
            className="upload-cv-panel__select"
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
        </div>

        {/* Drop Zone */}
        <div
          className={`upload-cv-panel__dropzone ${
            isDragging ? "dragging" : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="upload-cv-panel__dropzone-content">
            <div className="upload-cv-panel__icon">📄</div>
            <p className="upload-cv-panel__text">
              Kéo thả hoặc bấm để chọn file
            </p>
            <p className="upload-cv-panel__hint">Max 10MB</p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp"
            onChange={handleInputChange}
            style={{ display: "none" }}
          />
        </div>

        {/* File Preview */}
        {selectedFile && (
          <div className="upload-cv-panel__preview">
            <div className="upload-cv-panel__preview-info">
              <div className="upload-cv-panel__preview-name">
                {selectedFile.name}
              </div>
              <div className="upload-cv-panel__preview-size">
                {formatFileSize(selectedFile.size)}
              </div>
            </div>
            <button
              className="upload-cv-panel__preview-remove"
              onClick={handleRemoveFile}
            >
              ✕
            </button>
          </div>
        )}

        {/* Upload Button */}
        <button
          className="upload-cv-panel__btn-upload"
          disabled={!selectedFile || uploading || !jobId.trim()}
          onClick={handleUpload}
        >
          {uploading ? "Đang tải lên..." : "Upload CV"}
        </button>
      </div>
    </div>
  );
};

export default UploadCVPanel;
