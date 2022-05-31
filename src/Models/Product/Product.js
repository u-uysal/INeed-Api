import { model, Schema } from 'mongoose';

const productSchema = new Schema({
  name: String,
  price: Number
});

export default model('product', productSchema);
