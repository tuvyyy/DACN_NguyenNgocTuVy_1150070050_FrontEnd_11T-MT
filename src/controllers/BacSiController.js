// ======================================================
// src/controllers/BacSiController.js
// ======================================================

import {
  getChoKham,
  getHomNay,
  updateKetQuaKham,
  chiDinhDichVu,
  keDonThuoc,
  cancelLanKham,
  getLichSuKham,
} from "../api/BacSiApi";

import { toast } from "react-toastify";
import { getPhongByBacSi } from "../api/BacSiApi"; // ⭐ thêm import

/* ======================================================
 *  1️⃣ DANH SÁCH CHỜ KHÁM
 * ====================================================== */
export async function fetchChoKhamList(idBacSi, idPhong, setList) {
  try {
    const res = await getChoKham({ idBacSi, idPhong });

    if (!res.ok) throw new Error(res.message);

    setList(res.data || []);
    console.log("[FE] 👉 ChoKham:", res.data);

  } catch (err) {
    console.error("❌ Lỗi fetchChoKhamList:", err);
    toast.error("Không tải được danh sách chờ khám!");
  }
}

/* ======================================================
 *  2️⃣ DANH SÁCH HÔM NAY
 * ====================================================== */
export async function fetchHomNayList(idBacSi, idPhong, setList) {
  try {
    const res = await getHomNay({ idBacSi, idPhong });

    if (!res.ok) throw new Error(res.message);

    setList(res.data || []);
    console.log("[FE] 👉 HomNay:", res.data);

  } catch (err) {
    console.error("❌ Lỗi fetchHomNayList:", err);
    toast.error("Không thể tải danh sách hôm nay!");
  }
}

/* ======================================================
 *  3️⃣ CẬP NHẬT KẾT QUẢ KHÁM
 * ====================================================== */
export async function handleUpdateKetQua(idLanKham, form, onDone) {
  try {
    const dto = {
      ChanDoanSoBo: form.chan_doan_so_bo,
      ChanDoanCuoi: form.chan_doan_cuoi,
      KetQuaKham: form.ket_qua,
      HuongXuTri: form.huong_xu_tri,
      GhiChu: form.ghi_chu,
    };

    const res = await updateKetQuaKham(idLanKham, dto);

    if (!res.ok) throw new Error(res.message);

    toast.success("💾 Lưu kết quả khám thành công!");
    onDone?.();

  } catch (err) {
    console.error("❌ Lỗi handleUpdateKetQua:", err);
    toast.error("Không thể lưu kết quả khám!");
  }
}

/* ======================================================
 *  4️⃣ CHỈ ĐỊNH DVKT
 * ====================================================== */
export async function handleChiDinhDVKT(idLanKham, ds, onDone) {
  try {
    const res = await chiDinhDichVu(idLanKham, ds);

    if (!res.ok) throw new Error(res.message);

    toast.success("🧪 Đã chỉ định DVKT!");
    onDone?.();

  } catch (err) {
    console.error("❌ Lỗi handleChiDinhDVKT:", err);
    toast.error("Không thể chỉ định DVKT!");
  }
}

/* ======================================================
 *  5️⃣ KÊ ĐƠN THUỐC
 * ====================================================== */
export async function handleKeDonThuoc(idLanKham, dto, onDone) {
  try {
    const res = await keDonThuoc(idLanKham, dto);

    if (!res.ok) throw new Error(res.message);

    toast.success("💊 Kê đơn thành công!");
    onDone?.(res.data);

  } catch (err) {
    console.error("❌ Lỗi handleKeDonThuoc:", err);
    toast.error("Không thể kê đơn thuốc!");
  }
}

/* ======================================================
 *  6️⃣ HỦY LƯỢT KHÁM
 * ====================================================== */
export async function handleCancelLanKham(idLanKham, reason, onDone) {
  try {
    const res = await cancelLanKham(idLanKham, reason);

    if (!res.ok) throw new Error(res.message);

    toast.info("🗑️ Lượt khám đã bị hủy!");
    onDone?.();

  } catch (err) {
    console.error("❌ Lỗi handleCancelLanKham:", err);
    toast.error("Không thể hủy lượt khám!");
  }
}

export async function fetchPhongBacSi(idBacSi, setPhong) {
  try {
    const res = await getPhongByBacSi(idBacSi);
    if (!res.ok) throw new Error(res.message);

    setPhong(res.data); // trả về { idPhong, tenPhong, idKhoa }
    console.log("[Phong BS]", res.data);
  } catch (err) {
    console.error("❌ Lỗi tải phòng bác sĩ:", err);
  }
}

/* ======================================================
 *  7️⃣ LỊCH SỬ KHÁM
 * ====================================================== */
export async function fetchLichSuKham(idBenhNhan, setList) {
  try {
    const res = await getLichSuKham(idBenhNhan);

    if (!res.ok) throw new Error(res.message);

    setList(res.data || []);
    console.log("[FE] 👉 LichSuKham:", res.data);

  } catch (err) {
    console.error("❌ Lỗi fetchLichSuKham:", err);
    toast.error("Không thể tải lịch sử khám!");
  }
}
