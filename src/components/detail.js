// Función para obtener detalles del producto
async function getProductDetails(productId) {
    try {
        const response = await fetch(`https://api.mercadolibre.com/items/${productId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error obteniendo detalles del producto:', error);
        return {};
    }
}

async function renderProductDetails(productId) {
    try {
        // Ocultar el carrusel
        document.getElementById('main-carousel').style.display = 'none';
        // Obtener los detalles del producto desde la API
        const product = await getProductDetails(productId);
        // Agregar evento al botón de agregar al carrito
        document.getElementById('add-to-cart-button').addEventListener('click', () => addToCart(productId));
    } catch (error) {
        console.error('Error al obtener o mostrar los detalles del producto:', error);
    }
}