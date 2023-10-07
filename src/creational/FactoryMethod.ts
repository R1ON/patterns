// Идея:
// Создать общий класс, который по какому-то типу будет возвращать другой класс.
// 

// TODO: нужно покопаться, нафига нужен этот паттерн
// Почему я не могу использовать просто константу DATA_BASES['mongo']???


// --- Тип, под который должны подстраиваться фабричные классы

abstract class Credit {
    protected price: number = 0;
    abstract addMoney(value: number): void;
    abstract getCredit(value: number): void;
};

// --- Реализуем классы, которые должны соответствовать типу выше

class SberCredit extends Credit {
    getCredit = (value: number) => {
        // fetch('SBER_credit');
        console.log('Вам одобрен кредит в Сбер');
        this.price = value;
    };

    addMoney = (value: number) => {
        console.log('Вы внесли платеж по кредиту в Сбер');
        this.price -= value;
    }
}

class VtbCredit extends Credit {
    getCredit = (value: number) => {
        // fetch('VTB_credit')
        console.log('Вам одобрен кредит в ВТБ');
        this.price = value;
    };

    addMoney = (value: number) => {
        console.log('Вы внесли платеж по кредиту в VTB');
        this.price -= value;
    };
}

// --- Создаем фабрику из классов

const CREDIT_ORGANIZATION = {
    vtb: VtbCredit,
    sber: SberCredit,
};

type TCredit = typeof CREDIT_ORGANIZATION;

class CreditFactory {
    static getCredit = <T extends keyof TCredit>(
        type: T,
    ): TCredit[T]['prototype'] => {
        // we can write some speal logic here
        return new CREDIT_ORGANIZATION[type];
    };
}

// --- Примеры использования

const vtb = CreditFactory.getCredit('vtb');
const sber = CreditFactory.getCredit('sber');

vtb.getCredit(1000); // Вам одобрен кредит в ВТБ
sber.getCredit(10000); // Вам одобрен кредит в Cбер


vtb.addMoney(500); // Вы внесли платеж по кредиту в ВТБ
sber.addMoney(500); // Вы внесли платеж по кредиту в Сбер
