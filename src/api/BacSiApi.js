// ============================================
// src/api/BacSiApi.js
// ============================================

import axios from "axios";

/** ============================================
 *  Axios instance + helpers
 *  ============================================ */
const BASE_URL = "https://localhost:7007";

// Lấy token từ localStorage
const getToken = () =>
  localStorage.getItem("access_token") ||
  localStorage.getItem("token") ||
  sessionStorage.getItem("access_token");

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  withCredentials: false,
  validateStatus: () => true,
});

// Gắn Authorization nếu có
http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;

  if (!config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

// Chuẩn hóa response
const ok = (res) => res?.status >= 200 && res?.status < 300;

const wrap = (res) => ({
  ok: ok(res),
  status: res?.status ?? 0,
  data: res?.data?.data ?? res?.data ?? null, // ⭐ auto lấy res.data.data nếu có
  message:
    res?.data?.message ||
    res?.data?.error ||
    (ok(res) ? "Success" : `Error ${res?.status || ""}`.trim()),
});

/** ==========================================================
 *  1) DANH SÁCH BỆNH NHÂN CHỜ KHÁM
 *  GET /api/LanKham/cho-kham?idBacSi=&idPhong=
 *  ========================================================== */
export async function getChoKham({ idBacSi, idPhong }) {
  const res = await http.get("/api/LanKham/cho-kham", { params: { idBacSi, idPhong } });
  return wrap(res);
}

/** ==========================================================
 *  2) DANH SÁCH LƯỢT KHÁM HÔM NAY
 *  ========================================================== */
export async function getHomNay({ idBacSi, idPhong }) {
  const res = await http.get("/api/LanKham/hom-nay", { params: { idBacSi, idPhong } });
  return wrap(res);
}

/** ==========================================================
 *  3) CẬP NHẬT KẾT QUẢ KHÁM
 *  ========================================================== */
export async function updateKetQuaKham(idLanKham, dto) {
  const res = await http.put(`/api/LanKham/${idLanKham}`, dto);
  return wrap(res);
}

/** ==========================================================
 *  4) CHỈ ĐỊNH DVKT
 *  ========================================================== */
export async function chiDinhDichVu(idLanKham, ds) {
  const res = await http.post(`/api/LanKham/${idLanKham}/dichVu`, ds);
  return wrap(res);
}

/** ==========================================================
 *  5) KÊ ĐƠN THUỐC
 *  ========================================================== */
export async function keDonThuoc(idLanKham, dto) {
  const res = await http.post(`/api/LanKham/${idLanKham}/donThuoc`, dto);
  return wrap(res);
}

/** ==========================================================
 *  6) HỦY LƯỢT KHÁM
 *  ========================================================== */
export async function cancelLanKham(idLanKham, reason) {
  const res = await http.patch(`/api/LanKham/${idLanKham}/cancel`, reason ?? "");
  return wrap(res);
}

/** ==========================================================
 *  7) LỊCH SỬ KHÁM
 *  ========================================================== */
export async function getLichSuKham(idBenhNhan) {
  const res = await http.get(`/api/benhNhan/${idBenhNhan}/lichSuKham`);
  return wrap(res);
}

/** ==========================================================
 *  8) (Tạm bỏ) API lấy bảng giá phòng khám
 *  Backend chưa có endpoint này => comment lại
 *  ========================================================== */
// export async function getClinicPrices() {
//   const res = await http.get("/api/chidinh/clinics/prices");
//   return wrap(res);
// }

/** ==========================================================
 *  Helper kiểm tra response
 *  ========================================================== */
export function ensureOk(resp, fallbackMsg = "Có lỗi xảy ra") {
  if (!resp?.ok) throw new Error(resp?.message || fallbackMsg);
  return resp.data;
}
export async function getPhongByBacSi(idBacSi) {
  const res = await http.get(`/api/bacsi/${idBacSi}/phong`);
  return wrap(res);
}

/** ==========================================================
 *  DEFAULT EXPORT
 *  ========================================================== */
const BacSiApi = {
  getChoKham,
  getHomNay,
  updateKetQuaKham,
  chiDinhDichVu,
  keDonThuoc,
  cancelLanKham,
  getLichSuKham,
  getPhongByBacSi,  
  ensureOk,
};

export default BacSiApi;
