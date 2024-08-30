import BigNumber from 'bignumber.js';
import type { PointTuple } from '../model';
import { Point } from '../model';

BigNumber.config({
  DECIMAL_PLACES: 2
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
  const [x, y] = strPoint.split(',').map(item => toNum(item)) as PointTuple;
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
  // (96 * value) / 25.4
  return BigNumber(96).multipliedBy(value).div(25.4).toNumber();
}

export function getBigNumerIntance(
  config: BigNumber.Config = { DECIMAL_PLACES: 2 }
) {
  return BigNumber.clone(config);
}

export function toRgbColor(color: string) {
  return `rgb(${color})`;
}

/**
 * @description: rgb to Hex
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @return {*}
 */
export function rgb2hex(r: number, g: number, b: number): string {
  const pad = (hex: string) => (hex.length < 2 ? `0${hex}` : hex);
  return `#${pad(r.toString(16))}${pad(g.toString(16))}${pad(b.toString(16))}`;
}

/**
 * @description: 转换颜色为16进制
 * 159,159,223 => #9f9fdf
 * @param {string} color
 * @return {*}
 */
export function toHexColor(color: string): string {
  const [r, g, b] = color.split(',').map(item => toNum(item));
  return rgb2hex(r, g, b);
}
