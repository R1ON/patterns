export {};
// Идея:
// Есть какие-то элементы, которые хотят получать свежие данные. И есть сервис, который
// эти данные предоставляет. И чтобы элементы каждые N секунд не дергали этот сервис
// можно сделать так, чтобы они подписались на него. И как только сервис будет готов,
// он сообщит своим подписчикам, что у него появились новые данные и отправит им их.

// --- Реализуем типы для наблюдателя и отправителя

type TObserver = {
    update(data: { name: string }): void;
};

type TSubject = {
    subscribe(observer: TObserver): void;
    unSubscribe(observer: TObserver): void;
    notify(data: { name: string }): void;
};

// --- Основной класс, за которым будут наблюдать и который будет уведомлять своих подписчиков
// что у него появились новые данные

class Bank implements TSubject {
    public observers: TObserver[] = [];

    subscribe = (observer: TObserver): void => {
        if (this.observers.includes(observer)) {
            console.log('Вы уже наблюдаете за этим объектом');
            return;
        }

        this.observers.push(observer);
    };

    unSubscribe = (observer: TObserver): void => {
        const index = this.observers.indexOf(observer);

        if (index === -1) {
            console.log('Вы уже отписаны');
            return;
        }

        this.observers.splice(index, 1);
    };

    notify = (data: { name: string }): void => {
        for (const observer of this.observers) {
            observer.update(data);
        }
    };  
}

// --- Реализуем наблюдателей

class PopupElement implements TObserver {
    update = (data: { name: string; }) => {
        // отрисовываем данные, которые мы получили
        console.log('PopupElement получил данные', data);
    };
}

class Store implements TObserver {
    update = (data: { name: string; }) => {
        // отрисовываем данные, которые мы получили
        console.log('Store получил данные', data);
    };
}

// --- Использование:

const bankSubject = new Bank();

const store = new Store();
const popup = new PopupElement();


bankSubject.unSubscribe(store); // Вы уже отписаны
bankSubject.subscribe(store);
bankSubject.subscribe(popup);
bankSubject.subscribe(popup); // Вы уже наблюдаете за этим объектом


// Store получил данные { name: 'VTB' }
// PopupElement получил данные { name: 'VTB' }
bankSubject.notify({ name: 'VTB' });

// Store получил данные { name: 'Sber' }
// PopupElement получил данные { name: 'Sber' }
bankSubject.notify({ name: 'Sber' });