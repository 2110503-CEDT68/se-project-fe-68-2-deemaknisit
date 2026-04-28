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
    <div
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
        className="mt-1 cursor-pointer accent-blue-600"
      />
      <label htmlFor="register-consent-checkbox" className="text-sm text-gray-700 cursor-pointer">
        I have read and agree to the{" "}
        <Link
          href="/privacy-policy"
          target="_blank"
          className="text-blue-600 underline hover:text-blue-800"
        >
          Privacy Policy
        </Link>
        . I consent to the collection and use of my personal data as described.
      </label>
    </div>
  );
}