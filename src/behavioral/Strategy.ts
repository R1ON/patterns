export {};
// Идея:
// Есть несколько вариантов выполнения одного сценария, вместо того,
// чтобы пихать все в один класс, мы можем разнести их на разные.
// Также в любой момент мы можем менять актуальный сценарий.

// Например, есть авторизация, мы ее можем выполнить разными способами.
// Если какой-то из способов не работает, то мы можем использовать удобный механизм переключения
// между этими способами.
// А далее мы смотрим, какой способ был установлен, при помощи такого мы и авторизуемся


// --- Объект пользователя

class User {
    jwtToken: string = '';
    githubToken: string = '';
}

// --- Делаем implements у каждого варианта стратегии,
// чтобы просто не забыть реализовать метод auth

type AuthStrategy = {
    auth(user: User): boolean;
};

// --- Варианты авторизаций (гитхаб и jwt токен)

class GithubStrategy implements AuthStrategy {
    auth = (user: User): boolean => {
        if (!user.githubToken) {
            return false;
        }

        // проверяем токен на валидность...
        // делаем запрос к гихабу...
        // проверяем ответ от гитхаба...

        return true; // или false, зависит от реализации проверки
    };
};

class JwtStrategy implements AuthStrategy {
    auth = (user: User): boolean => {
        if (!user.jwtToken) {
            return false;
        }

        // расшифровываем токен...
        // проверяем наличие в бд...
        // проверяем, актуален ли он...

        return true; // или false, зависит от реализации проверки
    };
};

// --- Сам класс авторизации, через который мы можем менять стратегию авторизации

class Auth {
    constructor(private strategy: AuthStrategy) {}

    public changeStrategy = (strategy: AuthStrategy) => {
        this.strategy = strategy;
    };

    public authUser = (user: User) => {
        return this.strategy.auth(user);
    };
};

// --- Использование:

const user = new User();
user.githubToken = 'token';


const auth = new Auth(new JwtStrategy());

// false - так как jwt токен не установлен
console.log(auth.authUser(user));

// У пользователя не получилось авторизоваться через токен
// Просим авторизоваться через гитхаб
auth.changeStrategy(new GithubStrategy());


// true - потому что githubToken есть и он актуален
console.log(auth.authUser(user));