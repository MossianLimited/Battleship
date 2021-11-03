class Queue<T> {
    private queue: { [key: number]: T };
    private tail: number;
    private head: number;

    constructor() {
        this.queue = {};
        this.tail = 0;
        this.head = 0;
    }

    // Add an element to the end of the queue.
    enqueue(element: T) {
        this.queue[this.tail++] = element;
    }

    // Delete the first element of the queue.
    dequeue() {
        if (this.tail === this.head) return undefined;

        let element = this.queue[this.head];
        delete this.queue[this.head];
        return element;
    }
}

export default Queue;
