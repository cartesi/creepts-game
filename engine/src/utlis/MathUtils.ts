module Anuto {

    export class MathUtils {

        public static fixNumber(n: number): number {
            
            return isNaN(n) ? 0 : Math.round(1e5 * n) / 1e5;
        }
    }
}
