import { normalize } from './integer'

export const hexToRgb = (hex) => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b)

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

export const normalizedRgb = (rgb) => {
  return {
    r: normalize(rgb.r, 0, 255),
    g: normalize(rgb.g, 0, 255),
    b: normalize(rgb.b, 0, 255)
  }
}

export const rgbToHex = (rgb) => {
  return "#" + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1)
}

export const rgbFromNormalizedRgb = (rgb) => {
  return { r: rgb.r * 255, g: rgb.g * 255, b: rgb.b * 255 }
}

export const hexFromNormalizedRgb = (rgb) => {
  return rgbToHex(rgbFromNormalizedRgb(rgb))
}

export const hexToNormalizedRgb = (hex) => {
  return normalizedRgb(hexToRgb(hex))
}

export const rgbToArrayRgb = (rgb) => {
  return [rgb.r, rgb.g, rgb.b]
}

export const rgbToArrayRgba = (rgb, alpha = 1) => {
  return [rgb.r, rgb.g, rgb.b, alpha]
}

export const rgbArrayToRgbObj = (arr) => {
  return {r: arr[0], g: arr[1], b: arr[2]}
}