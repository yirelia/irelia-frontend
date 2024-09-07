export abstract class Command {
    constructor() { }
    abstract execute(): void;
    abstract undo(): void;
    abstract redo(): void;
}

export class OpenCommand extends Command {

    constructor() {
        super()
    }
    execute(): void {
        console.log('Open command executed');
    }
    undo(): void {
        console.log('Open command undo');
    }

    redo(): void {
        console.log('Open command redo');
    }
}

export class SaveCommand extends Command {
    execute(): void {
        console.log('Save command executed');
    }
    undo(): void {
        console.log('Save command undo');
    }
    redo(): void {
        console.log('Save command redo');
    }
}

export class History {
    private commands: Command[] = [];

    push(command: Command) {
        this.commands.push(command);
    }

    pop() {
        return this.commands.pop();
    }
}