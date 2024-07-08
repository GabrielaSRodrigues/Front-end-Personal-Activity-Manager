import React, { useState } from 'react';
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import { Trash, Pencil, Plus, Edit } from 'lucide-react';
import { Category, Activity } from '../types';
import EditModal from './modal';

type CategoryProps = {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  setUser: number;
}

const CategoryList: React.FC<CategoryProps> = ({ categories, setCategories, setUser }) => {
  const [visible, setVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);

  const handleAddActivity = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    setSelectedCategory(category || null);
    setSelectedActivity(null);
    setIsAddingCategory(false);
    setIsEditingCategory(false);
    setVisible(true);
  };

  const handleEditActivity = (categoryId: number, activity: Activity) => {
    const category = categories.find(c => c.id === categoryId);
    setSelectedCategory(category || null);
    setSelectedActivity(activity);
    setIsAddingCategory(false);
    setIsEditingCategory(false);
    setVisible(true);
  };

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setSelectedActivity(null);
    setIsEditingCategory(false);
    setIsAddingCategory(true);
    setVisible(true);
  };

  const handleEditCategory = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    setSelectedCategory(category || null);
    setSelectedActivity(null);
    setIsAddingCategory(false);
    setIsEditingCategory(true);
    setVisible(true);
  };

  const handleAddActivityModal = async (title: string, description: string) => {
    if (selectedCategory) {
      const newActivity = {
        title,
        description,
        idUser: selectedCategory.idUser,
        idCategory: selectedCategory.id,
      };

      try {
        const response = await fetch(`http://localhost:3002/personal_manager/activities/create_activity/${newActivity.title}/${newActivity.description}/${newActivity.idUser}/${newActivity.idCategory}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to create activity');
        }

        const createdActivity: Activity = await response.json();

        setCategories((prevCategories) => prevCategories.map((category) => {
          if (category.id === selectedCategory.id) {
            return {
              ...category,
              activities: [...(category.activities || []), createdActivity],
            };
          }
          return category;
        }));

      } catch (error) {
        console.error('Failed to add activity:', error);
      }
    }
  };

  const handleUpdateActivityModal = async (title: string, description: string) => {
    if (selectedActivity && selectedCategory) {
      const updatedActivity = {
        id: selectedActivity.id,
        title,
        description,
        idUser: selectedCategory.idUser,
        idCategory: selectedCategory.id,
      };

      try {
        const response = await fetch(`http://localhost:3002/personal_manager/activities/update_activity/${updatedActivity.id}/${updatedActivity.title}/${updatedActivity.description}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to update activity');
        }

        const updatedActivityResponse: Activity = await response.json();

        setCategories((prevCategories) => prevCategories.map((category) => {
          if (category.id === selectedCategory.id) {
            return {
              ...category,
              activities: category.activities.map(activity =>
                activity.id === updatedActivityResponse.id ? updatedActivityResponse : activity
              ),
            };
          }
          return category;
        }));

      } catch (error) {
        console.error('Failed to update activity:', error);
      }
    }
  };

  const handleDeleteActivity = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3002/personal_manager/activities/delete_activity/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete activity');
      }

      setCategories((prevCategories) => prevCategories.map((category) => {
        if (category.id === selectedCategory?.id) {
          return {
            ...category,
            activities: category.activities?.filter(activity => activity.id !== id),
          };
        }
        return category;
      }));

    } catch (error) {
      console.error('Failed to delete activity:', error);
    }
  };

  const handleSaveCategoryModal = async (title: string) => {
    if (isAddingCategory) {
      const newCategory = {
        name: title,
        idUser: setUser
      };

      try {
        const response = await fetch(`http://localhost:3002/personal_manager/categories/create_category/${newCategory.name}/${newCategory.idUser}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to create category');
        }

        const createdCategory: Category = await response.json();

        setCategories((prevCategories) => [...prevCategories, createdCategory]);

      } catch (error) {
        console.error('Failed to add category:', error);
      }
    } else if (selectedCategory) {
      const updatedCategory = {
        ...selectedCategory,
        name: title,
      };

      try {
        const response = await fetch(`http://localhost:3002/personal_manager/categories/update_category/${updatedCategory.id}/${updatedCategory.name}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to update category');
        }

        const updatedCategoryResponse: Category = await response.json();

        setCategories((prevCategories) => prevCategories.map((category) => 
          category.id === updatedCategoryResponse.id ? updatedCategoryResponse : category
        ));

      } catch (error) {
        console.error('Failed to update category:', error);
      }
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      // Obtenha as atividades associadas à categoria
      const getActivitiesResponse = await fetch(`http://localhost:3002/personal_manager/activities/get_activity_user/${id}`);

      if (!getActivitiesResponse.ok) {
        throw new Error('Failed to fetch activities for the category');
      }

      const activities = await getActivitiesResponse.json();

      // Verifique se existem atividades
      if (activities.length > 0) {
        alert('Cannot delete category because it has associated activities.');
        return;
      }

      // Se não houver atividades, proceda com a exclusão da categoria
      const response = await fetch(`http://localhost:3002/personal_manager/categories/delete_category/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }

      setCategories((prevCategories) => prevCategories.filter(category => category.id !== id));

    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-wrap justify-center gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white shadow-md rounded-lg p-4 w-full max-w-md border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-bold text-lg">{category.name}</h2>
              <div className='flex-row gap-2'>
                <button onClick={() => handleEditCategory(category.id)}><Edit className="text-violet-500 hover:text-violet-700" /></button>
                <button onClick={() => handleAddActivity(category.id)} className="ml-2 text-violet-500 hover:text-violet-700">
                  <Plus />
                </button>
                <button onClick={() => handleDeleteCategory(category.id)}><Trash className="text-violet-500 hover:text-violet-700" /></button>
              </div>
            </div>
            <ul className="list-none">
              {category.activities?.map((activity) => (
                <li key={activity.id} className="mb-2">
                  <Card className="border-t-large border-violet-500">
                    <CardHeader className="font-medium">{activity.title}</CardHeader>
                    <CardBody>{activity.description}</CardBody>
                    <CardFooter className="flex-row justify-end flex-nowrap">
                      <button onClick={() => handleEditActivity(category.id, activity)}><Pencil className="text-violet-500 hover:text-violet-700" /></button>
                      <button onClick={() => handleDeleteActivity(activity.id)}><Trash className="text-violet-500 hover:text-violet-700" /></button>
                    </CardFooter>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div>
        <button onClick={handleAddCategory} className="fixed bottom-4 right-4 bg-violet-500 hover:bg-violet-700 text-white text-lg font-bold py-2 px-4 rounded-full">
          <Plus />
        </button>
      </div>
      <EditModal 
        visible={visible} 
        onClose={() => setVisible(false)} 
        onSave={isAddingCategory ? handleSaveCategoryModal : (selectedActivity ? handleUpdateActivityModal : handleAddActivityModal)}
        item={isAddingCategory ? selectedCategory : selectedActivity}
        isCategory={isAddingCategory}
      />
    </div>
  );
};

export default CategoryList;

