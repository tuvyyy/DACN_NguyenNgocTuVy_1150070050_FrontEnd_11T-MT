import React, { useEffect, useState } from "react";
import {
  handleUpdateKetQua,
  handleCancelLanKham,
  fetchDonTheoLanKham,
  fetchDVKTTheoLanKham,
} from "../../../controllers/BacSiController";

export default function ResultForm({
  selected,
  refresh,
  onOpenKeDon,
  onOpenChiDinh,
}) {
  const [activeTab, setActiveTab] = useState("kham");
  const [lastTab, setLastTab] = useState("kham");

  const [form, setForm] = useState({
    chan_doan_so_bo: "",
    chan_doan_cuoi: "",
    ket_qua: "",
    huong_xu_tri: "",
    ghi_chu: "",
  });

  const [donThuoc, setDonThuoc] = useState(null);
  const [dsDVKT, setDsDVKT] = useState([]);

  // =============== LOAD DETAIL ===============
  useEffect(() => {
    console.log("➡️ SELECTED:", selected);

    if (!selected?.id) {
      setDonThuoc(null);
      setDsDVKT([]);
      return;
    }

    fetchDonTheoLanKham(selected.id, setDonThuoc);
    fetchDVKTTheoLanKham(selected.id, setDsDVKT);
  }, [selected]);


  const getSlide = () => {
    const order = ["kham", "dvkt", "don", "save"];
    return order.indexOf(activeTab) > order.indexOf(lastTab)
      ? "slide-left"
      : "slide-right";
  };

  const changeTab = (id) => {
    setLastTab(activeTab);
    setActiveTab(id);
  };

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSave = async () => {
    if (!selected?.id) return;
    await handleUpdateKetQua(selected.id, form, refresh);
  };

  const onCancel = async () => {
    if (!selected?.id) return;
    const reason = prompt("Nhập lý do hủy:");
    if (!reason) return;
    await handleCancelLanKham(selected.id, reason, refresh);
  };

  return (
    <div className="flex-1 bg-white rounded-xl border shadow-md flex flex-col overflow-hidden">

      {/* ===================== THÔNG TIN BỆNH NHÂN ===================== */}
      {selected && (
        <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-blue-100 text-sm text-gray-700 fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-2">

            <div><b>👤 Bệnh nhân:</b> {selected.benhNhan?.hoTen || "--"}</div>
            <div><b>Ngày sinh:</b> {selected.benhNhan?.ngaySinh || "--"}</div>
            <div><b>SĐT:</b> {selected.benhNhan?.soDienThoai || "--"}</div>
            <div><b>Địa chỉ:</b> {selected.benhNhan?.diaChi || "--"}</div>

            <div><b>🌡️ Nhiệt độ:</b> {selected.sinhHieu?.nhietDo ?? "--"} °C</div>
            <div><b>💓 Mạch:</b> {selected.sinhHieu?.mach ?? "--"} bpm</div>
            <div><b>🩸 Huyết áp:</b> {selected.sinhHieu?.huyetAp ?? "--"}</div>
            <div><b>🫁 Nhịp thở:</b> {selected.sinhHieu?.nhipTho ?? "--"}</div>
            <div><b>🩸 SpO2:</b> {selected.sinhHieu?.spo2 ?? "--"}%</div>
            <div><b>⚖️ Cân nặng:</b> {selected.sinhHieu?.canNang ?? "--"} kg</div>
            <div><b>📏 Chiều cao:</b> {selected.sinhHieu?.chieuCao ?? "--"} cm</div>

          </div>
        </div>
      )}

      {/* ===================== TAB BAR ===================== */}
      <div className="px-4 py-2 bg-gray-100 border-b flex items-center gap-2 text-sm font-semibold">
        <FancyTab id="kham" label="KHÁM BỆNH" activeTab={activeTab} changeTab={changeTab}/>
        <FancyTab id="dvkt" label="CHỈ ĐỊNH CLS" activeTab={activeTab} changeTab={changeTab}/>
        <FancyTab id="don"  label="KÊ ĐƠN THUỐC" activeTab={activeTab} changeTab={changeTab}/>

        <div className="flex-1 flex justify-end">
          <FancyTab id="save" icon="💾" label="Lưu kết quả" activeTab={activeTab} changeTab={changeTab}/>
        </div>
      </div>

      {/* ===================== CONTENT ===================== */}
      <div className={`flex-1 overflow-y-auto p-5 text-sm ${getSlide()}`}>

        {!selected ? (
          <div className="text-center text-gray-400 italic mt-20 fade-in">
            Chọn bệnh nhân để bắt đầu khám...
          </div>
        ) : (
          <>

            {/* TAB KHÁM */}
            {activeTab === "kham" && (
              <div className="space-y-4 fade-in">
                <Input label="Chẩn đoán sơ bộ" name="chan_doan_so_bo" value={form.chan_doan_so_bo} onChange={onChange}/>
                <Input label="Kết quả khám" name="ket_qua" value={form.ket_qua} onChange={onChange}/>
                <Input label="Chẩn đoán cuối" name="chan_doan_cuoi" value={form.chan_doan_cuoi} onChange={onChange}/>
                <Input label="Hướng xử trí" name="huong_xu_tri" value={form.huong_xu_tri} onChange={onChange}/>
                <Input label="Ghi chú" name="ghi_chu" value={form.ghi_chu} onChange={onChange}/>
              </div>
            )}

            {/* TAB DVKT */}
            {activeTab === "dvkt" && (
              <div className="space-y-3 fade-in">
                <div className="flex justify-end">
                  <button
                    onClick={onOpenChiDinh}
                    className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 shadow"
                  >
                    THÊM CHỈ ĐỊNH
                  </button>
                </div>
                <DVKTTable dsDVKT={dsDVKT}/>
              </div>
            )}

            {/* TAB ĐƠN THUỐC */}
            {activeTab === "don" && (
              <div className="space-y-3 fade-in">
                <div className="flex justify-end">
                  <button
                    onClick={onOpenKeDon}
                    className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600 shadow"
                  >
                    💊 + Kê đơn
                  </button>
                </div>
                <DonThuoc donThuoc={donThuoc}/>
              </div>
            )}

            {/* TAB LƯU */}
            {activeTab === "save" && (
              <div className="flex justify-end fade-in">
                <div className="w-64 bg-gray-100 p-4 rounded-lg shadow-md space-y-3">
                  <button
                    onClick={onSave}
                    className="w-full px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  >
                    💾 Lưu kết quả
                  </button>
                  <button
                    onClick={onCancel}
                    className="w-full px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                  >
                    ❌ Hủy khám
                  </button>
                </div>
              </div>
            )}

          </>
        )}
      </div>
    </div>
  );
}

