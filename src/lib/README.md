# CRUD de Productos - Documentación

Este documento describe la implementación del CRUD de Productos y Categorías para el proyecto Stella-ERP.

## 📁 Estructura de Directorios

```
src/lib/
├── models/
│   ├── Producto.ts         # Entidad Producto con lógica de negocio
│   ├── Categoria.ts        # Entidad Categoría con lógica de negocio
│   └── index.ts            # Exportaciones
├── repositories/
│   ├── BaseRepository.ts   # Clase base con CRUD genérico
│   ├── ProductoRepository.ts  # Operaciones específicas de Producto
│   ├── CategoriaRepository.ts # Operaciones específicas de Categoría
│   └── index.ts            # Exportaciones
├── services/
│   ├── ProductoService.ts  # Lógica de negocio de Producto
│   ├── CategoriaService.ts # Lógica de negocio de Categoría
│   └── index.ts            # Exportaciones
└── examples.ts             # Ejemplos de uso
```

## 🏗️ Arquitectura

La implementación utiliza una arquitectura en capas con los siguientes patrones:

### 1. **Modelos (Models)**

Clases que representan las entidades con lógica de negocio:

```typescript
// Métodos disponibles en Producto
- calcularMargen(): number | null
- esStockBajo(): boolean
- validar(): { valid: boolean; errors: string[] }
- toJSON(): IProducto
```

### 2. **Repositorios (Repositories)**

Clases que manejan la persistencia en la base de datos:

- **BaseRepository**: Operaciones CRUD genéricas (getAll, getById, create, update, delete)
- **ProductoRepository**: Operaciones específicas (getByCategoria, searchByNombre, getProductosStockBajo, updateStock)
- **CategoriaRepository**: Operaciones específicas (getByNombre)

### 3. **Servicios (Services)**

Clases que orquestan la lógica de negocio:

- Validan datos antes de persistir
- Manejan errores de manera consistente
- Transforman DTOs a modelos
- Ejecutan operaciones adicionales si es necesario

## 📝 Cómo Usar

### Instalación

1. Los archivos ya están creados en `src/lib/`
2. Asegúrate de tener Supabase configurado en tu proyecto
3. Las tablas `producto` y `categoria` deben estar creadas en la base de datos

### Uso en Server Components

```typescript
import { createClient as createServerClient } from '@/utils/supabase/server';
import { ProductoService } from '@/lib/services';

export default async function MisProductos() {
  const supabase = await createServerClient();
  const productoService = new ProductoService(supabase);

  const { productos, error } = await productoService.obtenerTodos();

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {productos?.map((producto) => (
        <div key={producto.id}>
          <h2>{producto.nombre}</h2>
          <p>Precio: ${producto.precio}</p>
          <p>Margen: {producto.calcularMargen()}%</p>
        </div>
      ))}
    </div>
  );
}
```

### Uso en Rutas API

#### GET: Obtener todos los productos

```typescript
// app/api/productos/route.ts
import { createClient as createServerClient } from "@/utils/supabase/server";
import { ProductoService } from "@/lib/services";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createServerClient();
    const productoService = new ProductoService(supabase);

    const { productos, error } = await productoService.obtenerTodos();

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ productos });
  } catch (err) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
```

#### POST: Crear un producto

```typescript
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createServerClient();
    const productoService = new ProductoService(supabase);

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
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
```

#### PUT: Actualizar un producto

```typescript
// app/api/productos/[id]/route.ts
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const supabase = await createServerClient();
    const productoService = new ProductoService(supabase);

    const { producto, error } = await productoService.actualizar(id, {
      nombre: body.nombre,
      precio: body.precio,
      // ... otros campos
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ producto });
  } catch (err) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
```

#### DELETE: Eliminar un producto

```typescript
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const supabase = await createServerClient();
    const productoService = new ProductoService(supabase);

    const { success, error } = await productoService.eliminar(id);

    if (error || !success) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ message: "Producto eliminado" });
  } catch (err) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
```

## 🎯 Métodos Disponibles

### ProductoService

```typescript
// Obtener
obtenerTodos();
obtenerPorId(id);
obtenerPorCategoria(idCategoria);
buscar(nombre);
obtenerProductosStockBajo();

// Crear, Actualizar, Eliminar
crear(data);
actualizar(id, data);
eliminar(id);

// Operaciones especiales
actualizarStock(id, cantidad);
obtenerEstadisticas();
```

### CategoriaService

```typescript
// Obtener
obtenerTodas();
obtenerPorId(id);
obtenerPorNombre(nombre);

// Crear, Actualizar, Eliminar
crear(data);
actualizar(id, data);
eliminar(id);
```

## 🔍 Validaciones

### Validaciones en Producto

- ✅ Nombre requerido
- ✅ Costo no negativo
- ✅ Precio no negativo
- ✅ Precio >= Costo
- ✅ Stock no negativo
- ✅ Stock mínimo no negativo

### Validaciones en Categoría

- ✅ Nombre requerido
- ✅ Nombre máximo 100 caracteres

## 🎨 Métodos de Negocio

### Producto

```typescript
// Calcula el margen de ganancia en porcentaje
producto.calcularMargen(); // → 50 (50%)

// Verifica si el stock está por debajo del mínimo
producto.esStockBajo(); // → true | false

// Valida los datos del producto
producto.validar(); // → { valid: boolean, errors: [] }
```

## 🛠️ Manejo de Errores

Todas las operaciones retornan un objeto con la estructura:

```typescript
{
  data: T | null,
  error: string | null
}

// Ejemplo
const { producto, error } = await productoService.obtenerPorId(1);

if (error) {
  console.error('Error:', error);
} else {
  console.log('Producto:', producto);
}
```

## 📊 Ejemplos Prácticos

### Obtener estadísticas de productos

```typescript
const { estadisticas, error } = await productoService.obtenerEstadisticas();

console.log(`Total de productos: ${estadisticas?.totalProductos}`);
console.log(`Stock bajo: ${estadisticas?.productosStockBajo}`);
console.log(`Ingreso total: $${estadisticas?.ingresoTotal}`);
console.log(`Ganancia total: $${estadisticas?.gananciaTotal}`);
```

### Buscar productos

```typescript
const { productos } = await productoService.buscar("laptop");
```

### Actualizar stock

```typescript
// Agregar 10 unidades
const { producto } = await productoService.actualizarStock(1, 10);

// Restar 5 unidades
const { producto } = await productoService.actualizarStock(1, -5);
```

### Productos con stock bajo

```typescript
const { productos } = await productoService.obtenerProductosStockBajo();
```

## 🔐 Tipado TypeScript

Todos los DTOs están tipados para seguridad:

```typescript
import {
  Producto,
  IProducto,
  CreateProductoDTO,
  UpdateProductoDTO,
  Categoria,
  ICategoria,
  CreateCategoriaDTO,
  UpdateCategoriaDTO,
} from "@/lib/models";
```

## 📋 Checklist de Configuración

- [ ] Tablas `producto` y `categoria` creadas en Supabase
- [ ] Variables de entorno de Supabase configuradas
- [ ] Archivos de utilidades de Supabase en `src/utils/supabase/`
- [ ] Archivos de la librería en `src/lib/`

## 🚀 Próximos Pasos

1. Crear rutas API en `app/api/productos/`
2. Crear componentes React para consumir los servicios
3. Agregar validaciones adicionales según necesidades
4. Implementar paginación si es necesario
5. Agregar logs y monitoreo

## 📚 Recursos

- [Supabase Docs](https://supabase.com/docs)
- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/)

---

**Autor**: Asistente de IA  
**Fecha**: 2026-01-30  
**Versión**: 1.0
