// src/controllers/TiepDonController.js
import {
  createPatient,
  createRecord,
  checkPatient,
  getReceptionList,     // GET /api/reception/list-today?date=YYYY-MM-DD (date optional)
  getCancelledList,     // GET /api/reception/cancelled
  getStats,             // GET /api/reception/stats
} from "../api/TiepDonApi";

/**
 * Helper: build object bệnh nhân đưa sang trang Chỉ định DV
 */
const buildPatientInfoFromForm = (form, { idBenhNhan, idHoSo, maBn, maHs }) => ({
  idBenhNhan,
  idHoSo,
  maBn,
  maHs,
  hoTen: form.ho_ten || "",
  gioiTinh: form.gio_tinh || "",
  ngaySinh: form.ngay_sinh || "",
  soDienThoai: form.so_dien_thoai || "",
  diaChi: form.dia_chi_duong || "",
  email: form.email || "",
});

/**
 * Helper: build object bệnh nhân từ payload state=NEED_ORDER trả về từ BE
 */
const buildPatientInfoFromServer = (data) => {
  const hoSo = data?.hoSo || {};
  const bn = data?.benhNhan || {};
  return {
    idBenhNhan: bn.IdBenhNhan,
    idHoSo: hoSo.IdHoSo,
    maBn: bn.MaBn,
    maHs: hoSo.MaHs,
    hoTen: bn.HoTen,
    gioiTinh: bn.GioiTinh,
    ngaySinh: bn.NgaySinh,
    soDienThoai: bn.SoDienThoai,
    diaChi: bn.DiaChiDuong,
    email: bn.Email,
  };
};

// =======================================================
// 🧩 LƯU TIẾP ĐÓN (chính) — gọi từ TiepDon.jsx
// - Gọi /patients để phân nhánh
// - Nếu cần, tự tạo /records
// - Gọi onNext(info, state) để FE điều hướng (hoặc bật modal nếu NEED_ORDER)
// =======================================================
export async function handleTiepDonSave(form, onNext) {
  const patientPayload = {
    Ho_ten: form.ho_ten,
    Ngay_sinh: form.ngay_sinh || null,
    Gio_tinh: form.gio_tinh,
    CCCD: form.cccd,
    So_dien_thoai: form.so_dien_thoai,
    Email: form.email,
    Quoc_tich: form.quoc_tich,
    Dan_toc: form.dan_toc,
    Nghe_nghiep: form.nghe_nghiep,
    Dia_chi_duong: form.dia_chi_duong,
    Dia_chi_xa: "",
    Dia_chi_huyen: "",
    Dia_chi_tinh: "",
    Quoc_gia: form.quoc_gia,
  };

  try {
    const res = await createPatient(patientPayload);
    if (!res || !res.data) {
      alert("❌ Không thể kết nối máy chủ.");
      return;
    }

    const data = res.data;
    const state = data.state;
    console.log("🚀 [handleTiepDonSave] state:", state, "raw:", data);

    switch (state) {
      // ✅ TH1: BN mới -> tạo hồ sơ luôn
      case "NEW_PATIENT_CREATED": {
        const recordRes = await createRecord({ IdBenhNhan: data.idBenhNhan, IdNguoiTao: 2 });
        if (!recordRes?.data) {
          alert("❌ Lỗi tạo hồ sơ.");
          return;
        }
        const { id, maHs } = recordRes.data;
        const info = buildPatientInfoFromForm(form, {
          idBenhNhan: data.idBenhNhan,
          idHoSo: id,
          maBn: data.maBn,
          maHs,
        });
        console.log("📤 [onNext] NEW:", info);
        if (typeof onNext === "function") onNext(info, "NEW");
        break;
      }

      // ✅ TH2: BN cũ, chưa có hồ sơ hôm nay
      case "NEED_CREATE_RECORD": {
        const recordRes = await createRecord({ IdBenhNhan: data.idBenhNhan, IdNguoiTao: 2 });
        if (!recordRes?.data) {
          alert("❌ Lỗi tạo hồ sơ.");
          return;
        }
        const { id, maHs } = recordRes.data;
        const info = buildPatientInfoFromForm(form, {
          idBenhNhan: data.idBenhNhan,
          idHoSo: id,
          maBn: data.maBn,
          maHs,
        });
        console.log("📤 [onNext] CREATE:", info);
        if (typeof onNext === "function") onNext(info, "CREATE");
        break;
      }

      // ⚠️ TH3: BN đã tiếp đón hôm nay nhưng chưa chỉ định DVKT
// ⚠️ TH3: BN đã tiếp đón hôm nay nhưng chưa chỉ định DVKT
case "NEED_ORDER": {
  console.log("[handleTiepDonSave] state: NEED_ORDER raw:", data);

  const hoSo = data.hoSo || {};
  const bn  = data.benhNhan || {};

  // helper đọc cả PascalCase lẫn camelCase
  const pick = (o, A, a) => o?.[A] ?? o?.[a] ?? null;

  const info = {
    idBenhNhan: pick(bn,  "IdBenhNhan", "idBenhNhan"),
    idHoSo:     pick(hoSo,"IdHoSo",     "idHoSo"),
    maBn:       pick(bn,  "MaBn",       "maBn"),
    maHs:       pick(hoSo,"MaHs",       "maHs"),
    hoTen:      pick(bn,  "HoTen",      "hoTen"),
    gioiTinh:   pick(bn,  "GioiTinh",   "gioiTinh"),
    ngaySinh:   pick(bn,  "NgaySinh",   "ngaySinh"),
    soDienThoai:pick(bn,  "SoDienThoai","soDienThoai"),
    diaChi:     pick(bn,  "DiaChiDuong","diaChiDuong"),
    email:      pick(bn,  "Email",      "email"),
  };

  console.log("[handleTiepDonSave] -> info built:", info);

  if (typeof onNext === "function") onNext(info, "NEED_ORDER"); // mở modal ở FE
  break;
}


      // 🩺 TH4: BN đã chỉ định, đang chờ bác sĩ
      case "ORDERED_WAITING_DOCTOR": {
        alert("🩺 Bệnh nhân đã được chỉ định và đang chờ bác sĩ khám. Không cần tiếp đón lại.");
        break;
      }

      // 🧾 TH5: BN đã khám xong hoặc đóng hồ sơ
      case "EXAM_DONE_OR_CLOSED": {
        alert("ℹ️ Bệnh nhân đã khám xong / hồ sơ đã đóng. Vui lòng ghi nhận để bác sĩ xử lý 'khám lại'.");
        break;
      }

      default: {
        alert("⚠️ Trạng thái hồ sơ không xác định. Vui lòng kiểm tra lại!");
        console.warn("⚠️ Unknown state payload:", data);
        break;
      }
    }
  } catch (err) {
    console.error("❌ Lỗi khi lưu tiếp đón:", err);
    alert("Đã xảy ra lỗi khi lưu tiếp đón. Vui lòng thử lại!");
  }
}

