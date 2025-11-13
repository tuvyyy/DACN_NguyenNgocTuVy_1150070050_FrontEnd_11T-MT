// src/pages/AdminDashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Settings, Activity, Shield } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Quản lý người dùng",
      icon: <Users size={40} className="text-sky-600" />,
      desc: "Tạo, sửa, xoá, khoá và phân quyền người dùng hệ thống.",
      path: "/admin/users",
      glow: "shadow-[0_0_25px_3px_rgba(56,189,248,0.3)]",
    },
    {
      title: "Vai trò & phân quyền",
      icon: <Shield size={40} className="text-pink-500" />,
      desc: "Quản lý vai trò, quyền hạn và truy cập chức năng.",
      path: "/admin/roles",
      glow: "shadow-[0_0_25px_3px_rgba(244,114,182,0.3)]",
    },
    {
      title: "Quản lý danh mục DVKT",
      icon: <Activity size={40} className="text-emerald-500" />,
      desc: "Quản lý nhóm DV, dịch vụ, và bảng giá kỹ thuật y tế.",
      path: "/admin/danh-muc-dvkt", // ✅ chỉnh đúng route
      glow: "shadow-[0_0_25px_3px_rgba(16,185,129,0.25)]",
    },
    {
      title: "Quản lý danh mục Thuốc",
      icon: <Settings size={40} className="text-indigo-500" />,
      desc: "Quản lý nhóm thuốc, thuốc và bảng giá thuốc.",
      path: "/admin/danh-muc-thuoc",
      glow: "shadow-[0_0_25px_3px_rgba(99,102,241,0.25)]",
    },
  ];

  return (
    <div className="min-h-[80vh] flex flex-col items-center">
      <motion.h1
        className="text-3xl font-bold text-sky-700 mb-10 flex items-center gap-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        🪄 Bảng điều hành hệ thống
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            className={`relative p-6 rounded-2xl bg-white border border-sky-100 hover:${card.glow} cursor-pointer transition-all duration-300`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(card.path)}
          >
            <div className="flex flex-col items-start gap-3">
              {card.icon}
              <h2 className="text-lg font-semibold text-sky-800">{card.title}</h2>
              <p className="text-gray-600 text-sm leading-snug">{card.desc}</p>
            </div>

            {/* Hiệu ứng phản chiếu sáng nhẹ */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-white/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
