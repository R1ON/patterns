// Проблема:
// [Запрос] -> [Авторизация, валидация, ...]
// Получаем большую функцию с кучей бизнес логики

// Решение
// [Запрос] -> [Авторизация] -> [Валидация] -> [...]

type Middleware = {
    next(middleware: Middleware): Middleware;
    handler(request: any): any;
};


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

class Controller extends AbstractMiddleware {
    override handler(request: any) {
        console.log('Controller');

        return { success: request };
    }
};

// ---

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
