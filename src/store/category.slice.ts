import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Type definitions based on the Mongoose schema
interface Subcategory {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  excel_file?: {
    name: string;
    path: string;
    uploadedAt: Date;
  } | null;
  subcategories: Subcategory[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Initial state interface
interface CategoryState {
  categories: Category[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: CategoryState = {
  categories: [],
  loading: 'idle',
  error: null
};

// Async Thunks for API interactions
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/productcategoryapi');
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData: Partial<Category>, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/productcategoryapi', categoryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ categoryId, ...updateData }: { categoryId: string } & Partial<Category>, { rejectWithValue }) => {
    try {
      const response = await axios.put('/api/productcategoryapi', { categoryId, ...updateData });
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (categoryId: string, { rejectWithValue }) => {
    try {
      await axios.delete('/api/productcategoryapi', { data: { categoryId } });
      return categoryId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

export const importCategoriesFromExcel = createAsyncThunk(
  'categories/importFromExcel',
  async (file: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/api/productcategoryapi', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

// Create the slice
const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    // Any synchronous reducers can be added here
    resetError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch Categories
    builder.addCase(fetchCategories.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.loading = 'succeeded';
      state.categories = action.payload;
    });
    builder.addCase(fetchCategories.rejected, (state, action) => {
      state.loading = 'failed';
      state.error = action.payload as string;
    });

    // Create Category
    builder.addCase(createCategory.fulfilled, (state, action) => {
      state.categories.push(action.payload);
    });
    builder.addCase(createCategory.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // Update Category
    builder.addCase(updateCategory.fulfilled, (state, action) => {
      const index = state.categories.findIndex(cat => cat.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    });
    builder.addCase(updateCategory.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // Delete Category
    builder.addCase(deleteCategory.fulfilled, (state, action) => {
      state.categories = state.categories.filter(cat => cat.id !== action.payload);
    });
    builder.addCase(deleteCategory.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // Import Categories from Excel
    builder.addCase(importCategoriesFromExcel.fulfilled, (state, action) => {
      // Replace existing categories or append new ones
      state.categories = [...state.categories, ...action.payload];
    });
    builder.addCase(importCategoriesFromExcel.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  }
});

// Export actions and reducer
export const { resetError } = categoriesSlice.actions;
export default categoriesSlice.reducer;