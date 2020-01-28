import * as yup from 'yup';

export const validChannelSchema = yup.object().shape({
    name: yup
        .string()
        .min(3)
        .max(100)
        .required('Please specify a name'),
    tag: yup
        .string()
        .min(3)
        .max(100)
        .trim()
        .matches(/^\s*\S+\s*$/, 'Tag should not contain the spaces')
        .required('Please create a tag for your channel'),
});
