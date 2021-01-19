import faker from 'faker/locale/en';

export interface RegisterForm {
    password: string;
    email: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
}

export const makeRegisterForm = (): RegisterForm => {
    const password = faker.internet.password();
    return {
        password,
        email: faker.internet.email(),
        confirmPassword: password,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
    };
};

export interface ForgotPassRequestForm {
    email: string;
}

export const makeForgotPassRequestForm = (): ForgotPassRequestForm => ({
    email: faker.internet.email(),
});

export interface ForgotPassForm {
    password: string;
    confirmPassword: string;
}

export const makeForgotPassForm = (): ForgotPassForm => {
    const password = faker.internet.password();
    return {
        password,
        confirmPassword: password,
    };
};
