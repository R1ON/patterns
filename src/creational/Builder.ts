export {};
// Идея:
// Класс, который собирает данные, а потом формирует из них что-то другое.
// То есть мы создаем какое-то временное хранилище, куда накидываем разные данные.
// Как только мы закончили туда что-то накидывать,
// мы можем вызвать метод .build() который пробежится по всем данным и
// что-то с ними сделает (например, переконвертирует в новую структуру)

// ---

enum CreditType {
    AUTO = 'autocredit',
    USUAL = 'credit',
};

enum Bank {
    Vtb = 'vtb',
    Sber = 'sber',
};

type BankCredit = {
    bank: Bank;
    type: CreditType;
};

class CreditBuilder {
    private banks: Bank[] = [];
    private creditTypes: CreditType[] = [];

    addVtbBank = () => {
        this.banks.push(Bank.Vtb);
        return this;
    };

    addSberBank = () => {
        this.banks.push(Bank.Sber);
        return this;
    };

    addAutoCredit = () => {
        this.creditTypes.push(CreditType.AUTO);
        return this;
    };

    addUsualCredit = () => {
        this.creditTypes.push(CreditType.USUAL);
        return this;
    };

    build = (): BankCredit[] => {
        let result: BankCredit[] = [];

        this.banks.forEach((bank) => {
            this.creditTypes.forEach((type) => {
                result.push({ bank, type });
            });
        });

        return result;
    };
}

// --- Пример использования

const builder = new CreditBuilder();

const result = builder
    .addAutoCredit()
    .addUsualCredit()
    .addSberBank()
    .addVtbBank()
    .build()

console.log(result);
//
// [
//   { bank: 'sber', type: 'autocredit' },
//   { bank: 'sber', type: 'credit' },
//   { bank: 'vtb', type: 'autocredit' },
//   { bank: 'vtb', type: 'credit' }
// ]