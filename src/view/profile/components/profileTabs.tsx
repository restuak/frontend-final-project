"use client";

export default function ProfileTabs({ tab, setTab }: any) {
  const tabs = [
    { key: "personal", label: "Personal" },
    { key: "security", label: "Security" },
    { key: "email", label: "Email & Verif" },
  ];

  return (
    <div className="flex bg-white rounded-2xl shadow overflow-x-auto">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => setTab(t.key)}
          className={`flex-1 px-4 py-3 text-sm md:text-base font-medium whitespace-nowrap transition-colors ${
            tab === t.key
              ? "text-[#C53678] border-b-2 border-[#C53678] bg-[#FFFAFA]"
              : "text-gray-600 hover:text-[#C53678]"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
