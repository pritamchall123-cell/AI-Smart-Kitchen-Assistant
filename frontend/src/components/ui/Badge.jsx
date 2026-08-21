function Badge({
  children,
  variant = "gray",
  className = "",
}) {
  const variants = {
    orange: "bg-orange-50 text-orange-700",
    green: "bg-green-50 text-green-700",
    purple: "bg-violet-50 text-violet-700",
    blue: "bg-blue-50 text-blue-700",
    red: "bg-red-50 text-red-700",
    yellow: "bg-yellow-50 text-yellow-700",
    gray: "bg-stone-100 text-stone-600",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        ${variants[variant] || variants.gray}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

export default Badge;