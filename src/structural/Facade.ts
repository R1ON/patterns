// Идея:
// Позволяет скрыть всю внутреннюю реализацию за простым API

// Проблема:
// Нужно сохранить что-то в бд, а после залогировать это и сохранить в какой-то стейт
// Это могло бы выглядеть так:
// function saveToDB() {
//    DB.saveSomeData();
//    Logger.logInfo();
//    State.setState();
// }
// И так бы пришлось делать каждый раз, когда нам нужно что-то сохранить в базе

// Решение:
// Скрываем всю логику, перемещая ее в один метод класса
// function saveToDB() {
//    Facade.saveToDB();
// }

class DataBase {
    saveSomeData(data: string) {
        console.log('Сохраняю в базу данных', data);
    }
};

class Logger {
    logInfo(data: string) {
        console.log('Логгирование для: ', data);
    }
};

class State {
    private data: string | null = null;
    setState(data: string) {
        console.log('Сохраняем в локальный стейт', data);
        this.data = data;
    }
}

class Facade {
    private db: DataBase;
    private logger: Logger;
    private state: State;

    constructor() {
        this.db = new DataBase();
        this.logger = new Logger();
        this.state = new State();
    }

    saveToDB(data: string | null) {
        if (!data) {
            return this.logger.logInfo('Значение не указано!');
        }

        this.db.saveSomeData(data);
        this.logger.logInfo(data);
        this.state.setState(data);
    }
}

const facadeInstance = new Facade();

// Логгирование для:  Значение не указано!
facadeInstance.saveToDB('');

// Логгирование для:  Значение не указано!
facadeInstance.saveToDB(null);

// Сохраняю в базу данных Alex
// Логгирование для:  Alex
// Сохраняем в локальный стейт Alex
facadeInstance.saveToDB('Alex');

