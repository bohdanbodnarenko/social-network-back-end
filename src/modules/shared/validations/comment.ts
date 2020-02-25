import * as yup from 'yup';

export const validCommentSchema = yup.object().shape({
    content: yup.string().required(),
});

export const validUpdateCommentSchema = yup.object().shape({
    content: yup.string().min(1),
});
