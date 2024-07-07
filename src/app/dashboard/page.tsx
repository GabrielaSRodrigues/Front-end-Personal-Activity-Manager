'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/header';
import CategoryList from '../components/categoryList';
import { User, Category, Activity } from '../types';
import { Select, SelectItem, user} from '@nextui-org/react';
export default function Dashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3002/personal_manager/users');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        router.push('/');
      }
    };

    fetchUsers();
  }, [router]);

  useEffect(() => {
    const fetchCategories = async (userId: number) => {
      try {
        const response = await fetch(`http://localhost:3002/personal_manager/categories/get_category_user/${userId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Category[] = await response.json();

        // Fetch activities for each category
        const categoriesWithActivities = await Promise.all(
          data.map(async (category) => {
            const activitiesResponse = await fetch(`http://localhost:3002/personal_manager/activities/get_activity_user/${category.id}`);
            if (activitiesResponse.ok) {
              const activities: Activity[] = await activitiesResponse.json();
              return { ...category, activities };
            }
            return category;
          })
        );

        setCategories(categoriesWithActivities);
      } catch (error) {
        console.error('Failed to fetch categories and activities:', error);
      }
    };

    if (selectedUser) {
      fetchCategories(selectedUser.id);
    }
  }, [selectedUser]);

  return (
    <div>
      <Header />
      <main className="flex flex-col items-center justify-start min-h-screen p-4">
        <div className="w-full max-w-md flex">

          <Select aria-label="Select a user"
            placeholder="Select a user" 
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            onChange={(e) => {
              const userId = Number(e.target.value);
              const user = users.find((u) => u.id === userId) || null;
              setSelectedUser(user);
            }}
          >
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id.toString()}>
                {user.name}
              </SelectItem>
            ))}
          </Select>
          
        </div>
        {selectedUser && <CategoryList categories={categories} setCategories={setCategories} />}
      </main>
    </div>
  );
}