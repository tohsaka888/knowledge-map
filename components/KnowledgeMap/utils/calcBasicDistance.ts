/**
 * 计算延长半径
 * @date 2022-07-14
 * @param {any} nodeNumber:number
 * @returns {any}
 */
export const calcBasicDistence = (nodeNumber: number, deg: number, basicDistence: number): number => {
  return basicDistence + basicDistence * 0.1 * (180 / deg) * nodeNumber;
}