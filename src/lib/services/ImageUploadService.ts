import { SupabaseClient } from "@supabase/supabase-js";

export class ImageUploadService {
  private client: SupabaseClient;
  private bucketName = "product_images";

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  /**
   * Sube una imagen a Supabase Storage
   * @param file Archivo de imagen
   * @param productoId ID del producto (opcional, para namespacing)
   * @returns URL pública de la imagen o error
   */
  async uploadImage(
    file: File,
    productoId?: number
  ): Promise<{ url: string | null; error: string | null }> {
    try {
      console.log("Iniciando subida de imagen:", file);
      if (!file) {
        return { url: null, error: "No se seleccionó archivo" };
      }

      // Validar que sea una imagen
      if (!file.type.startsWith("image/")) {
        return { url: null, error: "El archivo debe ser una imagen" };
      }

      // Validar tamaño (máx 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return {
          url: null,
          error: "La imagen no puede ser mayor a 5MB",
        };
      }

      // Generar nombre único
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);
      const extension = file.name.split(".").pop();
      const fileName = `${timestamp}-${random}.${extension}`;

      // Path en el bucket
      const folderPath = productoId
        ? `productos/${productoId}/${fileName}`
        : `temp/${fileName}`;

      // Subir archivo
      const { data, error: uploadError } = await this.client.storage
        .from(this.bucketName)
        .upload(folderPath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        return { url: null, error: uploadError.message };
      }

      if (!data) {
        return {
          url: null,
          error: "No se pudo procesar la respuesta del servidor",
        };
      }
      console.log("Archivo subido con éxito:", data);

      // Obtener URL pública
      const { data: publicData } = this.client.storage
        .from(this.bucketName)
        .getPublicUrl(folderPath);

      return { url: publicData.publicUrl, error: null };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      return { url: null, error: errorMessage };
    }
  }

  /**
   * Elimina una imagen de Supabase Storage
   */
  async deleteImage(imageUrl: string): Promise<{ error: string | null }> {
    try {
      // Extraer el path de la URL pública
      const urlParts = imageUrl.split("/");
      const bucketName = urlParts[urlParts.length - 2];
      const path = urlParts.slice(urlParts.indexOf("storage") + 2).join("/");

      const { error } = await this.client.storage
        .from(this.bucketName)
        .remove([path]);

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      return { error: errorMessage };
    }
  }
}
