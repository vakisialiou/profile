
export const randFloat = (min, max) => {
  return Math.random() * (max - min) + min
}

export const normalize = (value, minValue, maxValue) => {
  return (value - Math.min(minValue, value)) / (Math.max(maxValue, value) - Math.min(minValue, value))
}