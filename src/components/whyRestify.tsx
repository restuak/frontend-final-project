"use client";

import { Home, ShieldCheck, Percent, Headset } from "lucide-react";

export default function WhyRestify() {
  const features = [
    {
      title: "Seperti Rumah Sendiri",
      desc: "Kami berkomitmen menghadirkan pengalaman yang nyaman dan personal, sehingga setiap masa tinggal terasa seperti di rumah sendiri.",
      icon: <Home className="w-10 h-10 text-[#FF5841]" />,
    },
    {
      title: "Penyewa Terverifikasi",
      desc: "Keamanan dan kepercayaan adalah prioritas kami. Setiap penyewa wajib melalui proses verifikasi sebelum bergabung.",
      icon: <ShieldCheck className="w-10 h-10 text-[#FF5841]" />,
    },
    {
      title: "Diskon Spesial",
      desc: "Nikmati harga terbaik dengan promo musiman dan penawaran khusus agar perjalananmu lebih hemat.",
      icon: <Percent className="w-10 h-10 text-[#FF5841]" />,
    },
    {
      title: "24/7 Dukungan",
      desc: "Tim kami selalu siap membantu, kapanpun kamu butuh bantuan dalam pemesanan maupun selama menginap.",
      icon: <Headset className="w-10 h-10 text-[#FF5841]" />,
    },
  ];

  return (
    <section className="py-12 px-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-10 text-herogreen">
        Kenapa RESTIFY?
      </h2>
      <div className="grid grid-cols-2 gap-6">
        {features.map((f, i) => (
          <div
            key={i}
            className="flex flex-col items-center text-center bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition"
          >
            <div className="mb-4">{f.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-600 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
