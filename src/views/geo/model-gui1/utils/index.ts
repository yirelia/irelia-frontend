import BigNumber from "bignumber.js";
import type { PointTuple } from "../model";
import { Point } from "../model";

BigNumber.config({
  DECIMAL_PLACES: 2,
});

/**
 * @description: 字符串转为坐标对象
 * @param {string} strPoint
 * @param {*} sx
 * @param {*} sy
 * @return {*}
 */
export function toPoint(
  strPoint: string,
  sx: number = 1,
  sy: number = 1
): Point {
  const [x, y] = strPoint.split(",").map((item) => toNum(item)) as PointTuple;
  const ponintX = new BigNumber(x).multipliedBy(sx).toNumber();
  // y 轴坐标转换
  const poninty = new BigNumber(-y).multipliedBy(sy).toNumber();
  return new Point(ponintX, poninty);
}

/**
 * @description: 转换为number 数字
 * @param {string} num
 * @return {*}
 */
export function toNum(num: string | number): number {
  const converNum = new BigNumber(num).toNumber();
  return Number.isNaN(converNum) ? 0 : converNum;
}

/**
 * @description: 转换角度
 * @param {number} angle
 * @return {*}
 */
export function getNormalizedAngle(angle: number): number {
  const multiplier = Math.abs(angle) / 360;
  let normalizedAngle = angle;
  if (angle < 0) {
    normalizedAngle = angle + Math.ceil(multiplier) * 360;
  } else {
    normalizedAngle = angle - Math.floor(multiplier) * 360;
  }
  return normalizedAngle;
}

export function convertMMToPixel(value: number) {
  return (96 * value) / 25.4;
}

export function getBigNumerIntance(
  config: BigNumber.Config = { DECIMAL_PLACES: 2 }
) {
  return BigNumber.clone(config);
}

export function toRgbColor(color: string) {
  return `rgb(${color})`;
}
