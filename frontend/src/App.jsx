import { useEffect, useState } from "react";

function App() {
  const [candidates, setCandidates] = useState([]);

  // Hàm gọi API lấy dữ liệu
  const fetchData = () => {
    fetch("http://localhost:3000/api/cv")
      .then((res) => res.json())
      .then((data) => setCandidates(data))
      .catch((err) => console.error("Lỗi backend:", err));
  };

  useEffect(() => {
    fetchData(); // Gọi ngay khi mở
    const interval = setInterval(fetchData, 2000); // 2 giây gọi lại 1 lần (Realtime fake)
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">
        🚀 Bảng Tin Tuyển Dụng (HR Dashboard)
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {candidates.map((cv) => (
          <div
            key={cv.id}
            className="bg-white p-6 rounded-xl shadow-md border hover:shadow-lg transition"
          >
            <h2 className="text-xl font-bold text-gray-800">{cv.fullName}</h2>
            <p className="text-gray-500 text-sm mb-2">{cv.email}</p>

            <div className="flex flex-wrap gap-2 mb-3">
              {cv.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex justify-between items-center text-sm border-t pt-3 mt-2">
              <span className="font-semibold text-green-600">
                {cv.yearsOfExperience} năm KN
              </span>
              <a href={cv.sourceUrl} className="text-blue-500 hover:underline">
                Xem Link
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
