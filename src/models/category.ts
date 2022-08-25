import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    categoryID: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
    },
    parentCategory: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: "",
    },
    status: {
      type: Boolean,
      default: false,
    },
    productCount: {
      type: Number,
      default: 0,
    },
    countInventory: {
      type: Array,
    },
    filters: {
      type: Array,
    },
  },
  { timestamps: true }
);

const Category = (dbName: string) =>
  mongoose.connection.useDb(dbName).model("Category", CategorySchema);

export default Category;
