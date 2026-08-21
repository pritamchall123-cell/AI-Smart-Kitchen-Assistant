function Input({
  label,
  error,
  id,
  className = "",
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-medium text-[#44403C]"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        className={`
          w-full
          rounded-xl
          border
          bg-white
          px-4
          py-3
          text-sm
          text-[#292524]
          outline-none
          transition-all
          duration-200
          placeholder:text-[#A8A29E]
          focus:ring-2
          disabled:cursor-not-allowed
          disabled:bg-[#F5F5F4]
          ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
              : "border-[#D6D3D1] focus:border-[#EA580C] focus:ring-[#EA580C]/10"
          }
          ${className}
        `}
        {...props}
      />

      {error && (
        <p className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;