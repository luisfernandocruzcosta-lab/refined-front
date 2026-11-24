export function Brand({ className = "" }: { className?: string }) {
  return <span className={`brand ${className}`} aria-label="Drummondshop">drummond<span className="text-primary">shop</span><span className="brand-dot" aria-hidden="true" /></span>;
}