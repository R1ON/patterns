// Идея:
// Адаптируем неподходящий объект/библиотеку к нашему коду

// Проблема:
// Есть класс, который сохраняет данные в БД. Нам понадобилось внедрить новую либу,
// которая работает с базой. И теперь нам придется переписать класс, чтобы научить его
// работать с этой новой либой.

// Решение:
// Расширить наш класс, чтобы мы точно также вызывали методы, которые вызывали ранее.
// Но теперь они будут идти не на прямую, а через новую либу

// --- Основной класс, который работает с БД

class MongoDB {
    private db: Map<string, string> = new Map();

    save = (key: string, value: string) => {
        console.log('Добавили значение в Mongo');
        this.db.set(key, value);
    };
}

// --- Новая либа, которая как-то меняет логику работы с mongo

class NewDB {
    saveToAllDB = (key: string, value: string) => {
        // some logic...
        console.log('Сохранили данные во все БД', { [key]: value });
    };
}

// --- Класс адаптер

class NewDBAdapter extends MongoDB {
    constructor(private newDB: NewDB) {
        super();
    }

    override save = (key: string, value: string) => {
        console.log('Сохранили через адаптер');
        this.newDB.saveToAllDB(key, value);
    };
}

// --- Пример использования

// Функция, которая умеет работать только с mongo классом
function run(mongo: MongoDB) {
    mongo.save('name', 'Alex');
}

// И чтобы вот тут не переписывать, мы можем использовать тут адаптер
run(new MongoDB()); // Добавили значение в Mongo


run(new NewDBAdapter(new NewDB()));
// Сохранили через адаптер
// Сохранили данные во все БД { name: 'Alex' }
