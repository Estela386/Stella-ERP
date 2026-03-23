import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "./BaseRepository";
import { IProveedor } from "../models/Proveedor";

export class ProveedorRepository extends BaseRepository<IProveedor> {
  constructor(client: SupabaseClient) {
    super(client, "proveedores");
  }
}
