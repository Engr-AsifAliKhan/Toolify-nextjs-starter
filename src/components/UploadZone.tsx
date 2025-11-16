"use client";

import React, { useCallback } from "react";

type Props = {
  accept: string;
  onFile: (file: File) => void;
  label?: string;
  maxMB?: number;
};

export default function UploadZone({ accept, onFile, label = "Upload", maxMB = 10 }: Props) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (!f) return;
      if (f.size > maxMB * 1024 * 1024) {
        alert(`File exceeds ${maxMB} MB limit.`);
        e.target.value = "";
        return;
      }
      if (accept && !f.type.match(accept.replace("*", ".*"))) {
        alert(`Invalid file type: ${f.type}`);
        e.target.value = "";
        return;
      }
      onFile(f);
    },
    [accept, onFile, maxMB]
  );

  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        className="mt-2 block w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-white"
      />
      <p className="mt-1 text-xs text-gray-500">Max {maxMB} MB</p>
    </label>
  );
}