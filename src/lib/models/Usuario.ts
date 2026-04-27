/**
 * Modelo de Usuario
 * Representa la estructura de datos de un usuario en la base de datos
 */
export interface IUsuario {
  id: string;
  id_auth: string; // UID de Supabase
  correo: string;
  id_rol: number; // 1 = Admin, 2 = Cliente, etc.
  nombre?: string;
  apellido?: string;
  created_at?: string;
}

/**
 * DTO para actualizar un usuario
 */
export type UpdateUsuarioDTO = Partial<Omit<IUsuario, "id" | "email">>;

/**
 * Clase Usuario
 * Encapsula la lógica de negocio de un usuario
 */
export class Usuario implements IUsuario {
  id: string;
  id_auth: string; // UID de Supabase
  correo: string;
  id_rol: number;
  nombre?: string;
  apellido?: string;
  created_at?: string;

  constructor(data: IUsuario) {
    this.id = data.id;
    this.id_auth = data.id_auth;
    this.correo = data.correo || (data as any).email;
    this.id_rol = data.id_rol;
    this.nombre = data.nombre;
    this.apellido = data.apellido;
    this.created_at = data.created_at;
  }

  /**
   * Verifica si el usuario es administrador (rol 1)
   */
  esAdmin(): boolean {
    return this.id_rol === 1;
  }
  esMayorista(): boolean {
    return this.id_rol === 3;
  }

  esCliente(): boolean {
    return this.id_rol === 2;
  }

  /**
   * Verifica si el usuario tiene un rol específico
   */
  tieneRol(id_rol: number): boolean {
    return this.id_rol === id_rol;
  }
  get uid(): string {
    return this.id_auth;
  }

  /**
   * Convierte la instancia a JSON
   */
  toJSON(): IUsuario {
    return {
      id: this.id,
      id_auth: this.id_auth,
      correo: this.correo,
      id_rol: this.id_rol,
      nombre: this.nombre,
      apellido: this.apellido,
      created_at: this.created_at,
    };
  }
}
