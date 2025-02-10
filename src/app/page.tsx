"use client";
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Plus,
  Upload,
  InfoIcon,
  Save,
  Edit,
  SaveIcon,
  X,
} from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { RootState, AppDispatch } from "@/store";
import { v4 as uuidv4 } from "uuid";

import {
  createCategory,
  deleteCategory,
  fetchCategories,
  importCategoriesFromExcel,
  updateCategory,
} from "@/store/category.slice";

// Type definitions
interface Subcategory {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

const CategoryManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );
  const loading = useSelector((state: RootState) => state.categories.loading);
  const error = useSelector((state: RootState) => state.categories.error);

  // State for tracking changes and editing
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const [editingCategoryName, setEditingCategoryName] = useState<string>("");

  // State for new category and subcategory inputs
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [newSubcategoryNames, setNewSubcategoryNames] = useState<{
    [key: string]: string;
  }>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Helper function to mark changes as unsaved
  const markUnsavedChanges = () => {
    setHasUnsavedChanges(true);
  };

  const addCategory = () => {
    if (!newCategoryName.trim()) return;

    // Check if category with same name already exists
    const existingCategory = categories.find(
      (cat) => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase()
    );

    if (existingCategory) {
      // If category exists, update instead of creating new
      dispatch(
        updateCategory({
          categoryId: existingCategory.id,
          name: newCategoryName.trim(),
        })
      );
    } else {
      // Create new category if it doesn't exist
      dispatch(
        createCategory({
          name: newCategoryName.trim(),
          subcategories: [],
        })
      );
    }

    setNewCategoryName("");
    markUnsavedChanges();
  };

  const addSubcategory = (categoryId: string) => {
    const subcategoryName = newSubcategoryNames[categoryId]?.trim();
    if (!subcategoryName) return;

    const category = categories.find((c) => c.id === categoryId);
    if (!category) return;

    // Check if subcategory with same name already exists
    const existingSubcategory = category.subcategories.find(
      (sub) => sub.name.toLowerCase() === subcategoryName.toLowerCase()
    );

    if (existingSubcategory) {
      // If subcategory exists, do nothing
      return;
    }

    // Add new subcategory
    dispatch(
      updateCategory({
        categoryId,
        subcategories: [
          ...category.subcategories,
          {
            id: uuidv4(),
            name: subcategoryName,
          },
        ],
      })
    );

    setNewSubcategoryNames((prev) => ({
      ...prev,
      [categoryId]: "",
    }));
    markUnsavedChanges();
  };

  const removeCategory = (categoryId: string) => {
    dispatch(deleteCategory(categoryId));
    markUnsavedChanges();
  };

  const removeSubcategory = (categoryId: string, subcategoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (category) {
      dispatch(
        updateCategory({
          categoryId,
          subcategories: category.subcategories.filter(
            (sub) => sub.id !== subcategoryId
          ),
        })
      );
      markUnsavedChanges();
    }
  };

  const startEditingCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
  };

  const updateCategoryName = () => {
    if (!editingCategoryId || !editingCategoryName.trim()) return;

    // Check if another category with this name already exists
    const existingCategory = categories.find(
      (cat) =>
        cat.id !== editingCategoryId &&
        cat.name.toLowerCase() === editingCategoryName.trim().toLowerCase()
    );

    if (existingCategory) {
      // If category with same name exists, do not update
      setEditingCategoryId(null);
      setEditingCategoryName("");
      return;
    }

    dispatch(
      updateCategory({
        categoryId: editingCategoryId,
        name: editingCategoryName.trim(),
      })
    );

    setEditingCategoryId(null);
    setEditingCategoryName("");
    markUnsavedChanges();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      dispatch(importCategoriesFromExcel(file));
      markUnsavedChanges();
    }
  };

  // Error handling
  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300">
        An error occurred: {error}
      </div>
    );
  }

  return (
    <div className="container flex justify-center items-center p-3">
      <Card className="w-full max-w-2xl shadow-lg border-0 rounded-xl dark:bg-gray-800">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">
              Category Management
            </CardTitle>
            <div className="flex items-center space-x-4">
              {loading === "pending" && (
                <span className="text-sm text-white/70">Loading...</span>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* File Upload Section */}
          <div className="bg-white dark:bg-gray-700 shadow-md rounded-xl border border-gray-200 dark:border-gray-600 p-6">
            <div
              className="relative w-full border-2 border-dashed border-blue-200 dark:border-blue-500 rounded-lg p-6 text-center 
              hover:border-blue-400 dark:hover:border-blue-600 transition-all group cursor-pointer"
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                  dispatch(importCategoriesFromExcel(files[0]));
                  markUnsavedChanges();
                }
              }}
            >
              <input
                type="file"
                id="excel-upload"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                className="hidden"
                ref={fileInputRef}
              />
              <div className="flex flex-col items-center justify-center space-y-4">
                <Upload className="w-12 h-12 text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                <div className="text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  <p className="font-semibold text-lg">
                    Drag and Drop Spreadsheet
                  </p>
                  <p className="text-sm">
                    or{" "}
                    <span
                      className="text-blue-600 dark:text-blue-400 underline cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Browse Files
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Add New Category Section */}
          <div className="bg-white dark:bg-gray-700 shadow-sm rounded-lg p-4 border border-gray-200 dark:border-gray-600 flex space-x-4">
            <Input
              type="text"
              placeholder="Enter new category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="flex-grow"
              onKeyDown={(e) => {
                if (e.key === "Enter") addCategory();
              }}
            />
            <Button
              onClick={addCategory}
              variant="default"
              size={"icon"}
              disabled={loading === "pending"}
            >
              <Plus size={18} />
            </Button>
          </div>

          {/* Categories ScrollArea */}
          <ScrollArea className="h-[500px] w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-inner p-2 overflow-y-auto">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 my-2 transition-all hover:shadow-sm"
              >
                {/* Category Header */}
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-200 dark:border-gray-600">
                  {editingCategoryId === category.id ? (
                    <div className="flex space-x-2 w-full">
                      <Input
                        type="text"
                        value={editingCategoryName}
                        onChange={(e) => setEditingCategoryName(e.target.value)}
                        className="flex-grow"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") updateCategoryName();
                        }}
                      />
                      <Button
                        onClick={updateCategoryName}
                        variant="outline"
                        size={"icon"}
                        className="text-green-600 border-green-600"
                      >
                        <SaveIcon size={18} />
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingCategoryId(null);
                          setEditingCategoryName("");
                        }}
                        variant="destructive"
                        size={"icon"}
                      >
                        <X size={18} />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-300 flex-grow">
                        {category.name}
                      </h3>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => startEditingCategory(category)}
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-600"
                        >
                          <Edit size={18} />
                        </Button>
                        <Button
                          onClick={() => removeCategory(category.id)}
                          variant="destructive"
                          size="sm"
                          disabled={loading === "pending"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>

                {/* Subcategory Input */}
                <div className="flex space-x-2 mb-3">
                  <Input
                    type="text"
                    placeholder="Add subcategory"
                    value={newSubcategoryNames[category.id] || ""}
                    onChange={(e) =>
                      setNewSubcategoryNames((prev) => ({
                        ...prev,
                        [category.id]: e.target.value,
                      }))
                    }
                    className="flex-grow"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") addSubcategory(category.id);
                    }}
                  />
                  <Button
                    onClick={() => addSubcategory(category.id)}
                    variant="secondary"
                    disabled={loading === "pending"}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                  </Button>
                </div>

                {/* Subcategories List */}
                <div className="space-y-2">
                  {category.subcategories.map((subcategory) => (
                    <div
                      key={subcategory.id}
                      className="flex justify-between items-center bg-white dark:bg-gray-700 p-2 rounded border border-gray-200 dark:border-gray-600 shadow-sm"
                    >
                      <span className="text-gray-700 dark:text-gray-300">
                        {subcategory.name}
                      </span>
                      <Button
                        onClick={() =>
                          removeSubcategory(category.id, subcategory.id)
                        }
                        variant="ghost"
                        size="sm"
                        disabled={loading === "pending"}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryManagement;
