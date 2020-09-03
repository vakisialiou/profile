
export const loadImages = async (urls) => {
  const images = []
  for (const url of urls) {
    const image = await loadImage(url)
    images.push(image)
  }
  return images
}

export const loadImage = (url) => {
  return new Promise((resolve) => {
    const image = new Image()
    image.src = url
    image.onload = () => {
      resolve(image)
    }
  })
}