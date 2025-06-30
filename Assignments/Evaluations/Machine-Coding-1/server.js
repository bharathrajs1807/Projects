const express = require('express');
const cors = require('cors');
const yup = require('yup');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const formSchema = (schema) => {
    let shape = {};
    for (const field of schema) {
        let validator;
        switch (field.type) {
            case 'text':
                validator = yup.string();
                if (field.required) {
                    validator = validator.required('This field is required');
                }
                if (field.minLength) {
                    validator = validator.min(field.minLength, `Minimum length is ${field.minLength}`);
                }
                break;
            case 'number':
                validator = yup.number();
                if (field.required) {
                    validator = validator.required('This field is required');
                }
                if (field.min !== undefined) {
                    validator = validator.min(field.min, `Minimum value is ${field.min}`);
                }
                if (field.max !== undefined) {
                    validator = validator.max(field.max, `Maximum value is ${field.max}`);
                }
                break;
            case 'email':
                validator = yup.string().email('Invalid email format');
                if (field.required) {
                    validator = validator.required('This field is required');
                }
                break;
            default:
                validator = yup.mixed().required(field.required ? 'This field is required' : undefined);
        }
        shape[field.name] = validator;
    }
    return yup.object().shape(shape);
};

app.post('/submit-form', async (req, res) => {
    const { schema, data } = req.body;
    try {
        const yupSchema = formSchema(schema);
        const validatedData = await yupSchema.validate(data, { abortEarly: false });
        res.json({ success: true, validatedData });
    } catch (error) {
        res.status(400).json({
            success: false,
            errors: error.errors,
        });
    }
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
}); 