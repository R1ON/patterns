// Идея:
// Внедрить дополнительный слой логики в какой-то код.

// Проблема:
// Скачали библиотеку, функционал которой нужно как-то изменить.
// И тогда придется залезать в исходный код и что-то там править.

// Решение:
// Внедрить прослойку между нашим кодом и этой библиотекой.

// ---

type PaymentDetail = {
    id: number;
    sum: number;
};

type TPaymentAPI = {
    getPaymentDetail: (id: number) => PaymentDetail | undefined;
};

// --- Класс, который мы не можем модифицировать

class PaymentAPI implements TPaymentAPI {
    private data: PaymentDetail[] = [{ id: 1, sum: 100 }];
    public getPaymentDetail = (id: number): PaymentDetail | undefined => {
        return this.data.find((detail) => detail.id === id);
    }
}

// --- Прокси-класс, который модифицирует основной класс

class ProxyPaymentAPI implements TPaymentAPI {
    constructor(private api: PaymentAPI) {}

    public getPaymentDetail = (id: number): PaymentDetail | undefined => {
        if (id === 1) {
            return this.api.getPaymentDetail(id);
        }
        
        console.error('Ошибка авторизации');
    };
}

// --- Пример использования

const api = new PaymentAPI();
const proxy = new ProxyPaymentAPI(api);

proxy.getPaymentDetail(2); // Ошибка авторизации
console.log(proxy.getPaymentDetail(1)); // { id: 1, sum: 100 }

