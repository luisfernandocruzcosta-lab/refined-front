import { useId } from "react";

export function Brand({ className = "" }: { className?: string }) {
  const gradient = useId();
  return (
    <span className={`brand ${className}`} aria-label="Drummond Shop">
      <svg className="brand-mark" viewBox="0 0 64 54" fill="none" aria-hidden="true">
        <defs><linearGradient id={gradient} x1="3" y1="15" x2="62" y2="38" gradientUnits="userSpaceOnUse"><stop stopColor="#e544fa"/><stop offset=".48" stopColor="#9755f5"/><stop offset="1" stopColor="#28b8fa"/></linearGradient></defs>
        <path d="M4 4h32c15 0 25 10 25 23 0 10-5 17-13 22l-9-9c6-3 9-7 9-13 0-8-5-13-13-13H9L4 4Z" fill={`url(#${gradient})`}/>
        <path d="M13 19h21c9 0 14 5 14 12 0 6-4 10-10 12l11 10H33L20 39l-6 14H1l12-34Zm9 10-3 7h13c3 0 5-1 5-4s-2-3-5-3H22Z" fill={`url(#${gradient})`}/>
      </svg>
      <span className="brand-wordmark"><span>DRUMMOND</span><span className="brand-shop">SHOP</span></span>
    </span>
  );
}
