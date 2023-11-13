import type ShapeAnnotation from "../annotations/shape-annotation";
import { ViewType } from "../enums";
import type { Component } from "./component";

export class Transformation {
  // 图表视图的实际宽 默认为 200
  public realWidth = 200;
  // 图表视图的实际高 默认为 200
  public realHeight = 200;

  public shape: ShapeAnnotation;

  public component: Component;

  constructor(shape: ShapeAnnotation, component: Component) {
    this.shape = shape;
    if (component.width) {
      this.realWidth = component.width;
    }
    if (component.height) {
      this.realHeight = component.height;
    }

    this.component = component;
  }

  public getTransformationMatrix() {
    if (this.component.componentType === ViewType.Diagram) {
      return this.getDiagramTransformationMatrix();
    }
    return this.getIconTransformationMatrix();
  }

  /**
   * @description: 获取视图组件的缩放处理
   * @return {*}
   */
  public getDiagramTransformationMatrix() {
    // 处理逻辑为先旋转 // 移动 // 缩放
    const transform = new Transform();
    const rotation = this.component.rotation;
    const { x: cx, y: cy } = this.component.center;
    const { x: tx, y: ty } = this.component.originDiagram;
    const sx = this.component.coOrdinateSystem.flipX;
    const sy = this.component.coOrdinateSystem.flipY;
    const psx = this.component.coOrdinateSystem.getViewScaleX();
    const psy = this.component.coOrdinateSystem.getViewScaleY();
    const { x: stx, y: sty } = this.shape.originalPoint;

    const diagramTx = tx + cx;
    const diagramTy = ty + cy;
    const backTx = sx * diagramTx;
    const backTy = sy * diagramTy;
    transform.rotate(rotation, diagramTx, diagramTy);
    // transform.rotate(this.shape.rotation, diagramTx, diagramTy);
    transform.rotate(this.shape.rotation, stx, sty);
    transform.translate(-backTx, -backTy);
    transform.scale(sx, sy);
    transform.translate(backTx, backTy);
    return transform.toString();
  }

  /**
   * @description: 获取输入输出图形的变换
   * @return {*}
   */
  public getIconTransformationMatrix() {
    const transform = new Transform();
    let iconRotation = this.component.rotation;
    const { x: cx, y: cy } = this.component.center;
    const { x: tx, y: ty } = this.component.originDiagram;
    const pRotation = this.component.parent.rotation;
    const { x: px, y: py } = this.component.parent.center;
    const { x: ptx, y: pty } = this.component.parent.originDiagram;
    const pSx = this.component.parent.coOrdinateSystem.getViewScaleX();
    const pSy = this.component.parent.coOrdinateSystem.getViewScaleY();
    // const preserveAspectRatio = this.component.coOrdinateSystem.getPreserveAspectRatio()
    const parentFlipX = this.component.parent.coOrdinateSystem.flipX;
    const parentFlipY = this.component.parent.coOrdinateSystem.flipY;
    const pCx = px + ptx;
    const pCy = py + pty;

    const iconCx = (cx + tx) * pSx * parentFlipX + pCx;
    const iconCy = (cy + ty) * pSy * parentFlipY + pCy;
    // get inputoupt scale

    let sx = this.component.coOrdinateSystem.flipX;
    let sy = this.component.coOrdinateSystem.flipY;

    const backTx = sx * iconCx;
    const backTy = sy * iconCy;
    const {
      sx: rsx,
      sy: rsy,
      rotation,
    } = this.reComputedIconFlip(parentFlipX, parentFlipY, sx, sy, iconRotation);
    sx = rsx;
    sy = rsy;
    iconRotation = rotation;

    transform.rotate(pRotation, pCx, pCy);
    transform.rotate(iconRotation, iconCx, iconCy);
    transform.translate(-backTx, -backTy);
    transform.scale(sx, sy);
    transform.translate(backTx, backTy);
    return transform.toString();
  }

  /**
   * @description: 根据root 组件 翻转场景 重新计算icon 组件的翻转&& 旋转角度
   * @param {number} rootScaleX
   * @param {number} rootScaleY
   * @param {number} iconScaleX
   * @param {number} iconScaleY
   * @param {number} rotation
   * @return {*}
   */
  private reComputedIconFlip(
    rootScaleX: number,
    rootScaleY: number,
    iconScaleX: number,
    iconScaleY: number,
    rotation: number
  ) {
    // root 不翻转
    if (rootScaleX > 0 && rootScaleY > 0) {
      return {
        sx: iconScaleX,
        sy: iconScaleY,
        rotation,
      };
      // root 组件 垂直翻转
    } else if (rootScaleX > 0 && rootScaleY < 0) {
      if (iconScaleX < 0 && iconScaleY > 0) {
        iconScaleX = -iconScaleX;
      } else {
        rotation = -rotation;
      }
      return {
        sx: iconScaleX,
        sy: iconScaleY,
        rotation,
      };
      // root 组件 水平翻转
    } else if (rootScaleX < 0 && rootScaleY > 0) {
      if (iconScaleX < 0 && iconScaleY > 0) {
        iconScaleX = -iconScaleX;
      } else {
        rotation = -rotation;
      }
      return {
        sx: iconScaleX,
        sy: iconScaleY,
        rotation,
      };
      // root 组件水平垂直翻转
    } else {
      return {
        sx: iconScaleX,
        sy: iconScaleY,
        rotation,
      };
    }
  }
}

export class Transform {
  private transform: string[] = [];

  constructor() {}

  public scale(sx: number, sy: number): Transform {
    this.transform.push(`scale(${sx},${sy})`);
    return this;
  }

  public rotate(angle: number, originX?: number, originY?: number) {
    if (originX !== undefined && originY !== undefined) {
      this.transform.push(`rotate(${angle}, ${originX}, ${originY})`);
    } else {
      this.transform.push(`rotate(${angle})`);
    }
    return this;
  }

  public translate(tx: number, ty: number) {
    this.transform.push(`translate(${tx},${ty})`);
    return this;
  }

  public toString() {
    return this.transform.join(" ");
  }
}
