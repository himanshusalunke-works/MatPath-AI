export default function ProgressBar({ value = 0, max = 100, label, className = '' }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-[var(--on-surface-variant)]">{label}</span>
          <span className="text-xs font-bold text-[var(--primary)]">{Math.round(pct)}%</span>
        </div>
      )}
      <div
        className="w-full h-2.5 bg-[var(--color-border)] rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Progress'}
      >
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-[var(--secondary)] to-[#2ecc71] shadow-sm"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
