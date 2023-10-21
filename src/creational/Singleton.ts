export {};
// Идея:
// Какое-то глобальное хранилище, у которого всегда один инстанс (аналог Redux'a)

// ---

class Singleton {
    private static instance: Singleton;

    someData: Set<string> = new Set();

    // Чтоб никто случайно не написал new Singleton()
    private constructor() {}

    public clear = () => {
        this.someData.clear();
        console.log('Данные были успешно очищены');
    }

    public static get = (): Singleton => {
        if (!Singleton.instance) {
            Singleton.instance = new Singleton();
        }

        return Singleton.instance;
    }
}

// --- Примеры использования

const instance1 = Singleton.get();
instance1.someData.add('1');

console.log(instance1.someData); // Set {1}

const instance2 = Singleton.get();
instance1.someData.add('2');

console.log(instance2.someData); // Set {1,2}

instance2.clear(); // Данные были успешно очищены

console.log(instance1.someData); // Set {}
console.log(instance2.someData); // Set {}
