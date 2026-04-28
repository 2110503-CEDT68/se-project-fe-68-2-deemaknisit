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
    <div className="flex items-start gap-2 mt-4">
      <input
        type="checkbox"
        id="user-consent"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 cursor-pointer accent-blue-600"
      />
      <label htmlFor="user-consent" className="text-sm text-gray-700">
        I have read and agree to{" "}
        <Link
          href="/privacy-policy"
          target="_blank"
          className="text-blue-600 font-bold underline hover:text-blue-800"
        >
          the Privacy Policy
        </Link>
        . I consent to the collection and use of my personal data as described.
      </label>
    </div>
  );
}