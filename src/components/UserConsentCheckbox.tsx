// src/components/UserConsentCheckbox.tsx
"use client";

import Link from "next/link";

interface UserConsentCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function UserConsentCheckbox({
  checked,
  onChange,
}: UserConsentCheckboxProps) {
  return (
    <label
      id="register-consent-label"
      className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
        checked
          ? "border-[#FFD600] bg-[#FFD600]/5"
          : "border-stone-100 bg-stone-50"
      }`}
    >
      {/* Hidden native checkbox */}
      <input
        id="register-consent-checkbox"
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />

      {/* Custom styled checkbox */}
      <div
        className={`mt-0.5 w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
          checked
            ? "bg-[#FFD600] border-[#FFD600]"
            : "bg-white border-stone-300"
        }`}
      >
        {checked && (
          <svg
            className="w-3 h-3 text-[#111111]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>

      {/* Label text */}
      <span className="text-[10px] font-black uppercase tracking-[0.15em] text-stone-500 leading-relaxed">
        ข้าพเจ้าได้อ่านและยอมรับ{" "}
        <Link
          href="/privacy-policy"
          target="_blank"
          onClick={(e) => e.stopPropagation()}
          className="text-[#111111] underline underline-offset-2 hover:text-[#FFD600] transition-colors duration-200"
        >
          นโยบายความเป็นส่วนตัว
        </Link>{" "}
        และยินยอมให้เก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคลของข้าพเจ้า
        ตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)
      </span>
    </label>
  );
}