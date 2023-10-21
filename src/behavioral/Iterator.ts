export {};
// Идея:
// Есть какая-то коллекция, по которой нужно итерироваться. При чем логика итерирования
// может быть необычной. Например, не просто пройти от первого до последнего элемента.
// А пройти по элементам, в зависимости от их приоритета.
// Или если у нас древовидная структура данных, то пройтись от верхних элементов к нижним.

// Пример ниже:
// У нас есть какие-то задачи в ToDo листе. У каждой задачи есть приоритет.
// Мы хотим получить задачи отсортированные по приоритету. Вместо того, чтобы как-то изменять
// текущий список, мы создаем новый, сортируем его. А после предоставляем некоторые методы,
// которые позволяют что-то с этим списком сделать.
// Например, достать самую важную задачу или самую первую


// --- Какой-то список задач, у которого мы можем достать определнный итератор
// Данные в нем будут отсортированны, в зависимости от того, с каким итератором работает
// Каждый итератор не зависим друг от друга и работает со своим списком задач

type Task = {
    priority: number;
    text: string;
};

class TodoList {
    private tasks: Task[] = [];

    public addTask = (task: Task) => {
        this.tasks.push(task);
    };

    public getTasks = () => {
        return this.tasks;
    };

    public sortByPriority = () => {
        return [...this.getTasks()].sort((a, b) => a.priority - b.priority);
    };

    public sortByText = () => {
        return [...this.getTasks()].sort((a, b) => a.text.localeCompare(b.text));
    };

    public getPriorityIterator = () => {
        return new IteratorByPriority(this);
    };

    public getTextIterator = () => {
        return new IteratorByText(this);
    };
};

// --- Разные варианты итераторов

type TIterator<T> = {
    current(): T | undefined;
    prev(): T | undefined;
    next(): T | undefined;
    index(): number
};

class IteratorByPriority implements TIterator<Task> {
    private position: number = 0;
    public tasks: Task[] = [];

    constructor(todoList: TodoList) {
        this.tasks = todoList.sortByPriority();
    }

    current = (): Task | undefined => {
        return this.tasks[this.position];
    };

    prev = (): Task | undefined => {
        this.position -= 1;
        return this.tasks[this.position];
    };

    next = (): Task | undefined => {
        this.position += 1;
        return this.tasks[this.position];
    };

    index = (): number => {
        return this.position;
    };
};

class IteratorByText implements TIterator<Task> {
    private position: number = 0;
    public tasks: Task[] = [];

    constructor(todoList: TodoList) {
        this.tasks = todoList.sortByText();
    }

    current = (): Task | undefined => {
        return this.tasks[this.position];
    };

    prev = (): Task | undefined => {
        this.position -= 1;
        return this.tasks[this.position];
    };

    next = (): Task | undefined => {
        this.position += 1;
        return this.tasks[this.position];
    };

    index = (): number => {
        return this.position;
    };
}

// --- Использование:

const todoList = new TodoList();
todoList.addTask({ priority: 5, text: 'b' });
todoList.addTask({ priority: 1, text: 'c' });
todoList.addTask({ priority: 8, text: 'a' });

const getPriorityIterator = todoList.getPriorityIterator();

// { priority: 1, text: 'c' }
console.log(getPriorityIterator.current());


const getTextIterator = todoList.getTextIterator();

// { priority: 8, text: 'a' }
console.log(getTextIterator.current());

// ---


// [{"priority":5,"text":"b"},{"priority":1,"text":"c"},{"priority":8,"text":"a"}]
console.log(JSON.stringify(todoList.getTasks()));

// [{"priority":1,"text":"c"},{"priority":5,"text":"b"},{"priority":8,"text":"a"}]
console.log(JSON.stringify(getPriorityIterator.tasks));

// [{"priority":8,"text":"a"},{"priority":5,"text":"b"},{"priority":1,"text":"c"}]
console.log(JSON.stringify(getTextIterator.tasks));
