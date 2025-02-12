import { Cell, EdgeView } from '@antv/x6/es';
import { Point } from './geometry/point';

export const archOrth = () => {}


const getSide = (source:Cell) => {
    const parent = source.getParent()
    if (parent) {
        const parentBBox = parent.getBBox()
        const sourceBBox = source.getBBox()
        if (sourceBBox.x < parentBBox.x) {
            return 'left'
        }
        if (sourceBBox.x >= parentBBox.x + parentBBox.width) {
            return 'right'
        }
        if (sourceBBox.y < parentBBox.y) {
            return 'top'
        }
        if (sourceBBox.y >= parentBBox.y + parentBBox.height) {
            return 'bottom'
        }
    }
    // default side
    return 'left'
}

function isVerticalSide(side: Side): boolean{
    return side == "top" || side == "bottom";
}


export const orthRouter = (vertices: Point.PointLike[],
    options,
    edgeView: EdgeView) => {

    const sourceBBox = edgeView.sourceBBox
    const targetBBox = edgeView.targetBBox
    const sourceSide = getSide(edgeView.sourceView!.cell)
    const targetSide = getSide(edgeView.targetView!.cell)
    // 获取
    const sideSourceVertical = isVerticalSide(sourceSide)
    const sidetargetVertical = isVerticalSide(targetSide)
    // const 


    return []
}