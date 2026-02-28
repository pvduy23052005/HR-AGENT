import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../../styles/client/pages/uploadCV.css";

const UploadCV = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const userName = (() => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            return user?.fullName || "Người dùng";
        } catch {
            return "Người dùng";
        }
    })();

    const handleLogout = () => {
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

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error("Vui lòng chọn file CV!");
            return;
        }

        setUploading(true);

        // Giả lập upload (chưa có backend API)
        setTimeout(() => {
            const newFile = {
                id: Date.now(),
                name: selectedFile.name,
                size: selectedFile.size,
                date: new Date().toLocaleDateString("vi-VN"),
            };
            setUploadedFiles((prev) => [newFile, ...prev]);
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            setUploading(false);
            toast.success("Upload CV thành công!");
        }, 1500);
    };

    const getFileIcon = (name) => {
        if (name.endsWith(".pdf")) return "📄";
        if (name.endsWith(".doc") || name.endsWith(".docx")) return "📝";
        return "📎";
    };

    return (
        <div className="upload-cv-page">
            {/* Header */}
            <header className="upload-cv-header">
                <div className="logo">
                    <div className="logo-icon">N</div>
                    <span className="logo-text">Hr-agent</span>
                </div>
                <div className="user-info">
                    <span className="user-name">Xin chào, {userName}</span>
                    <button className="btn-logout" onClick={handleLogout}>
                        Đăng xuất
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="upload-cv-content">
                <h1 className="upload-cv-title">Upload CV của bạn</h1>
                <p className="upload-cv-subtitle">
                    Tải lên hồ sơ để ứng tuyển các vị trí phù hợp
                </p>

                {/* Drop Zone */}
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

                {/* File Preview */}
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

                {/* Upload Button */}
                <button
                    className={`btn-upload ${uploading ? "uploading" : ""}`}
                    disabled={!selectedFile || uploading}
                    onClick={handleUpload}
                >
                    {uploading ? "Đang tải lên..." : "📤 Upload CV"}
                </button>

                {/* Uploaded Files List */}
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
            </main>
        </div>
    );
};

export default UploadCV;