// =======================================================
// 🔎 AUTO FILL khi nhập CCCD / SĐT tại TiepDon.jsx
// =======================================================
export async function autoFillPatient(cccd, sdt, setForm) {
  try {
    const res = await checkPatient(cccd, sdt);
    console.log("🔎 [autoFillPatient] check:", res);
    if (res?.exists && res.patient) {
      const p = res.patient;
      setForm((prev) => ({
        ...prev,
        ma_bn: p.maBn,
        ho_ten: p.hoTen,
        gioi_tinh: p.gioiTinh,
        ngay_sinh: p.ngaySinh,
        cccd: p.cccd,
        so_dien_thoai: p.soDienThoai,
      }));
    }
  } catch (err) {
    console.warn("⚠️ Lỗi tra cứu bệnh nhân:", err?.message || err);
  }
}

// =======================================================
// 📋 Danh sách tiếp đón + ❌ danh sách hủy (date optional)
//  - date: 'YYYY-MM-DD' (nếu truyền) → BE lọc theo ngày
// =======================================================
export async function fetchReceptionLists(setToday, setCancelled, date) {
  try {
    const todayList = await getReceptionList(date); // trả mảng hoặc []
    const cancelled = await getCancelledList();     // trả mảng hoặc []
    setToday(Array.isArray(todayList) ? todayList : []);
    setCancelled(Array.isArray(cancelled) ? cancelled : []);
    console.log("📥 [fetchReceptionLists] today:", todayList?.length, "cancelled:", cancelled?.length);
  } catch (e) {
    console.error("❌ Lỗi tải danh sách tiếp đón:", e);
    setToday([]);
    setCancelled([]);
  }
}

// =======================================================
// 📈 Thống kê tiếp đón (hôm nay)
// =======================================================
export async function fetchReceptionStats(setStats) {
  try {
    const stats = await getStats();
    setStats(stats || { totalToday: 0, cancelled: 0, newPatients: 0, reExam: 0 });
    console.log("📊 [fetchReceptionStats]:", stats);
  } catch (e) {
    console.error("❌ Lỗi tải thống kê:", e);
    setStats({ totalToday: 0, cancelled: 0, newPatients: 0, reExam: 0 });
  }
}
