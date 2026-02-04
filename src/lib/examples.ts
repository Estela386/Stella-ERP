/**
 * EJEMPLO DE USO DEL CRUD DE PRODUCTOS Y CATEGORÍAS
 *
 * Este archivo demuestra cómo utilizar los servicios de Producto y Categoría
 * en componentes del servidor (Server Components) o en rutas API de Next.js
 */

// ============================================
// EJEMPLO 1: Usar en un Server Component
// ============================================

/*
import { createClient as createServerClient } from '@/utils/supabase/server';
import { ProductoService } from '@/lib/services/ProductoService';

export default async function ProductosPage() {
  // Crear cliente de Supabase
  const supabase = await createServerClient();

  // Instanciar el servicio de productos
  const productoService = new ProductoService(supabase);

  // Obtener todos los productos
  const { productos, error } = await productoService.obtenerTodos();

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Productos</h1>
      <ul>
        {productos?.map((producto) => (
          <li key={producto.id}>
            <h2>{producto.nombre}</h2>
            <p>Precio: ${producto.precio}</p>
            <p>Stock: {producto.stock_actual}</p>
            <p>Margen: {producto.calcularMargen()}%</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
*/

// ============================================
// EJEMPLO 2: Usar en una Ruta API (POST)
// ============================================

/*
import { createClient as createServerClient } from '@/utils/supabase/server';
import { ProductoService } from '@/lib/services/ProductoService';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const supabase = await createServerClient();
    const productoService = new ProductoService(supabase);

    // Crear un nuevo producto
    const { producto, error } = await productoService.crear({
      nombre: body.nombre,
      costo: body.costo,
      precio: body.precio,
      tiempo: body.tiempo,
      stock_actual: body.stock_actual,
      stock_min: body.stock_min,
      url_imagen: body.url_imagen,
      id_categoria: body.id_categoria,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ producto }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}
*/

// ============================================
// EJEMPLO 3: Usar en una Ruta API (GET)
// ============================================

/*
import { createClient as createServerClient } from '@/utils/supabase/server';
import { ProductoService } from '@/lib/services/ProductoService';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    const supabase = await createServerClient();
    const productoService = new ProductoService(supabase);

    // Obtener producto por ID
    const { producto, error } = await productoService.obtenerPorId(id);

    if (error || !producto) {
      return NextResponse.json(
        { error: error || 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ producto });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}
*/

// ============================================
// EJEMPLO 4: Usar en una Ruta API (PUT)
// ============================================

/*
import { createClient as createServerClient } from '@/utils/supabase/server';
import { ProductoService } from '@/lib/services/ProductoService';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();

    const supabase = await createServerClient();
    const productoService = new ProductoService(supabase);

    // Actualizar producto
    const { producto, error } = await productoService.actualizar(id, {
      nombre: body.nombre,
      costo: body.costo,
      precio: body.precio,
      tiempo: body.tiempo,
      stock_actual: body.stock_actual,
      stock_min: body.stock_min,
      url_imagen: body.url_imagen,
      id_categoria: body.id_categoria,
    });

    if (error || !producto) {
      return NextResponse.json(
        { error: error || 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ producto });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}
*/

// ============================================
// EJEMPLO 5: Usar en una Ruta API (DELETE)
// ============================================

/*
import { createClient as createServerClient } from '@/utils/supabase/server';
import { ProductoService } from '@/lib/services/ProductoService';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    const supabase = await createServerClient();
    const productoService = new ProductoService(supabase);

    // Eliminar producto
    const { success, error } = await productoService.eliminar(id);

    if (error || !success) {
      return NextResponse.json(
        { error: error || 'Error al eliminar producto' },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: 'Producto eliminado correctamente' });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}
*/

// ============================================
// EJEMPLO 6: Operaciones adicionales
// ============================================

/*
const supabase = await createServerClient();
const productoService = new ProductoService(supabase);

// Obtener productos por categoría
const { productos: productosPorCategoria } = await productoService.obtenerPorCategoria(1);

// Buscar productos por nombre
const { productos: productosBuscados } = await productoService.buscar('laptop');

// Obtener productos con stock bajo
const { productos: productosStockBajo } = await productoService.obtenerProductosStockBajo();

// Actualizar stock de un producto (restar 5 unidades)
const { producto: productoActualizado } = await productoService.actualizarStock(1, -5);

// Obtener estadísticas
const { estadisticas } = await productoService.obtenerEstadisticas();

console.log('Total de productos:', estadisticas?.totalProductos);
console.log('Productos con stock bajo:', estadisticas?.productosStockBajo);
console.log('Ganancia total:', estadisticas?.gananciaTotal);
*/

// ============================================
// ESTRUCTURA DE DIRECTORIOS
// ============================================

/*
src/
├── lib/
│   ├── models/
│   │   ├── Producto.ts      (Clase Producto con métodos de negocio)
│   │   ├── Categoria.ts     (Clase Categoría con métodos de negocio)
│   │   └── index.ts         (Barrel file para exportaciones)
│   ├── repositories/
│   │   ├── BaseRepository.ts    (Clase base para repositorios)
│   │   ├── ProductoRepository.ts (CRUD de productos en BD)
│   │   ├── CategoriaRepository.ts (CRUD de categorías en BD)
│   │   └── index.ts             (Barrel file para exportaciones)
│   ├── services/
│   │   ├── ProductoService.ts   (Lógica de negocio de productos)
│   │   ├── CategoriaService.ts  (Lógica de negocio de categorías)
│   │   └── index.ts             (Barrel file para exportaciones)
│   └── examples.ts         (Este archivo con ejemplos de uso)
├── app/
│   └── api/
│       └── productos/
│           ├── route.ts        (GET todos, POST crear)
│           └── [id]/
│               └── route.ts    (GET por ID, PUT actualizar, DELETE)
└── ...
*/

// ============================================
// ARQUITECTURA Y PATRONES UTILIZADOS
// ============================================

/*
1. PATRÓN REPOSITORY
   - BaseRepository: Clase abstracta con operaciones CRUD genéricas
   - ProductoRepository: Extiende BaseRepository con operaciones específicas
   - CategoriaRepository: Extiende BaseRepository con operaciones específicas

2. PATRÓN SERVICE
   - ProductoService: Orquesta la lógica de negocio
   - CategoriaService: Orquesta la lógica de negocio
   - Valida datos antes de persistir
   - Maneja errores de manera consistente

3. PATRÓN MODEL/ENTITY
   - Producto: Clase con métodos de negocio (calcularMargen, esStockBajo, validar)
   - Categoria: Clase con métodos de negocio
   - Encapsulan la lógica relacionada a la entidad

4. TIPOS TYPESCRIPT
   - IProducto: Interfaz que define la estructura
   - CreateProductoDTO: DTO para crear productos
   - UpdateProductoDTO: DTO para actualizar productos
   - Proporciona seguridad de tipos

5. MANEJO DE ERRORES
   - Respuestas con estructura {data, error}
   - Validación de datos antes de persistir
   - Manejo de excepciones en repositorios

6. MEJORES PRÁCTICAS
   - Separación de responsabilidades
   - Inyección de dependencias
   - DRY (Don't Repeat Yourself)
   - SOLID principles
   - Documentación con JSDoc
*/
