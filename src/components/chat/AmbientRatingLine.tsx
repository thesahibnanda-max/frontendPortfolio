// Signature hero visual: an ambient, ever-drifting rating-history line — the
// shape competitive programmers stare at after every contest — rather than a
// generic AI-product gradient blob. Purely decorative, aria-hidden.
const PATH =
  'M0,70 L40,55 L80,62 L120,30 L160,45 L200,20 L240,38 L280,15 L320,48 L360,25 L400,52 L440,18 L480,40 L520,10 L560,35 L600,22'

export function AmbientRatingLine() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] overflow-hidden [mask-image:linear-gradient(to_bottom,black,transparent)]"
    >
      <svg
        className="absolute top-16 left-1/2 h-[180px] w-[1800px] -translate-x-1/2 animate-[ambient-drift_38s_linear_infinite] opacity-[0.14] dark:opacity-[0.18]"
        viewBox="0 0 1800 80"
        fill="none"
      >
        {[0, 600, 1200].map((offset) => (
          <g key={offset} transform={`translate(${offset}, 0)`}>
            <path
              d={PATH}
              stroke="var(--primary)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {PATH.split('L').map((seg, i) => {
              const [x, y] = seg.replace('M', '').trim().split(',')
              return <circle key={i} cx={x} cy={y} r="2.5" fill="var(--signal)" />
            })}
          </g>
        ))}
      </svg>
    </div>
  )
}
