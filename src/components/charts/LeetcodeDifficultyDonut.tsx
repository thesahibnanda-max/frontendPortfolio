import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

export function LeetcodeDifficultyDonut({
  easy,
  medium,
  hard,
}: {
  easy: number
  medium: number
  hard: number
}) {
  const data = [
    { name: 'Easy', value: easy, color: 'var(--color-difficulty-easy)' },
    { name: 'Medium', value: medium, color: 'var(--color-difficulty-medium)' },
    { name: 'Hard', value: hard, color: 'var(--color-difficulty-hard)' },
  ].filter((d) => d.value > 0)

  const total = easy + medium + hard

  return (
    <div className="relative h-[220px]">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92} paddingAngle={3} strokeWidth={0}>
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              fontSize: 12,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading text-2xl font-semibold">{total}</span>
        <span className="text-xs text-muted-foreground">solved</span>
      </div>
    </div>
  )
}
