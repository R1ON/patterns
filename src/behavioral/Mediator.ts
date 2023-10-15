// Идея:
// Есть разные классы, которые хотят пользоваться логикой друг друга.
// И чтобы избавиться от связанности между ними мы можем внедрить посредника,
// который будет все эти проблемы решать

// Проблема:
// Пример классов, которые хотят друг на друга хотят ссылаться
// И нам эту связанность нужно убрать

// class CustomLogger {
//     log = (message: string) => {
//         // Тут я хочу использовать Validator,
//         // чтобы проверить сообщение на отсутствие спец. символов
//         console.log('CustomLogger:', message);
//     };
// };

// class Validator {
//     validateSomeData = (data: string) => {
//         // ...тут делаем какие-то проверки этой data
//         // если были какие-то ошибки,
//         // то я хочу использовать CustomLogger, чтобы отобразить эту ошибку
//         return true;
//     };
// };

// class Store {
//     private data: string[] = [];
//     saveData = (value: string) => {
//         // тут я очень хочу использовать CustomLogger,
//         // чтобы сообщить, что я сохранил данные без проблем

//         // Но перед тем как сохранить, я также хочу использовать Validator, чтобы их проверить
//         this.data.push(value);
//     };
// };

// --- Абстракция, для создания будущего посредника
// Те, кто хочет иметь доступ к другим классам должны наследоваться от Mediator
// И вызывать notify метод, чтобы передать управление посреднику

type TMediator = {
    notify(event: string, data?: string): boolean | undefined;
};

abstract class AbstractMediator {
    private mediator: TMediator | null = null;

    setMediator = (value: TMediator) => {
        this.mediator = value;
    };

    getMediator = (): TMediator => {
        if (!this.mediator) {
            throw new Error('Посредник не установлен');
        }
        return this.mediator;
    };
}

// --- Итоговая реализация классов

class CustomLogger extends AbstractMediator {
    log = (message: string) => {
        const hasSpecialChars = this.getMediator().notify('log', message);

        if (hasSpecialChars) {
            console.log('Сообщение содержит спец. символы');
        }
        else {
            console.log(message);
        }
    };
};

class Validator extends AbstractMediator {
    validateSomeData = (data: string) => {
        if (data === 'Alex') {
            return true;
        }

        this.getMediator().notify('validator');
        return false;
    };

    validateChars = (data: string) => {
        return data.includes('@'); // Проверяем на какие-нибудь спец. символы
    };
};

class Store extends AbstractMediator {
    private data: string[] = [];
    saveData = (value: string) => {
        const isOk = this.getMediator().notify('storeSaveData', value);

        if (isOk) {
            this.data.push(value);
        }
    };
};

// --- Реализация самого посредника

class Mediator implements TMediator {
    constructor(
        private store: Store,
        private logger: CustomLogger,
        private validator: Validator,
    ) {}

    notify = (event: string, data: string) => {
        switch (event) {
            case 'log': {
                const hasSpecialChars = this.validator.validateChars(data);
                return hasSpecialChars;
            };

            case 'validator': {
                this.logger.log('Валидация не прошла');
                break;
            };

            case 'storeSaveData': {
                const isOk = this.validator.validateSomeData(data);

                if (isOk) {
                    this.logger.log('Данные успешно сохранены');
                    return true;
                }
                
                this.logger.log('В данных есть какие-то проблемы');
                return false;
            };
        }
    };
};

// --- Использование:

const store = new Store();
const myLogger = new CustomLogger();
const validator = new Validator();


const mediator = new Mediator(
    store,
    myLogger,
    validator,
);

store.setMediator(mediator);
myLogger.setMediator(mediator);
validator.setMediator(mediator);

// --- Сохраняем данные в стор. С этого момента будет запущен посредник.

// Store: данные успешно сохранены
store.saveData('Alex');

// Validator: Валидация не прошла
// Store: В данных есть какие-то проблемы
store.saveData('@Elena');
