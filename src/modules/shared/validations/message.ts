import * as yup from 'yup';

export const validMessageSchema = yup.object().shape({
    content: yup
        .string()
        .trim()
        .min(1),
});
