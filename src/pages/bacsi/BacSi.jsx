import React, { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";

import {
  fetchChoKhamList,
  fetchHomNayList,
  handleUpdateKetQua,
  handleChiDinhDVKT,
  handleKeDonThuoc,
  handleCancelLanKham,
  fetchLichSuKham,
  fetchPhongBacSi,
} from "../../controllers/BacSiController";

// Components
import PatientList from "./components/PatientList";
import ResultForm from "./components/ResultForm";
import LichSuKham from "./components/LichSuKham";
import HeaderPhong from "./components/HeaderPhong";

// Modals
import ModalChiDinhDVKT from "./modals/ModalChiDinhDVKT";
import ModalKeDonThuoc from "./modals/ModalKeDonThuoc";
import ModalXacNhanHuy from "./modals/ModalXacNhanHuy";

// =======================================================
// 🔥 HÀM LẤY USER AN TOÀN – KHÔNG BAO GIỜ LỖI undefined
// =======================================================
function getCurrentUser() {
  try {
    const u =
      JSON.parse(localStorage.getItem("user")) ||
      JSON.parse(localStorage.getItem("userInfo")) ||
      null;

    if (!u) return {};

    return {
      id: u.userId || u.id || null,
      tenDangNhap: u.tenDangNhap || u.username || "",
      vaiTro: Array.isArray(u.roles) ? u.roles[0] : u.vaiTro || "",
      idPhong: u.idPhong || null,
    };
  } catch {
    return {};
  }
}

export default function BacSi() {
  const user = getCurrentUser();
  const idBacSi = Number(user.id);
  const idPhong = Number(user.idPhong);

  const isBacSi = (user.vaiTro || "").toUpperCase() === "BAC_SI";

  // ================= STATE ==================
  const [listChoKham, setListChoKham] = useState([]);
  const [listHomNay, setListHomNay] = useState([]);
  const [lichSu, setLichSu] = useState([]);
  const [phong, setPhong] = useState(null);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("CHO_KHAM");

  // ================= VALIDATION ==================
  if (!idBacSi) {
    return (
      <MainLayout>
        <div className="p-8 text-center text-red-600 font-semibold">
          ⚠️ Không xác định bác sĩ. Vui lòng đăng nhập lại.
        </div>
      </MainLayout>
    );
  }

  if (!isBacSi) {
    return (
      <MainLayout>
        <div className="p-8 text-center text-red-600 font-semibold">
          ⚠️ Bạn không có quyền truy cập trang bác sĩ.
        </div>
      </MainLayout>
    );
  }

  // ================= LOAD DATA ==================
  useEffect(() => {
    if (!idBacSi) return;

    // Lấy phòng bác sĩ
    fetchPhongBacSi(idBacSi, setPhong);

    // Lấy danh sách chờ khám + đã khám
    if (idPhong) {
      fetchChoKhamList(idBacSi, idPhong, setListChoKham);
      fetchHomNayList(idBacSi, idPhong, setListHomNay);
    }
  }, [idBacSi, idPhong]);

  useEffect(() => {
    if (selected?.idBenhNhan) {
      fetchLichSuKham(selected.idBenhNhan, setLichSu);
    }
  }, [selected]);

  const currentList = filter === "CHO_KHAM" ? listChoKham : listHomNay;

  // ================= RENDER ==================
  return (
    <MainLayout>
      {/* Header: hiển thị phòng */}
      <HeaderPhong phong={phong} />

      <div className="w-full h-[calc(100vh-80px)] p-4 flex gap-4">
        {/* Cột trái – Danh sách chờ khám */}
        <PatientList
          list={currentList}
          filter={filter}
          setFilter={setFilter}
          selected={selected}
          setSelected={setSelected}
        />

        {/* Cột giữa – Form kết quả */}
        <ResultForm
          selected={selected}
          idBacSi={idBacSi}
          idPhong={idPhong}
          refresh={() => {
            fetchChoKhamList(idBacSi, idPhong, setListChoKham);
            fetchHomNayList(idBacSi, idPhong, setListHomNay);
          }}
        />

        {/* Cột phải – Lịch sử khám */}
        <LichSuKham list={lichSu} />
      </div>

      {/* Modals */}
      <ModalChiDinhDVKT />
      <ModalKeDonThuoc />
      <ModalXacNhanHuy />
    </MainLayout>
  );
}
