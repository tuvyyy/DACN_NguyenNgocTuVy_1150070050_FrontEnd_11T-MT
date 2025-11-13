import axios from "axios";

const API_BASE = "https://localhost:7007/api/reception";

// ==================== API DANH SÁCH ====================
export const getReceptionList = async (date) => {
  try {
    const res = await axios.get(`${API_BASE}/list-today`, {
      params: date ? { date } : {}, // 👈 Gửi date nếu có
    });
    return res.data;
  } catch (err) {
    console.error("❌ Lỗi lấy danh sách tiếp đón:", err.message);
    return [];
  }
};

// ==================== API KHÁC ====================
export const createPatient = async (payload) => {
  try {
    return await axios.post(`${API_BASE}/patients`, payload, {
      validateStatus: () => true,
    });
  } catch (err) {
    console.error("❌ Lỗi gọi API:", err.message);
    return null;
  }
};

export const createRecord = async (payload) => {
  try {
    return await axios.post(`${API_BASE}/records`, payload);
  } catch (err) {
    console.error("❌ Lỗi tạo hồ sơ:", err.message);
    return null;
  }
};

export const checkPatient = async (cccd, sdt) => {
  if (!cccd && !sdt) return null;
  try {
    const res = await axios.get(`${API_BASE}/patients/check`, {
      params: { CCCD: cccd, SoDienThoai: sdt },
    });
    return res.data;
  } catch (err) {
    console.error("❌ Lỗi check bệnh nhân:", err.message);
    return null;
  }
};

export const cancelReception = async (id) => {
  try {
    return await axios.patch(`${API_BASE}/cancel/${id}`);
  } catch (err) {
    console.error("❌ Lỗi hủy tiếp đón:", err.message);
    return null;
  }
};

export const getCancelledList = async () => {
  try {
    const res = await axios.get(`${API_BASE}/cancelled`);
    return res.data;
  } catch (err) {
    console.error("❌ Lỗi lấy danh sách hủy:", err.message);
    return [];
  }
};

export const getStats = async () => {
  try {
    const res = await axios.get(`${API_BASE}/stats`);
    return res.data;
  } catch (err) {
    console.error("❌ Lỗi thống kê tiếp đón:", err.message);
    return {};
  }
};
