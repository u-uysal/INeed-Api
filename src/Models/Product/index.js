import { model, Schema } from 'mongoose';

const productSchema = new Schema({
  productName: String,
  description: String,
  price: String,
  image: String,
  createdAt: String,
  categoryName: String,
});
export default model('Product', productSchema);
