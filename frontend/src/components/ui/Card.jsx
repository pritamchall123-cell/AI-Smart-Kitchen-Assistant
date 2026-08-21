function Card({
  children,
  variant = "default",
  className = "",
  onClick,
}) {
  const variants = {
    default:
      "border border-[#E7E5E4] bg-white shadow-sm",

    interactive:
      "border border-[#E7E5E4] bg-white shadow-sm hover:-translate-y-1 hover:shadow-lg cursor-pointer",

    soft:
      "border border-transparent bg-[#FAF9F6] shadow-sm",

    ai:
      "border border-violet-100 bg-gradient-to-br from-violet-50 to-indigo-50 shadow-sm",
  };

  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl
        transition-all
        duration-300
        ${variants[variant] || variants.default}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default Card;