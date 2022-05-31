import { model, Schema } from 'mongoose';

const productSchema = new Schema({
    marke: String,
    bauJahr: String,
    kilometer: String,
    preis: String,
});

export default model('Product', productSchema);