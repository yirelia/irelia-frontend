export abstract class Command {
    constructor() { }
    abstract execute(): void;
    abstract undo(): void;
    abstract redo(): void;
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

export class AddCommand extends Command {
    execute(): void {
        console.log('Add command executed');
    }
    undo(): void {
        console.log('Add command undo');
    }
    redo(): void {
        console.log('Add command redo');
    }
}

export class History {
    protected redoStack: Command[] = []
    protected undoStack: Command[] = []
    push(command: Command) {
        this.undoStack.push(command);
    }

    execute(revert: boolean = false) {
        if (revert) {
            this.redoStack.shift()?.redo();
        } else {
            const command = this.undoStack.pop()
            if (command) {
                command?.undo();
                this.redoStack.unshift(command);
            }
        }
    }
}