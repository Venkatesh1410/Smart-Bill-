export interface Category {
    categoryId: number;
    categoryTitle: string;
    categoryDescription: string;
}

export interface UpdateCategory {
  categoryId: string;
  categoryTitle?: string;
  categoryDescription?: string;
}

