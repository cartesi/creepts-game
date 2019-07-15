export class AnutoCoreEngine {

    public static ticksCounter: number;

    public static init(): void {
        
        AnutoCoreEngine.ticksCounter = 0;
    }

    public static update(): void {
        
        AnutoCoreEngine.ticksCounter ++;
    }
}
