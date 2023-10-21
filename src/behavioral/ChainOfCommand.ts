export {};
// Идея:
// Не описывать всю бизнес логику в одном месте, а сделать что-то типа middleware
// Где в любом порядке можем подсовывать нужны кусок логики.
// Этот паттерн используется в express, только в другом виде.

// Проблема:
// [Запрос] -> [Авторизация, валидация, ...]
// Получаем большую функцию с кучей бизнес логики

// Решение
// [Запрос] -> [Авторизация] -> [Валидация] -> [...]

// --- Тип, описывающий как должны выглядеть миддлвары

type Middleware = {
    next(middleware: Middleware): Middleware;
    handler(request: any): any;
};

// --- Базовый класс, в котором описывается переход от одной миддлвары к другой

abstract class AbstractMiddleware implements Middleware {
    private nextMiddleware: Middleware | null = null;

    next(middleware: Middleware): Middleware {
        this.nextMiddleware = middleware;
        return middleware;
    }

    handler(request: any) {
        return this.nextMiddleware
            ? this.nextMiddleware.handler(request)
            : null;
    }
};

// --- Миддлвары для аутентификации и валидации

class AuthMiddleware extends AbstractMiddleware {
    override handler(request: any) {
        console.log('AuthMiddleware');

        if (request.userId === 1) {
            return super.handler(request);
        }

        return { error: 'Пользователь не авторизован' };
    }
};

class ValidateMiddleware extends AbstractMiddleware {
    override handler(request: any) {
        console.log('ValidateMiddleware');

        if (request.body) {
            return super.handler(request);
        }

        return { error: 'Валидация не пройдена' };
    }
};

// --- Финальная миддлвара, которая должна отработать в самом конце
// Если авторизация и валидация пройдены

class Controller extends AbstractMiddleware {
    override handler(request: any) {
        console.log('Controller');

        return { success: request };
    }
};

// --- Использование

const controller = new Controller();
const validate = new ValidateMiddleware();
const auth = new AuthMiddleware();

auth.next(validate).next(controller);

// { error: 'Пользователь не авторизован' }
console.log(auth.handler({ userId: 3 }));

// { error: 'Валидация не пройдена' }
console.log(auth.handler({ userId: 1 }));

// { success: { userId: 1, body: 'data' } }
console.log(auth.handler({ userId: 1, body: 'data' }));
