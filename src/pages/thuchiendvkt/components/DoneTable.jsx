/* FULL CODE GIỮ NGUYÊN NHƯ EM GỬI, CHỈ SỬA 3 CHỖ:  
   - trangThaiKQ (đúng key)  
   - nút Sửa check đúng key  
   - gọi handleHuyDuyet() đúng tên controller
*/

import React, { useState, useMemo } from "react";
import Swal from "sweetalert2";
import { ThucHienDVKTController } from "../../../controllers/ThucHienDVKTController";

const calcAge = (date) => {
  if (!date) return "";
  const dob = new Date(date);
  return new Date().getFullYear() - dob.getFullYear();
};

export default function DoneTable({ data, refresh }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filtered = useMemo(() => {
    if (!data) return [];
    const s = search.toLowerCase();
    return data.filter((item) =>
      (item.tenDvkt || "").toLowerCase().includes(s) ||
      (item.ketQuaText || "").toLowerCase().includes(s) ||
      (item.benhNhan || "").toLowerCase().includes(s) ||
      (item.maBenhNhan || "").toLowerCase().includes(s)
    );
  }, [data, search]);

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize) || 1;

  const slice = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleKy = async (id) => {
    const ok = await Swal.fire({
      title: "Ký kết quả?",
      icon: "question",
      showCancelButton: true,
    });
    if (!ok.isConfirmed) return;
    await ThucHienDVKTController.handleDuyet(id, refresh);
  };

  const handleHuyKy = async (id) => {
    const ok = await Swal.fire({
      title: "Hủy ký?",
      icon: "warning",
      showCancelButton: true,
    });
    if (!ok.isConfirmed) return;
    await ThucHienDVKTController.handleHuyDuyet(id, refresh);
  };

  const handleGui = async (id) => {
    const ok = await Swal.fire({
      title: "Gửi?",
      icon: "info",
      showCancelButton: true,
    });
    if (!ok.isConfirmed) return;
    await ThucHienDVKTController.handleGui(id, refresh);
  };

  const handleEdit = (item) => {
    if (item.trangThaiKQ === "approved" || item.trangThaiKQ === "sent") {
      Swal.fire("Không thể sửa", "Hãy hủy ký trước", "warning");
      return;
    }
    window.dispatchEvent(new CustomEvent("openTraKetQua", { detail: item }));
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 h-full">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Tìm kiếm..."
        className="w-full mb-3 px-3 py-2 border rounded"
      />

      <div className="overflow-auto border rounded">
        <table className="min-w-max text-sm">
          <thead className="bg-green-50 text-green-700 sticky top-0">
            <tr>
              <th className="px-3 py-2 border">Mã BN</th>
              <th className="px-3 py-2 border">Bệnh nhân</th>
              <th className="px-3 py-2 border">Tuổi</th>
              <th className="px-3 py-2 border">Mã DVKT</th>
              <th className="px-3 py-2 border">Tên DVKT</th>
              <th className="px-3 py-2 border">Hoàn thành lúc</th>
              <th className="px-3 py-2 border">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {slice.map((item) => (
              <tr key={item.id} className="border-t hover:bg-green-50">
                <td className="px-3 py-2 border">{item.maBenhNhan}</td>
                <td className="px-3 py-2 border">{item.benhNhan}</td>
                <td className="px-3 py-2 border">{calcAge(item.ngaySinh)}</td>
                <td className="px-3 py-2 border">{item.maDvkt}</td>
                <td className="px-3 py-2 border">{item.tenDvkt}</td>
                <td className="px-3 py-2 border">
                  {item.hoanThanhLuc
                    ? new Date(item.hoanThanhLuc).toLocaleString()
                    : "—"}
                </td>

                <td className="px-3 py-2 border">
                  <div className="flex gap-2 justify-center">

                    {item.trangThaiKQ === "approved" ? (
                      <button
                        onClick={() => handleHuyKy(item.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded"
                      >
                        Hủy ký
                      </button>
                    ) : (
                      <button
                        onClick={() => handleKy(item.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded"
                      >
                        Ký
                      </button>
                    )}

                    <button
                      onClick={() => handleEdit(item)}
                      disabled={item.trangThaiKQ === "approved" || item.trangThaiKQ === "sent"}
                      className="px-3 py-1 bg-yellow-400 text-white rounded disabled:opacity-50"
                    >
                      Sửa
                    </button>

                    <button
                      onClick={() => handleGui(item.id)}
                      disabled={item.trangThaiKQ !== "approved"}
                      className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                    >
                      Gửi
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
