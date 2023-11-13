import type ShapeAnnotation from "../annotations/shape-annotation";
import { ViewType } from "../enums";
import type { Component } from "./component";

export class Transformation {
  public width = 200;
  public height = 200;

  public originDiagram = {
    x: 0,
    y: 0,
  };
  public hasOriginDiagram = false;
  public hasOriginDiagramY = false;

  public component: Component | undefined;

  // 图形自己的旋转角度
  public shapeRotation = 0;

  // 图形隶属组件的旋转角度
  public componentRotation = 0;

  public componentOriginDiagram = {
    x: 0,
    y: 0,
  };

  public rawShape: ShapeAnnotation;

  // 默认为视图层
  public viewType = ViewType.View;

  public transfrom = new Transform();

  constructor(shape: ShapeAnnotation, component?: Component) {
    this.rawShape = shape;
    this.shapeRotation = this.rawShape.rotation;
    if (component) {
      this.component = component;
      this.width = this.component.componentInfo.width;
      this.height = this.component.componentInfo.height;
      this.viewType = this.component.componentType;
    }
  }

  /**
   * @description:
   * @return {*}
   */
  public getTransformationMatrix() {
    switch (this.viewType) {
      case ViewType.View:
        return this.getViewDiagramTransformationMatrix();
      case ViewType.Diagram:
        return this.getDiagramTransformationMatrix();
      default:
        return this.getIconTransformationMatrix();
    }
  }

  /**
   * @description: 获取视图中diagram 背景注释变换
   *
   * @return {*}
   */
  public getViewDiagramTransformationMatrix(): string {
    // TODO 添加新的变换信息，暂时没有遇到具体的变换信息
    return this.transfrom.toString();
  }

  /**
   * @description: 获取视图组件的缩放处理
   * @return {*}
   */
  public getDiagramTransformationMatrix() {
    // 处理逻辑为先旋转 // 移动 // 缩放
    const transform = new Transform();
    const componentInfo = this.component!.componentInfo;
    const coordinateSystem = this.component!.coordinateSystem;
    const componentRotation = componentInfo.rotation;
    const componentCenter = coordinateSystem.getCenter();
    const flipx = coordinateSystem.flipX;
    const flipy = coordinateSystem.flipY;
    const scaleOriginX = componentCenter.x;
    const scaleOriginY = componentCenter.y;
    transform.rotate(componentRotation, componentCenter.x, componentCenter.y);
    transform.scale(flipx, flipy, scaleOriginX, scaleOriginY);
    if (this.rawShape.hasOriginPoint()) {
      const shapeOriginPoint = this.rawShape.getViewOriginPoint();
      transform.rotate(
        this.shapeRotation,
        shapeOriginPoint.x,
        shapeOriginPoint.y
      );
    } else {
      transform.rotate(
        this.shapeRotation,
        componentCenter.x,
        componentCenter.y
      );
    }

    return transform.toString();
  }

  /**
   * @description: 获取输入输出图形的变换
   * @return {*}
   */
  public getIconTransformationMatrix() {
    const transform = new Transform();
    const componentInfo = this.component!.componentInfo;
    const coordinateSystem = this.component!.coordinateSystem;
    const parentCoordinateSystem =
      this.component!.parentComponent!.coordinateSystem;
    const { sx, sy, rotation } = this.reComputedIconFlip(
      parentCoordinateSystem.flipX,
      parentCoordinateSystem.flipY,
      coordinateSystem.flipX,
      coordinateSystem.flipY,
      componentInfo.rotation
    );
    // 组件的自身旋转
    transform.rotate(
      rotation,
      coordinateSystem.getCenter().x,
      coordinateSystem.getCenter().y
    );
    transform.scale(sx, sy);
    return transform.toString();
  }

  /**
   * @description: 根据root 组件 翻转场景 重新计算icon 组件的翻转&& 旋转角度
   * TODO  此处为枚举处理，后续是否有优化方案？？？
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

  public scale(
    sx: number,
    sy: number,
    originX?: number,
    originY?: number
  ): Transform {
    if (originX != undefined && originY != undefined) {
      this.transform.push(`translate(${originX},${originY})`);
      this.transform.push(`scale(${sx},${sy})`);
      this.transform.push(`translate(${-originX},${-originY})`);
    } else {
      this.transform.push(`scale(${sx},${sy})`);
    }
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
