
async function testFetch() {
  try {
    const res = await fetch('http://localhost:3000/api/ventas/productos');
    if (!res.ok) {
      console.error('API Error:', res.status);
      return;
    }
    const data = await res.json();
    console.log('Product Count:', data.productos?.length || 0);
    if (data.productos && data.productos.length > 0) {
      console.log('First Product:', data.productos[0].nombre);
    }
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}
testFetch();
