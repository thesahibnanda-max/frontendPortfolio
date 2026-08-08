import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceArea,
  CartesianGrid,
} from 'recharts'
import type { CodeforcesRatingTransition } from '@/api/types'

// Authentic Codeforces rank-tier bands, drawn behind the line so the chart
// reads the way every competitive programmer already reads their own graph.
const TIERS = [
  { from: 0, to: 1200, color: 'var(--color-rank-newbie)', label: 'Newbie' },
  { from: 1200, to: 1400, color: 'var(--color-rank-pupil)', label: 'Pupil' },
  { from: 1400, to: 1600, color: 'var(--color-rank-specialist)', label: 'Specialist' },
  { from: 1600, to: 1900, color: 'var(--color-rank-expert)', label: 'Expert' },
  { from: 1900, to: 2300, color: 'var(--color-rank-master)', label: 'Master' },
  { from: 2300, to: 3500, color: 'var(--color-rank-grandmaster)', label: 'Grandmaster' },
]

export function CodeforcesRatingChart({ history }: { history: CodeforcesRatingTransition[] }) {
  const data = history.map((h, i) => ({
    index: i + 1,
    rating: h.newRating,
    contestName: h.contestName,
  }))

  const ratings = data.map((d) => d.rating)
  const minRating = Math.min(...ratings)
  const maxRating = Math.max(...ratings)
  const yMin = Math.max(0, Math.floor((minRating - 100) / 100) * 100)
  const yMax = Math.ceil((maxRating + 100) / 100) * 100

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
        {TIERS.filter((t) => t.to > yMin && t.from < yMax).map((tier) => (
          <ReferenceArea
            key={tier.label}
            y1={Math.max(tier.from, yMin)}
            y2={Math.min(tier.to, yMax)}
            fill={tier.color}
            fillOpacity={0.08}
            strokeWidth={0}
          />
        ))}
        <XAxis dataKey="index" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} tickLine={false} axisLine={false} />
        <YAxis
          domain={[yMin, yMax]}
          allowDecimals={false}
          tickCount={5}
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
          tickLine={false}
          axisLine={false}
          width={44}
        />
        <Tooltip
          contentStyle={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            fontSize: 12,
          }}
          labelFormatter={(_, payload) => payload?.[0]?.payload?.contestName ?? ''}
          formatter={(value) => [value, 'Rating']}
        />
        <Line
          type="monotone"
          dataKey="rating"
          stroke="var(--signal)"
          strokeWidth={2}
          dot={{ r: 3, fill: 'var(--signal)', strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
