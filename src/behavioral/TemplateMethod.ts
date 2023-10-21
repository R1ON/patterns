export {};
// Идея:
// Есть одинаковая последовательность шагов, которые нужны выполнять для разных сущностей.
// Но часть шагов у них будет отличаться.
// И чтобы не плодить логику, мы можем описать ее в шаблонном методе.


// ---

type TForm = {
    name: string;
};

// --- Шаблонный метод, который реализовывает часть функционала
// Остальная часть уже отличается, поэтому для каждого класса будет реализована по-своему

abstract class FormSaver<T> {
    public save = (form: TForm) => {
        const result = this.transform(form);
        this.logger(result);
        this.send(result);
    };
    
    protected abstract transform(form: TForm): T;
    protected abstract send(data: T): void;
    protected logger = (data: T) => {
        console.log('FormSaver сохранил', JSON.stringify(data));
    };
};

// --- Классы, где мы реализовываем разный функционал.
// А часть функционала уже реализована в абстрактном классе, от которого они наследуются.

class Backend extends FormSaver<string> {
    protected transform = (form: TForm): string => {
        return `User: ${form.name}`;
    };

    protected send = (data: string) => {
        console.log(`Отправляю ${data} на сервер`);
    };
};

class ExternalService extends FormSaver<{ name: string }> {
    protected transform = (form: TForm): { name: string } => {
        return { name: form.name };
    };

    protected send = (data: { name: string }) => {
        console.log(`Отправляю ${data.name} на сторонний сервер`);
    };
};

// --- Использование:

const myBackend = new Backend();
myBackend.save({ name: 'Иван' }); // FormSaver сохранил "User: Иван"
// Отправляю User: Иван на сервер

const externalService = new ExternalService(); // FormSaver сохранил {"name":"Иван"}
externalService.save({ name: 'Иван' });
// Отправляю Иван на сторонний сервер