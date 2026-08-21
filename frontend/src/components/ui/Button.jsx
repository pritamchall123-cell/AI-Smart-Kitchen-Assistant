function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  onClick,
  disabled = false,
  className = "",
}) {
  const variants = {
    primary:
      "bg-[#EA580C] text-white hover:bg-[#C2410C] focus:ring-[#EA580C]",

    secondary:
      "border border-[#D6D3D1] bg-white text-[#44403C] hover:bg-[#FAFAF9] hover:border-[#A8A29E] focus:ring-[#EA580C]",

    ai:
      "bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] text-white hover:from-[#6D28D9] hover:to-[#4338CA] focus:ring-[#7C3AED]",

    ghost:
      "bg-transparent text-[#57534E] hover:bg-[#F5F5F4] hover:text-[#1C1917] focus:ring-[#EA580C]",

    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",

    success:
      "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
  };

  const sizes = {
    sm: "px-3 py-2 text-xs rounded-lg",
    md: "px-5 py-3 text-sm rounded-xl",
    lg: "px-6 py-3.5 text-base rounded-xl",
    xl: "px-8 py-4 text-base rounded-2xl",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        font-semibold
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:shadow-md
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        disabled:cursor-not-allowed
        disabled:opacity-50
        disabled:hover:translate-y-0
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export default Button;