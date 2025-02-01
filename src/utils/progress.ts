export const calculateProgress = (current: number, total: number) => {
  const safeTotal = total > 0 ? total : 1
  const percentage = Math.round((current * 100) / safeTotal)

  return Math.min(percentage, 100)
}
