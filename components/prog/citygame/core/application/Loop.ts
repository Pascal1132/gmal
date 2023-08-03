
// loop register
export class Loop {
    private static loop: Loop;
    private observers: CallableFunction[] = [];
    public static ticks: number = 0;

    private constructor() {
        this.loop = this.loop.bind(this);
    }

    private loop() {
        requestAnimationFrame(this.loop);
        this.observers.forEach(o => o());
        Loop.ticks++;
    }

    attach(observer: CallableFunction) {
        this.observers.push(observer);
    }

    detach(observer: CallableFunction) {
        this.observers = this.observers.filter(o => o !== observer);
    }

    static getInstance() {
        if (!this.loop) {
            this.loop = new Loop();
        }
        return this.loop;
    }

    start() {
        this.loop();
    }

    stop() {
        this.observers = [];
    }

}