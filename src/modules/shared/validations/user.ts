import * as yup from 'yup';

export const emailNotLongEnough = 'Email must be at least 3 characters';
export const firstNameNotLongEnough = 'Name must be at least 3 characters';
export const lastNameNotLongEnough = 'Last name must be at least 3 characters';
export const passwordNotLongEnough = 'Password must be at least 6 characters';
export const invalidEmail = 'Email must be a valid email';

const email = yup
    .string()
    .min(3, emailNotLongEnough)
    .max(255)
    .email(invalidEmail)
    .required();

export const validPasswordSchema = yup
    .string()
    .min(6, passwordNotLongEnough)
    .max(255)
    .required();

export const validUserSchema = yup.object().shape({
    email,
    password: validPasswordSchema,
    firstName: yup
        .string()
        .min(3, firstNameNotLongEnough)
        .max(100)
        .required(),
    lastName: yup
        .string()
        .min(3, lastNameNotLongEnough)
        .max(100)
        .required(),
    dateOfBirth: yup.date(),
});

export const validLoginSchema = yup.object().shape({
    email,
    password: validPasswordSchema,
});

export const validUpdateUserSchema = yup.object().shape({
    firstName: yup
        .string()
        .min(3, firstNameNotLongEnough)
        .max(100),
    lastName: yup
        .string()
        .min(3, lastNameNotLongEnough)
        .max(100),
    dateOfBirth: yup.date(),
});
