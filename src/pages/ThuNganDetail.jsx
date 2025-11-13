import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBillDetail } from "../api/ThuNganApi";
import {
  handleConfirmPayment,
  handlePrintReceipt,
} from "../controllers/ThuNganController";
import { ArrowLeft, Printer, CheckCircle2, Edit } from "lucide-react";

export default function ThuNganDetail() {
  const { maHoaDon } = useParams(); // ✅ phải khớp với route /thu-ngan/detail/:maHoaDon
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("TIEN_MAT");
  const [loading, setLoading] = useState(true);

  // ==================== LOAD DỮ LIỆU ====================
  useEffect(() => {
    const loadBill = async () => {
      try {
        setLoading(true);
        const data = await getBillDetail(maHoaDon);
        setBill(data);
      } catch (err) {
        console.error("❌ Lỗi tải hóa đơn:", err);
      } finally {
        setLoading(false);
      }
    };
    loadBill();
  }, [maHoaDon]);

  // ==================== TRẠNG THÁI LOADING ====================
  if (loading)
    return (
      <div className="p-8 text-center text-gray-500 animate-pulse">
        ⏳ Đang tải dữ liệu hóa đơn...
      </div>
    );

  if (!bill)
    return (
      <div className="p-8 text-center text-red-500">
        ⚠️ Không tìm thấy dữ liệu hóa đơn #{maHoaDon}
      </div>
    );

  // ==================== JSX HIỂN THỊ ====================
  return (
    <div className="p-6 space-y-4 bg-gradient-to-br from-white to-sky-50 rounded-2xl shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/thu-ngan")}
          className="text-gray-600 hover:text-black flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Quay lại danh sách
        </button>

        <h2 className="text-xl font-bold text-sky-700">
          💳 Chi tiết thanh toán — {bill.maHd || maHoaDon}
        </h2>
      </div>

      {/* Thông tin bệnh nhân */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <h3 className="font-semibold text-gray-700 mb-2">
          👤 Thông tin bệnh nhân
        </h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <p>
            <b>Họ tên:</b> {bill.benhNhan || "Chưa có"}
          </p>
          <p>
            <b>Ngày tạo:</b>{" "}
            {bill.ngayTao
              ? new Date(bill.ngayTao).toLocaleString()
              : "Không rõ"}
          </p>
          <p>
            <b>Tổng tiền:</b>{" "}
            {bill.tongTien?.toLocaleString("vi-VN") || 0} VND
          </p>
          <p>
            <b>Trạng thái:</b>{" "}
            <span
              className={`font-semibold ${
                bill.trangThai === "DA_THANH_TOAN"
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {bill.trangThai === "DA_THANH_TOAN"
                ? "Đã thanh toán"
                : "Chưa thanh toán"}
            </span>
          </p>
        </div>
      </div>

      {/* Danh sách dịch vụ */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <h3 className="font-semibold text-gray-700 mb-3">
          📋 Danh sách dịch vụ
        </h3>
        <table className="w-full border text-sm">
          <thead className="bg-sky-100 text-gray-700">
            <tr>
              <th className="p-2 border">Mô tả</th>
              <th className="p-2 border w-20">Số lượng</th>
              <th className="p-2 border w-32">Đơn giá</th>
              <th className="p-2 border w-32">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {bill.chiTiet?.map((item, i) => (
              <tr key={i} className="text-center hover:bg-sky-50">
                <td className="p-2 border text-left">{item.moTa}</td>
                <td className="p-2 border">{item.soLuong}</td>
                <td className="p-2 border text-right">
                  {item.donGia?.toLocaleString("vi-VN")}
                </td>
                <td className="p-2 border text-right font-semibold">
                  {item.thanhTien?.toLocaleString("vi-VN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Thanh toán + In phiếu */}
      <div className="bg-white p-4 rounded-lg shadow-sm border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Edit size={18} className="text-blue-500" />
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="border rounded px-3 py-2 text-sm focus:ring focus:ring-sky-200"
          >
            <option value="TIEN_MAT">💵 Tiền mặt</option>
            <option value="VNPAY">💳 VNPay</option>
            <option value="MOMO">📱 MoMo</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() =>
              handleConfirmPayment(bill.maHd, bill.idBenhNhan, paymentMethod)
            }
            className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-1 hover:bg-green-600"
          >
            <CheckCircle2 size={16} /> Xác nhận thanh toán
          </button>

          <button
            onClick={() => handlePrintReceipt(bill.maHd)}
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-1 hover:bg-blue-600"
          >
            <Printer size={16} /> In phiếu thu
          </button>
        </div>
      </div>
    </div>
  );
}
