import { useId } from "react";

export function Brand({ className = "" }: { className?: string }) {
 const id = useId();
 return <span className={`brand ${className}`} aria-label="Drummond Shop">
 <svg className="brand-mark" viewBox="0 0 440 340" aria-hidden="true">
 <defs>
 <linearGradient id={id+"d"} x1="0" y1="0" x2="1" y2=".8"><stop stopColor="#ed31fa"/><stop offset=".38" stopColor="#8a18ee"/><stop offset=".72" stopColor="#11c4fa"/><stop offset="1" stopColor="#2439e9"/></linearGradient>
 <linearGradient id={id+"r"} x1="0" y1=".3" x2="1" y2=".8"><stop stopColor="#df26f6"/><stop offset=".48" stopColor="#a452fa"/><stop offset="1" stopColor="#2865ff"/></linearGradient>
 </defs>
 <path d="M13 8H269C366 8 431 72 431 160C431 224 400 276 342 315L291 263C332 239 354 205 354 163C354 110 317 83 263 83H42Z" fill={`url(#${id}d)`}/>
 <path d="M85 112H264C318 112 343 140 343 181C343 218 316 246 278 259L337 330H211L137 251L102 330H6L85 112ZM142 176L124 220H241C263 220 281 208 281 192C281 180 270 176 252 176Z" fill={`url(#${id}r)`} fillRule="evenodd"/>
 </svg>
 <span className="brand-wordmark"><span>DRUMMOND</span><span className="brand-shop">SHOP</span></span>
 </span>;
}
