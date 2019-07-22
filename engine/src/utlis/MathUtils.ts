module Anuto {

    // http://www.jeffreythompson.org/collision-detection/line-circle.php

    export class MathUtils {

        public static fixNumber(n: number): number {
            
            return isNaN(n) ? 0 : Math.round(1e5 * n) / 1e5;
        }

        public static isLineSegmentIntersectingCircle(p1: {x: number, y: number}, p2: {x: number, y: number}, c: {x: number, y: number}, r: number): boolean {

            const inside1 = MathUtils.isPointInsideCircle(p1.x, p1.y, c.x, c.y, r);

            if (inside1) {
                return true;
            }

            const inside2 = MathUtils.isPointInsideCircle(p2.x, p2.y, c.x, c.y, r);

            if (inside2) {
                return true;
            }

            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const len = MathUtils.fixNumber(Math.sqrt(dx * dx + dy * dy));
            const dot = ((c.x - p1.x) * (p2.x - p1.x) + (c.y - p1.y) * (p2.y - p1.y)) / (len * len);
            const closestX = p1.x + (dot * (p2.x - p1.x));
            const closestY = p1.y + (dot * (p2.y - p1.y));

            const onSegment = MathUtils.isPointInLineSegment(p1.x, p1.y, p2.x, p2.y, closestX, closestY);

            if (!onSegment) {
                return false;
            }

            const distX = closestX - c.x;
            const distY = closestY - c.y;
            const distance = MathUtils.fixNumber(Math.sqrt((distX * distX) + (distY * distY)));

            if (distance <= r) {
                return true;
            } else {
                return false;
            }
        }

        public static isPointInLineSegment(x1: number, y1: number, x2: number, y2: number, px: number, py: number): boolean {

            const d1 = MathUtils.fixNumber(Math.sqrt( (px - x1) * (px - x1) + (py - y1) * (py - y1)));
            const d2 = MathUtils.fixNumber(Math.sqrt( (px - x2) * (px - x2) + (py - y2) * (py - y2)));
            const lineLen = MathUtils.fixNumber(Math.sqrt( (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)));
            const buffer = .1;  

            if (d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer) {
                return true;
            } else {
                return false;
            }
        }

        public static isPointInsideCircle(x: number, y: number, cx: number, cy: number, r: number): boolean {

            const dx = cx - x;
            const dy = cy - y;
            const d = MathUtils.fixNumber(Math.sqrt(dx * dx + dy * dy));

            if (d <= r){
                return true;
            } else {
                return false;
            }
        }
    }
}