/* ================================================================== */
/* ---------------------- COMPONENTS ------------------------------- */
/* ================================================================== */

function FancyTab({ id, label, icon, activeTab, changeTab }) {
  const active = activeTab === id;

  return (
    <button
      onClick={() => changeTab(id)}
      className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all 
        ${active ? 'tab-active' : 'hover:bg-gray-200 text-gray-600'}`}
    >
      <span className={active ? "tab-active-icon" : ""}>{icon}</span>
      {label}
    </button>
  );
}

function Input({ label, name, value, onChange }) {
  return (
    <div className="floating-group">
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder=" "
        className="floating-input"
      />
      <label className="floating-label">{label}</label>
    </div>
  );
}

function DonThuoc({ donThuoc }) {
  if (!donThuoc)
    return <div className="italic text-gray-500">Chưa có đơn thuốc.</div>;

  return (
    <div className="border rounded p-3 bg-gray-50 shadow-sm fade-in">
      {donThuoc.chiTiet?.map((t, idx) => (
        <div key={idx} className="border-b py-2">
          <div className="font-semibold">{t.tenThuoc}</div>
          <div className="text-xs text-gray-600">
            SL: {t.soLuong} — {t.donVi}
          </div>
        </div>
      ))}
    </div>
  );
}

function DVKTTable({ dsDVKT }) {
  return (
    <div className="rounded-xl shadow-lg overflow-hidden border bg-white">
      <table className="w-full text-sm">
        <thead className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b">
          <tr className="text-gray-700">
            <th className="p-3 font-semibold text-left">Trạng thái</th>
            <th className="p-3 font-semibold text-left">Dịch vụ</th>
            <th className="p-3 font-semibold text-center">SL</th>
            <th className="p-3 font-semibold text-center">Thời gian</th>
            <th className="p-3 font-semibold text-left">Ghi chú</th>
            <th className="p-3 font-semibold text-center">Khác</th>
          </tr>
        </thead>

        <tbody>
          {dsDVKT.map((dv) => (
            <tr key={dv.id} className="hover:bg-blue-50 transition">
              <td className="p-3 border-b">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      dv.trangThai === "pending"
                        ? "bg-red-500"
                        : dv.trangThai === "doing"
                        ? "bg-yellow-400"
                        : "bg-green-500"
                    }`}
                  />
                  {dv.trangThai}
                </div>
              </td>

              <td className="p-3 border-b">
                <div className="font-semibold text-gray-800">{dv.tenDvkt}</div>
                <div className="text-xs text-gray-500">Mã: {dv.maDvkt}</div>
              </td>

              <td className="p-3 text-center border-b">{dv.soLuong}</td>

              <td className="p-3 text-center border-b text-xs">
                {dv.thoiGianChiDinh
                  ? new Date(dv.thoiGianChiDinh).toLocaleString("vi-VN")
                  : "--"}
              </td>

              <td className="p-3 border-b italic">{dv.ghiChu || ""}</td>

              <td className="p-3 text-center border-b">
                <button className="text-orange-500 hover:text-orange-700 mr-3">
                  ✏️
                </button>
                <button className="text-red-500 hover:text-red-700">
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
