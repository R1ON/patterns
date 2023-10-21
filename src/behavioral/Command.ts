export {};
// Идея:
// Есть несколько точек входа в какой-то функционал. Например, нужно добавить товар в корзину.
// Мы его можем добавить через какую-нибудь витрину, через поисковик и что-нибудь еще.
// А потом мы захотели откатить выбранное действие.
// Вместо того, чтобы описывать бизнес логику во всех местах, мы можем описать ее в одном.
// Идея логики будет строиться на том, что мы просто отменим команду, которую ранее выполняли.

// Помимо отмены мы также можем хранить историю выполненных действий.

// --- Какая-то корзина, которая напрямую работает со стором

class Cart {
    addProduct = (productId: number) => {
        console.log(`Продукт с id ${productId} был добавлен`);
    };

    removeProduct = (productId: number) => {
        console.log(`Продукт ${productId} был удален`);
    };
}

// --- Тут мы можем хранить историю комманд, чтобы в любой момент мы ее могли откатить
// Или же посмотреть эту историю

class CartHistory {
    public commands: Command[] = [];

    add = (command: Command) => {
        this.commands.push(command);
    };

    remove = (command: Command) => {
        this.commands = this.commands.filter((value) => value.commandId !== command.commandId);
    };
}

// --- Абстрактная команда, от которой нужно наследоваться

abstract class Command {
    public commandId: number;

    constructor() {
        this.commandId = Math.random();
    }

    abstract execute(): void;
};

// --- Создаем команду, которая добавляет какой-то продукт

class AddProductCommand extends Command {
    constructor(
        private productId: number, // Какой-то пэйлоад, который мы хотим отправить в корзину
        private receiver: Cart, // Тут сама корзина
        public history: CartHistory,
    ) {
        super();
    }

    execute = () => {
        this.receiver.addProduct(this.productId);
        this.history.add(this);
        console.log('Команда добавлена');
    };

    undo = () => {
        this.receiver.removeProduct(this.productId);
        this.history.remove(this);
        console.log('Команда удалена');
    };
};

// --- Пример использования:

const cart = new Cart();
const cartHistory = new CartHistory();

const addProduct = new AddProductCommand(1, cart, cartHistory); // Продукт с id 1 был добавлен
addProduct.execute(); // Команда добавлена

console.log(addProduct.history); // CartHistory{ commands: [AddProductCommand] }

addProduct.undo(); // Продукт 1 был удален
// Команда удалена

console.log(addProduct.history); // CartHistory{ commands: [] }
