export interface User {
    id: number;
    email: string;
    name: string;
    password: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface Activity {
    id: number;
    title: string;
    description: string;
    userId: number;
    categoryId: number;
    created_at: string;
    updated_at: string;
  }
  
  export interface Category {
    id: number;
    idUser: number;
    name: string;
    created_at: string;
    updated_at: string;
    activities?: Activity[];
  }


