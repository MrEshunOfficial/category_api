import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbconfigue/dbConfigue';
import { v4 as uuidv4 } from 'uuid';
import * as XLSX from 'xlsx';
import Category from '@/models/categoryModel';

export async function POST(req: NextRequest) {
  await connect();

  try {
    // Get the content type
    const contentType = req.headers.get('content-type') || '';

    // Handle multipart form data (Excel import)
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File;

      if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

      // Process and save categories (similar to your existing POST_IMPORT logic)
      const importedCategories = [];
      const categoryMap = new Map<string, any>();

      for (const row of jsonData) {
        const categoryName = row['Category'];
        const subcategoryName = row['Subcategory'];

        if (categoryName && !categoryMap.has(categoryName)) {
          const newCategory = new Category({
            id: uuidv4(),
            name: categoryName,
            subcategories: []
          });
          categoryMap.set(categoryName, newCategory);
          importedCategories.push(newCategory);
        }

        if (categoryName && subcategoryName) {
          const category = categoryMap.get(categoryName);
          if (category) {
            category.subcategories.push({
              id: uuidv4(),
              name: subcategoryName
            });
          }
        }
      }

      // Save all categories
      await Category.insertMany(importedCategories);

      return NextResponse.json(importedCategories, { status: 201 });
    }

    // Handle JSON category creation
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('JSON Parsing Error:', parseError);
      return NextResponse.json({ 
        error: 'Invalid JSON',
        details: parseError instanceof Error ? parseError.message : 'Unable to parse request body'
      }, { status: 400 });
    }

    // Validate required fields
    if (!body.name) {
      return NextResponse.json({ 
        error: 'Category name is required' 
      }, { status: 400 });
    }

    // Create a new category
    const newCategory = new Category({
      id: uuidv4(),
      name: body.name,
      subcategories: body.subcategories || []
    });

    await newCategory.save();
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('Category creation error:', error);
    return NextResponse.json({ 
      error: 'Failed to create category',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  await connect();

  try {
    const categories = await Category.find();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Fetch categories error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch categories',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  await connect();

  try {
    // Parse the request body only once
    const body = await req.json();
    const { categoryId, ...updateData } = body;

    // Validate inputs
    if (!categoryId) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    const updatedCategory = await Category.findOneAndUpdate(
      { id: categoryId },
      updateData,
      { new: true }
    );

    if (!updatedCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Category update error:', error);
    return NextResponse.json({ 
      error: 'Failed to update category',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await connect();

  try {
    const body = await req.json();
    const { categoryId } = body;

    // Validate input
    if (!categoryId) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    const deletedCategory = await Category.findOneAndDelete({ id: categoryId });

    if (!deletedCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Category deletion error:', error);
    return NextResponse.json({ 
      error: 'Failed to delete category',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
