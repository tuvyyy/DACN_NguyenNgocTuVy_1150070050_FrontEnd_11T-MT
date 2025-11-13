import {
  getWaitingPatients,
  getBillDetail,
  confirmPayment,
  getReceipt,
} from "../api/ThuNganApi";
import Swal from "sweetalert2";

// ================== DANH SÁCH BỆNH NHÂN ==================
export async function loadWaitingPatients(type, setList) {
  const data = await getWaitingPatients(type);
  setList(Array.isArray(data) ? data : []);
}

// ================== XEM CHI TIẾT HÓA ĐƠN ==================
export const handleViewBill = (maHoaDon, navigate) => {
  if (!maHoaDon) {
    console.warn("⚠️ Thiếu mã hóa đơn khi xem chi tiết.");
    return;
  }
  console.log("🔍 Điều hướng đến chi tiết:", maHoaDon);
  navigate(`/thu-ngan/detail/${maHoaDon}`); // ✅ route phải khớp App.js
};

// ================== XÁC NHẬN THANH TOÁN ==================
export async function handleConfirmPayment(maHoaDon, idThuNgan, reloadList) {
  try {
    const res = await confirmPayment(maHoaDon, idThuNgan);
    await Swal.fire({
      icon: "success",
      title: "✅ Thanh toán thành công!",
      text: `${res.message} (${res.maHd})`,
      confirmButtonColor: "#22c55e",
    });

    if (reloadList) reloadList();
  } catch (err) {
    console.error("❌ Lỗi khi xác nhận thanh toán:", err);
    Swal.fire("Lỗi khi thanh toán", "Vui lòng thử lại!", "error");
  }
}

// ================== IN PHIẾU THU ==================
export async function handlePrintReceipt(maHoaDon) {
  const data = await getReceipt(maHoaDon);
  if (!data) return Swal.fire("Không thể in phiếu thu.", "", "error");

  const content = `
    🧾 <b>PHIẾU THU - ${data.maHd}</b><br>
    Bệnh nhân: ${data.tenBenhNhan}<br>
    Ngày thu: ${new Date(data.ngayThu).toLocaleString()}<br>
    Tổng tiền: ${data.tongTien.toLocaleString()} VND<br><br>
    <b>Chi tiết:</b><br>
    ${data.chiTiet
      .map(
        (x) =>
          `- ${x.moTa}: ${x.soLuong} x ${x.donGia.toLocaleString()} = ${x.thanhTien.toLocaleString()}`
      )
      .join("<br>")}
  `;
  const printWindow = window.open("", "_blank");
  printWindow.document.write(`<pre>${content}</pre>`);
  printWindow.document.close();
  printWindow.print();
}
