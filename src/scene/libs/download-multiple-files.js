const elements = document.body.querySelectorAll('.download_img img');
const arr = Array.from(elements)
let i = 0;
for (const element of arr) {
  i++;
  const link = document.createElement('a');
  document.body.appendChild(link);
  console.log(element.currentSrc);
  link.href = element.currentSrc;
  link.download = `texture-${i}.jpg`;
  link.click();
  link.remove();
}