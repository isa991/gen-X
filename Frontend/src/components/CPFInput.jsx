"use client";

export default function CPFInput({
  value,
  onChange,
  placeholder = "000.000.000-00",
  className = "",
}) {
  const formatCPF = (value) => {
    const numbers = value.replace(/\D/g, "");

    return numbers
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1-$2")
      .slice(0, 14);
  };

  const handleChange = (event) => {
    const formattedValue = formatCPF(event.target.value);

    onChange(formattedValue);
  };

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      maxLength={14}
      className={`
        text-slate-800
        placeholder:text-slate-500
        bg-white
        ${className}
      `}
    />
  );
}
