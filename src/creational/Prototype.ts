// Идея:
// Клонировать объект, чтобы изменять ему какие-то свойства

// --- Создаем класс, который умеет клонировать

type Prototype<T> = {
    clone(): T;
};

class User implements Prototype<User> {
    createdAt: Date;
    constructor(
        public name: string,
        public age: number,
    ) {
        this.createdAt = new Date();
    }

    clone = (): User => {
        let newUser = new User(this.name, this.age);
        newUser.createdAt = new Date();

        return newUser;
    }
}

// --- Пример использования

const user = new User('Alex', 20);

const clonedUser = user.clone();

console.log(user === clonedUser); // false
