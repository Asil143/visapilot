import Link from "next/link";

export function Brand({
  light = false,
  onClick,
}: {
  light?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href="/"
      className={`sc-brand${light ? " sc-brand-light" : ""}`}
      onClick={onClick}
      aria-label="StatusClock home"
    >
      <svg
        width="34"
        height="34"
        viewBox="0 0 36 36"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="18"
          cy="18"
          r="15.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M18 5v4m0 18v4M5 18h4m18 0h4M18 11v7l5 3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path d="m26 5 1 4 4 1-4 1-1 4-1-4-4-1 4-1Z" fill="currentColor" />
      </svg>
      <span>
        StatusClock
        <span className="sc-brand-dot" aria-hidden="true">
          ✳
        </span>
      </span>
    </Link>
  );
}
