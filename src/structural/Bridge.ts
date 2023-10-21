export {};
// Идея:
// Уменьшить количество комбинаций для классов

// Проблема:
// Нам нужно сделать рассылку сообщений: телега, вотсапп, вк
// Для этого мы сделали 3 разных класса. Потом понадобилось делать отложенные сообщения
// Либо добавляем эту логику в текущие классы и у нас они разрастаются
// Либо делаем еще 3 класса и по итогу их будет 6

// Решение:
// Создать управляющий класс, который через интерфейс будет взаимодействовать с месседжерами. 

// --- Тип, под который должны подстраиваться мессенджеры и управляющие классы

type Provider = {
    sendMessage(message: string): void;
    connect(config: string): void;
    disconnect(): void;
};

// --- Классы мессенжеров

class Telegram implements Provider {
    sendMessage(message: string): void {
        console.log(`Telegram message: ${message}`);
    }

    connect(config: string): void {
        console.log('Telegram connected', config);
    }

    disconnect(): void {
        console.log('Telegram disconnected');
    }
};

class Vk implements Provider {
    sendMessage(message: string): void {
        console.log(`Vk message: ${message}`);
    }

    connect(config: string): void {
        console.log('Vk connected', config);
    }

    disconnect(): void {
        console.log('Vk disconnected');
    }
};

// --- Управляющие классы

class MessengerDataSender {
    constructor(
        protected provider: Provider,
    ) {}

    send() {
        this.provider.connect('connect');
        this.provider.sendMessage('test');
        this.provider.disconnect();
    }
};

class DelayDataSender extends MessengerDataSender {
    constructor(provider: Provider) {
        super(provider);
    }

    sendDelayed() {
        console.time();
        setTimeout(() => {
            this.provider.connect('connect');
            this.provider.sendMessage('test');
            this.provider.disconnect();
            console.timeEnd();
        }, 1000);   
    }
};

// --- Использование

const telegramSender = new MessengerDataSender(new Telegram());
// Telegram connected connect
// Telegram message: test
// Telegram disconnected
telegramSender.send();

const vkSender = new MessengerDataSender(new Vk());
// Vk connected connect
// Vk message: test
// Vk disconnected
vkSender.send();


const vkWithDelaySender = new DelayDataSender(new Vk());
// Vk connected connect
// Vk message: test
// Vk disconnected
// default: 2.008s - Задержка в 2 секунды
vkWithDelaySender.sendDelayed();
