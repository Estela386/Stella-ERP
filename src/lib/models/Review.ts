export interface IReview {
  id: string;
  product_id: string;
  user_id: string;
  user_name?: string; // Para mostrar el nombre del usuario en la review
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateReviewDTO {
  product_id: string;
  user_id: string;
  rating: number;
  comment?: string | null;
}

export interface UpdateReviewDTO {
  rating?: number;
  comment?: string | null;
}

export class Review {
  id: string;
  product_id: string;
  user_id: string;
  user_name?: string; // Para mostrar el nombre del usuario en la review
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;

  constructor(data: IReview) {
    this.id = data.id;
    this.product_id = data.product_id;
    this.user_name = data.user_name;
    this.user_id = data.user_id;
    this.rating = data.rating;
    this.comment = data.comment;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}
