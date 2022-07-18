export const calcArcX = (r: number, angle: number) => {
  return r * Math.cos(angle * Math.PI / 180) - r;
}

export const calcArcY = (r: number, angle: number) => {
  return r * Math.sin(angle * Math.PI / 180);
}