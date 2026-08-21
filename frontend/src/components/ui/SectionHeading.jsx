function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  centered = false,
}) {
  return (
    <div
      className={`
        flex
        flex-col
        gap-3
        ${
          centered
            ? "items-center text-center"
            : "items-start"
        }
      `}
    >
      {eyebrow && (
        <span className="text-sm font-semibold uppercase tracking-wider text-[#EA580C]">
          {eyebrow}
        </span>
      )}

      <div
        className={
          centered
            ? "flex flex-col items-center"
            : ""
        }
      >
        <h2 className="text-2xl font-bold tracking-tight text-[#1C1917] sm:text-3xl">
          {title}
        </h2>

        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#78716C] sm:text-base">
            {description}
          </p>
        )}
      </div>

      {action && <div>{action}</div>}
    </div>
  );
}

export default SectionHeading;