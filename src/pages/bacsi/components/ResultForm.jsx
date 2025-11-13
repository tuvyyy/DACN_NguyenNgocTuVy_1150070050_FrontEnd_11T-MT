// src/pages/bacsi/components/ResultForm.jsx
import React, { useEffect, useState } from "react";
import {
  handleUpdateKetQua,
  handleChiDinhDVKT,
  handleKeDonThuoc,
  handleCancelLanKham,
} from "../../../controllers/BacSiController";

export default function ResultForm({ selected, idBacSi, idPhong, refresh }) {
  const [form, setForm] = useState({
    chan_doan_so_bo: "",
    chan_doan_cuoi: "",
    ket_qua: "",
    huong_xu_tri: "",
    ghi_chu: "",
  });
  const [loading, setLoading] = useState(false);

  // Reset form khi đổi bệnh nhân
  useEffect(() => {
    if (!selected) {
      setForm({
        chan_doan_so_bo: "",
        chan_doan_cuoi: "",
        ket_qua: "",
        huong_xu_tri: "",
        ghi_chu: "",
      });
      return;
    }
    // Nếu sau này API trả sẵn kết quả thì patch vào form ở đây
  }, [selected]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSave = async () => {
    if (!selected) return;
    setLoading(true);
    await handleUpdateKetQua(selected.id, form, () => {
      refresh?.();
    });
    setLoading(false);
  };

  const onChiDinh = async () => {
    if (!selected) return;
    // TODO: sau này gọi ModalChiDinhDVKT, tạm thời test cứng
    const ds = [{ IdDichVu: 1, SoLuong: 1, GhiChu: "Kiểm tra máu tổng quát" }];
    await handleChiDinhDVKT(selected.id, ds, () => {
      refresh?.();
    });
  };

  const onKeDon = async () => {
    if (!selected) return;
    // TODO: sau này lấy dữ liệu từ ModalKeDonThuoc
    const dto = {
      IdBenhNhan: selected.idBenhNhan,
      IdBacSi: idBacSi,
      SoNgayUong: 3,
      GhiChu: "Uống sau ăn",
      ChiTiet: [
        {
          IdThuoc: 1,
          SoLuong: 2,
          DonVi: "viên",
          Sang: 1,
          Trua: 1,
          Chieu: 0,
          Toi: 0,
          Khuya: 0,
          SoNgayUong: 3,
        },
      ],
    };
    await handleKeDonThuoc(selected.id, dto, () => {
      refresh?.();
    });
  };

  const onCancel = async () => {
    if (!selected) return;
    const reason = window.prompt("Nhập lý do hủy:");
    if (!reason) return;
    await handleCancelLanKham(selected.id, reason, () => {
      refresh?.();
    });
  };

  return (
    <div className="flex-1 bg-white rounded-xl border shadow-sm flex flex-col">
      <div className="bg-gradient-to-r from-sky-600 to-cyan-500 text-white px-4 py-2 rounded-t-xl text-sm font-semibold">
        🩺 Kết quả khám bệnh
      </div>

      <div className="flex-1 overflow-y-auto p-5 text-sm">
        {selected ? (
          <div className="space-y-3">
            <div className="font-semibold text-gray-700">
              Bệnh nhân: <span className="text-sky-700">{selected.benhNhan}</span>
            </div>

            <Input
              label="Chẩn đoán sơ bộ"
              name="chan_doan_so_bo"
              value={form.chan_doan_so_bo}
              onChange={onChange}
            />
            <Input label="Kết quả khám" name="ket_qua" value={form.ket_qua} onChange={onChange} />
            <Input
              label="Chẩn đoán cuối cùng"
              name="chan_doan_cuoi"
              value={form.chan_doan_cuoi}
              onChange={onChange}
            />
            <Input
              label="Hướng xử trí"
              name="huong_xu_tri"
              value={form.huong_xu_tri}
              onChange={onChange}
            />
            <Input label="Ghi chú" name="ghi_chu" value={form.ghi_chu} onChange={onChange} />

            <div className="flex gap-3 pt-2">
              <button
                onClick={onSave}
                disabled={loading}
                className="px-3 py-1 rounded bg-gradient-to-r from-sky-600 to-cyan-500 text-white text-sm font-medium hover:brightness-110 disabled:opacity-50"
              >
                💾 Lưu kết quả
              </button>
              <button
                onClick={onChiDinh}
                className="px-3 py-1 rounded bg-gradient-to-r from-emerald-500 to-green-400 text-white text-sm font-medium hover:brightness-110"
              >
                🧪 Chỉ định DVKT
              </button>
              <button
                onClick={onKeDon}
                className="px-3 py-1 rounded bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-sm font-medium hover:brightness-110"
              >
                💊 Kê đơn thuốc
              </button>
              <button
                onClick={onCancel}
                className="px-3 py-1 rounded bg-gradient-to-r from-rose-500 to-red-400 text-white text-sm font-medium hover:brightness-110"
              >
                ❌ Hủy khám
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 italic mt-20">
            Chọn bệnh nhân để bắt đầu khám...
          </div>
        )}
      </div>
    </div>
  );
}

function Input({ label, name, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-0.5">
        {label}
      </label>
      <input
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-sky-400 outline-none"
      />
    </div>
  );
}
