import mongoose from 'mongoose';

// Subcategory Schema
const SubcategorySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  name: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

// Category Schema
const CategorySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  excel_file: {
    type: {
      name: String,
      path: String,
      uploadedAt: Date
    },
    default: null
  },
  subcategories: [SubcategorySchema]
}, {
  timestamps: true
});

// Singleton model creation
const getModelForSchema = <T extends mongoose.Model<any>>(
  modelName: string, 
  schema: mongoose.Schema
): T => {
  // Check if model already exists
  if (mongoose.models[modelName]) {
    return mongoose.models[modelName] as T;
  }
  
  // Create and return new model
  return mongoose.model(modelName, schema) as T;
};

// Export the Category model using the singleton helper
const Category = getModelForSchema('Category', CategorySchema);
export default Category;