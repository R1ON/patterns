export {};
// Идея:
// Нужно создать объект, который должен переходить из одного состояние в другое.
// Вместо того, чтобы плодить кучу разных условий if (1 !== 2 && 1 !== 3) {} else ()
// Мы можем использовать этот паттерн,
// где переход на разные состояния производят вызываемые методы.
// Они решают, могут ли они перейти на какое-то состояние или нет


// --- Создаем абстрактный контекст
// Через него будем получать доступ к контексту,
// а также заставлять реализовывать необходимые методы

abstract class State {
    // Имена нужны только лишь для более удобного дебага
    public name: string = 'default_name';
    public item: UserComment | null = null;

    setContext = (item: UserComment) => {
        this.item = item;
    };

    getContext = (): UserComment => {
        if (!this.item) {
            throw new Error('Контекст не был установлен');
        }

        return this.item;
    };

    abstract publish(): void;
    abstract moderate(): void;
    abstract delete(): void;
};

// --- Создаем основной класс, через который мы будем управлять стейтом комментария
// При чем вручную переключать ничего не нужно. Захотели опубликовать? Вызвали нужный метод.
// А будет опубликован этот комментарий или нет, уже решает стейт

class UserComment {
    public text: string = '';
    private state: State | null = null;

    constructor() {
        this.setState(new Draft());
    }

    setState = (state: State) => {
        this.state = state;
        this.state.setContext(this);
    };

    getState = (): State => {
        if (!this.state) {
            throw new Error('Стейт не установлен');
        }
        return this.state;
    };

    publish = () => {
        this.getState().publish();
    };

    moderate = () => {
        this.getState().moderate();
    };

    delete = () => {
        this.getState().delete();
    };
};

// --- Разные состояния стейта и логика перехода от одного состояния к другому

class Draft extends State {
    name = 'DraftState';

    publish = () => {
        console.log('Сначала должна пройти стадия модерации');
    };

    moderate = () => {
        console.log('Отправлено на модерацию');
        this.getContext().setState(new Moderate());
    };

    delete = () => {
        // логика для удаления черновика...
        console.log('Черновик удален');
    };
}

class Moderate extends State {
    name = 'ModerateState';

    publish = () => {
        console.log('Опубликовываю');
        this.getContext().setState(new Publish());
    };

    moderate = () => {
        console.log('Комментарий уже на модерации');
    };

    delete = () => {
        console.log('Возвращаю в черновик');
        this.getContext().setState(new Draft());
    };
}

class Publish extends State {
    name = 'PublishState';

    publish = () => {
        console.log('Комментарий уже опубликован');
    };

    moderate = () => {
        console.log('Отправлено назад на модерацию');
        this.getContext().setState(new Moderate());
    };

    delete = () => {
        console.log('Возвращаю в черновики');
        this.getContext().setState(new Draft());
    };
}

// --- Использование:

const comment = new UserComment();
comment.text = 'лайк автору';

console.log(comment.getState().name); // DraftState

comment.publish(); // Сначала должна пройти стадия модерации
comment.moderate(); // Сначала должна пройти стадия модерации

console.log(comment.getState().name); // ModerateState

comment.moderate(); // Комментарий уже на модерации
comment.delete(); // Возвращаю в черновик

console.log(comment.getState().name); // DraftState

comment.moderate(); // Отправлено на модерацию
comment.publish(); // Опубликовываю

console.log(comment.getState().name); // PublishState

comment.publish(); // Комментарий уже опубликован
comment.delete(); // Возвращаю в черновики

console.log(comment.getState().name); // DraftState
