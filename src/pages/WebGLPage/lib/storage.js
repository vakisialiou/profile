
export function getStorageKeys() {
  return Object.keys(localStorage)
}

export function getStorageItem(name) {
  return localStorage.getItem(name)
}

export function setStorageItem(name, value) {
  localStorage.setItem(name, value)
}

export function removeStorageItem(name) {
  localStorage.removeItem(name)
}

export function decodeStorageItem(name) {
  try {
    const data = getStorageItem(name)
    return JSON.parse(data)
  } catch (e) {
    console.error(e)
    return null
  }
}

export function encodeStorageItem(name, value) {
  setStorageItem(name, JSON.stringify(value))
}
