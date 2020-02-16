import * as yup from 'yup';

export const validPostSchema = yup.object().shape({
    title: yup
        .string()
        .min(3)
        .max(30)
        .required(),
    body: yup.string().required(),
});
