export {};
// Идея:
// Упростить агригирование данных, если у нас древовидная структура данных

// Проблема:
// Есть элементы, которые выстроились в древовидную структуру и нужно получить от них
// какую-то информацию. Придется рекурсивно пробегать по всем элементам этого дерева,
// вынося всю эту бизнес логику в какую-то одну функцию

// Решение:
// Чтобы не пихать все это в одну функцию, можно разбить всех участников на определенные сущности.
// Каждая сущность будет реализовать часть логики, чтобы мы поочередно вызывали функцию
// которая будет отдавать часть информации.

// Пример ниже:
// iphone.getPrice() // 500
// nokia.getPrice() // 300
// упаковка1(iphone, nokia).getPrice() // 500 + 300 + 30

// cake.getPrice() // 100
// упаковка2(cake).getPrice() // 100 + 30

// корзина(упаковка1, упаковка2).getPrice() // 830 + 130 + DELIVERY_FEE


// --- Абстрактный класс, от которого должны наследоваться все участники композиции

abstract class DeliveryItem {
    items: DeliveryItem[] = [];

    public abstract getPrice(): number;

    public addItem = (item: DeliveryItem) => {
        this.items.push(item);
    };

    protected getItemPrices = () => {
        return this.items.reduce((acc, item) => acc += item.getPrice(), 0);
    };
};

// ---

class Shop extends DeliveryItem {
    constructor(private deliveryFee: number) {
        super();
    }

    public getPrice = () => {
        return this.getItemPrices() + this.deliveryFee;
    };
};

class Package extends DeliveryItem {
    private packagePrice = 20;

    getPrice = () => {
        return this.getItemPrices() + this.packagePrice;
    };
};

class Product extends DeliveryItem {
    private price: number;

    constructor(data: { price: number }) {
        super();
        this.price = data.price;
    }

    getPrice = () => {
        return this.price;
    };
}

// --- Использование:

// Создали магазин
const DELIVERY_FEE = 500;
const myShop = new Shop(DELIVERY_FEE);

// Создаем упаковки
const phonePack = new Package();
const cakePack = new Package();

// Создаем товары
const iphone = new Product({ price: 500 });
const nokia = new Product({ price: 200 });
const cake = new Product({ price: 100 });

// Упаковываем продукты
phonePack.addItem(iphone);
phonePack.addItem(nokia);
cakePack.addItem(cake);

// Кладем упаковки с товарами в корзину
myShop.addItem(phonePack);
myShop.addItem(cakePack);

// Высчитываем стоимость товара + доставка
console.log(myShop.getPrice()); // 1340