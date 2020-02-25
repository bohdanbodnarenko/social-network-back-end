import * as yup from 'yup';

export const validMessageSchema = yup.object().shape({
    content: yup
        .string()
        .trim()
        .required(),
});

export const validUpdateMessageSchema = yup.object().shape({
    content: yup
        .string()
        .trim()
        .min(1),
});
