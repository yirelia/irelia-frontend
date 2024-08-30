import { Point } from '../model';
import type { CoordinateSystem as CoordinateSystemType } from '@/views/simulation/model/components/graphics/type';

export default class CoordinateSystem {
  private extent = [new Point(-100, -100), new Point(100, 100)];

  private initialScale = 0.1;

  // 是否保持横宽比
  private preserveAspectRatio = true;

  // ICON 视图转到 diagram 中的缩放比例
  public viewScaleX = 1;

  public viewScaleY = 1;

  // x 轴是否翻转
  public flipX = 1;

  // y轴是否翻转
  public flipY = 1;

  constructor() {}

  public updateCoordinateSystem(coordinateSystem: CoordinateSystemType) {
    if (coordinateSystem.extent) {
      const [extent1x, extent1y] = coordinateSystem.extent[0];
      const [extent2x, extent2y] = coordinateSystem.extent[1];
      this.extent = [
        new Point(extent1x, -extent1y),
        new Point(extent2x, -extent2y)
      ];
    }

    this.setInitialScale(coordinateSystem?.initialScale ?? 0.1);
    this.setPreserveAspectRatio(coordinateSystem?.preserveAspectRatio ?? true);
  }

  public setExtent(extent: Point[]) {
    this.extent = extent;
  }

  public getWidth() {
    const [extent1, extent2] = this.extent;
    return Math.abs(extent2.x - extent1.x);
  }

  public getHeight() {
    const [extent1, extent2] = this.extent;
    return Math.abs(extent2.y - extent1.y);
  }

  /**
   * @description: 设置init scale 处理
   * @param {number} initialScale
   * @return {*}
   */
  public setInitialScale(initialScale: number) {
    this.initialScale = initialScale;
  }

  /**
   * @description: 获取缩放比例
   * @return {*}
   */
  public getInitialScale(): number {
    return this.initialScale;
  }

  public setPreserveAspectRatio(preserveAspectRatio: boolean) {
    this.preserveAspectRatio = preserveAspectRatio;
  }

  public getPreserveAspectRatio() {
    return this.preserveAspectRatio;
  }

  public getViewScaleX() {
    return this.viewScaleX;
  }

  public getViewScaleY() {
    return this.viewScaleY;
  }
  public setViewScaleX(viewScaleX: number) {
    this.viewScaleX = viewScaleX;
  }

  public setViewScaleY(viewScaleY: number) {
    this.viewScaleY = viewScaleY;
  }

  public setFlipX(flipX: number) {
    this.flipX = flipX;
  }

  public setFlipY(flipY: number) {
    this.flipY = flipY;
  }

  public getCenter() {
    const extent = this.extent.map(point => {
      return {
        x: point.x * this.initialScale,
        y: point.y * this.initialScale
      };
    });
    const [p1, p2] = extent;
    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2
    };
  }
}
