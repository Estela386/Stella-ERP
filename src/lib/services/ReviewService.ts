import { SupabaseClient } from "@supabase/supabase-js";
import {
  Review,
  IReview,
  CreateReviewDTO,
  UpdateReviewDTO,
} from "../models/Review";
import { ReviewRepository } from "../repositories/ReviewRepository";

export class ReviewService {
  private reviewRepository: ReviewRepository;

  constructor(client: SupabaseClient) {
    this.reviewRepository = new ReviewRepository(client);
  }

  /**
   * Obtener reviews por producto
   */
  async obtenerPorProducto(productId: string): Promise<{
    reviews: Review[] | null;
    error: string | null;
  }> {
    const { data, error } = await this.reviewRepository.getByProduct(productId);
    console.log("Datos obtenidos del repositorio:", data, "Error:", error);

    if (error || !data) {
      return { reviews: null, error };
    }

    const reviews = data.map(
      r =>
        new Review({
          ...r,
          user_name: r.usuario?.user_name ?? null,
        } as IReview)
    );
    return { reviews, error: null };
  }

  async yaComento(
    productId: string,
    userId: string
  ): Promise<{
    yaComento: boolean;
    error: string | null;
  }> {
    const { yaComento, error } = await this.reviewRepository.yaComento(
      productId,
      userId
    );
    return { yaComento, error };
  }

  /**
   * Crear review
   */
  async crear(data: CreateReviewDTO): Promise<{
    review: Review | null;
    error: string | null;
  }> {
    try {
      if (data.rating < 1 || data.rating > 5) {
        return {
          review: null,
          error: "La calificación debe ser entre 1 y 5",
        };
      }

      const { data: reviewData, error } =
        await this.reviewRepository.create(data);

      if (error || !reviewData) {
        return { review: null, error };
      }

      const review = new Review(reviewData as IReview);
      return { review, error: null };
    } catch (err) {
      return {
        review: null,
        error: err instanceof Error ? err.message : "Error desconocido",
      };
    }
  }

  /**
   * Actualizar review
   */
  async actualizar(
    id: string,
    userId: string,
    data: UpdateReviewDTO
  ): Promise<{
    review: Review | null;
    error: string | null;
  }> {
    const { data: existing, error: findError } =
      await this.reviewRepository.getById(id);

    if (findError || !existing) {
      return { review: null, error: "Review no encontrada" };
    }

    if (existing.user_id !== userId) {
      return {
        review: null,
        error: "No autorizado para modificar esta review",
      };
    }

    const { data: updated, error } = await this.reviewRepository.update(
      id,
      data
    );

    if (error || !updated) {
      return { review: null, error };
    }

    return { review: new Review(updated as IReview), error: null };
  }

  /**
   * Eliminar review
   */
  async eliminar(
    id: string,
    userId: string
  ): Promise<{
    success: boolean;
    error: string | null;
  }> {
    const { data: existing, error: findError } =
      await this.reviewRepository.getById(id);

    if (findError || !existing) {
      return { success: false, error: "Review no encontrada" };
    }

    if (existing.user_id !== userId) {
      return {
        success: false,
        error: "No autorizado",
      };
    }

    const { error } = await this.reviewRepository.delete(id);

    if (error) {
      return { success: false, error };
    }

    return { success: true, error: null };
  }
}
