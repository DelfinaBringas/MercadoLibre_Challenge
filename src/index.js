// Variables globales
let cart = [];
let queryActual = '';
const itemsPerPage = 12; // Número de ítems por página
const maxPagesToShow = 6; // Máximo número de páginas a mostrar en la paginación

// Función para buscar productos
async function searchProducts(query, offset = 0, limit = itemsPerPage, isCategory = false) {
    try {
        const url = isCategory ?
            `https://api.mercadolibre.com/sites/MLA/search?category=${query}&offset=${offset}&limit=${limit}` :
            `https://api.mercadolibre.com/sites/MLA/search?q=${query}&offset=${offset}&limit=${limit}`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error buscando productos:', error);
        return { results: [], paging: {} };
    }
}

// Función para renderizar detalles del producto
async function renderProductDetails(productId) {
    try {

        // Obtener los detalles del producto desde la API
        const product = await getProductDetails(productId);

        // Renderizar los detalles del producto
        const productContainer = document.getElementById('product-container');
        if (productContainer) {
            productContainer.innerHTML = `
                <div class="productDetail">
                    <img class="imgDetail" src="${product.pictures[0].url}" alt="${product.title}">
                    <div class="product-info">
                        <h1>${product.title}</h1>
                        <p>${product.sold_quantity} vendidos</p>
                        <p>${product.condition === 'new' ? 'Nuevo' : 'Usado'}</p>
                        <div class="price-container">
                            <div class="promotion-item__description">
                                <div class="promotion-item__today-offer-container">
                                </div>
                                <div class="promotion-item__discount-component">
                                    <div class="andes-money-amount-combo promotion-item__price has-discount">
                                        <div class="andes-money-amount-combo__main-container">
                                            <span class="andes-money-amount andes-money-amount--cents-superscript" style="font-size:24px" role="img" aria-label="Ahora: ${product.price} pesos" aria-roledescription="Precio">
                                                <span class="andes-money-amount__currency-symbol" aria-hidden="true">$</span>
                                                <span class="andes-money-amount__fraction" aria-hidden="true">${product.price}</span>
                                            </span>
                                        </div>
                                        ${product.original_price ? `
                                        <s class="andes-money-amount andes-money-amount-combo__previous-value andes-money-amount--previous andes-money-amount--cents-superscript" style="font-size:12px" role="img" aria-label="Antes: ${product.original_price} pesos" aria-roledescription="Precio">
                                            <span class="andes-money-amount__currency-symbol" aria-hidden="true">$</span>
                                            <span class="andes-money-amount__fraction" aria-hidden="true">${product.original_price}</span>
                                        </s>` : ''}
                                    </div>
                                </div>
                                <div class="promotion-item__installments-div">
                                    <span class="installment-pre-text">
                                        <span class="promotion-item__installments">
                                            Mismo precio en 9 cuotas de <span>$ 29.444</span>
                                        </span>
                                    </span>
                                </div>
                                <span class="promotion-item__seller">por Mercado Libre Argentina</span>
                                <div class="promotion-item__newshipping-container">
                                    <span>
                                        <span class="promotion-item__pill" style="background-color:#00A6501A;color:#00A650">Llega gratis mañana</span>
                                    </span>
                                    <span style="color:#0000008C" class="fulfillment-text">Enviado por 
                                        <svg viewBox="0 0 56 18" xmlns="http://www.w3.org/2000/svg" class="full-icon" width="38px" height="12px">
                                            <path d="M3.545 0L0 10.286h5.91L3.544 18 13 6.429H7.09L10.637 0zm14.747 14H15.54l2.352-10.672h7.824l-.528 2.4h-5.072l-.352 1.664h4.944l-.528 2.4h-4.96L18.292 14zm13.32.192c-3.28 0-4.896-1.568-4.896-3.808 0-.176.048-.544.08-.704l1.408-6.352h2.8l-1.392 6.288c-.016.08-.048.256-.048.448.016.88.688 1.728 2.048 1.728 1.472 0 2.224-.928 2.496-2.176L35.5 3.328h2.784l-1.392 6.336c-.576 2.592-1.984 4.528-5.28 4.528zM45.844 14h-7.04l2.352-10.672h2.752L42.1 11.6h4.272l-.528 2.4zm9.4 0h-7.04l2.352-10.672h2.752L51.5 11.6h4.272l-.528 2.4z" fill="#00a650" fill-rule="evenodd"></path>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                            <div class="quantity-container">
                            <label for="quantity">Cantidad:</label>
                            <input type="number" id="quantity" min="1" max="${product.available_quantity}" value="1">
                            </div>
                            <button onclick="addToCart('${product.id}')">Agregar al carrito</button>
                        </div>
                    </div>
                </div>
                <div class="product-description">
                    <h2>Descripción</h2>
                    <ul class="product-attributes">
                        ${product.attributes.map(attr => `<li><strong>${attr.name}:</strong> ${attr.value_name}</li>`).join('')}
                    </ul>
                </div>
            `;

            // Agregar evento al botón de agregar al carrito
            const addToCartButton = document.getElementById('add-to-cart-button');
            if (addToCartButton) {
                addToCartButton.addEventListener('click', () => addToCart(productId));
            }
        }
    } catch (error) {
        console.error('Error al obtener o mostrar los detalles del producto:', error);
    }
}

// Función para renderizar productos en la página
async function renderProducts(data) {
    try {
        const { results: products, paging } = data;
        const productContainer = document.getElementById('product-container');
        if (productContainer) {
            productContainer.innerHTML = '';
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add('product-card');
                productCard.innerHTML = `
                    <div class="product-detail">
                        <img src="${product.thumbnail}" alt="${product.title}" onclick="renderProductDetails('${product.id}')">
                        <p class="promotion-item__title">
                            <a href="#" onclick="renderProductDetails('${product.id}')">${product.title}</a>
                        </p>
                        <span class="promotion-item__seller">por Mercado Libre Argentina</span>
                        <div class="product-info">
                            <div class="promotion-item__description">
                                <div class="promotion-item__today-offer-container">
                                </div>
                                <div class="promotion-item__discount-component">
                                    <div class="andes-money-amount-combo promotion-item__price has-discount">
                                        <div class="andes-money-amount-combo__main-container">
                                            <span class="andes-money-amount andes-money-amount--cents-superscript" style="font-size:24px" role="img" aria-label="Ahora: ${product.price} pesos" aria-roledescription="Precio">
                                                <span class="andes-money-amount__currency-symbol" aria-hidden="true">$</span>
                                                <span class="andes-money-amount__fraction" aria-hidden="true">${product.price}</span>
                                            </span>
                                        </div>
                                        ${product.original_price ? `
                                        <s class="andes-money-amount andes-money-amount-combo__previous-value andes-money-amount--previous andes-money-amount--cents-superscript" style="font-size:12px" role="img" aria-label="Antes: ${product.original_price} pesos" aria-roledescription="Precio">
                                            <span class="andes-money-amount__currency-symbol" aria-hidden="true">$</span>
                                            <span class="andes-money-amount__fraction" aria-hidden="true">${product.original_price}</span>
                                        </s>` : ''}
                                    </div>
                                </div>
                                <div class="promotion-item__installments-div">
                                    <span class="installment-pre-text"><span class="promotion-item__installments">Mismo precio en 6 cuotas de <span>$ 15.000</span></span></span>
                                </div>
                                <span class="promotion-item__seller">por Mercado Libre Argentina</span>
                                <div class="promotion-item__newshipping-container">
                                    <span><span class="promotion-item__pill" style="background-color:#00A6501A;color:#00A650">Llega gratis mañana</span></span>
                                    <span style="color:#0000008C" class="fulfillment-text">Enviado por 
                                        <svg viewBox="0 0 56 18" xmlns="http://www.w3.org/2000/svg" class="full-icon" width="38px" height="12px">
                                            <path d="M3.545 0L0 10.286h5.91L3.544 18 13 6.429H7.09L10.637 0zm14.747 14H15.54l2.352-10.672h7.824l-.528 2.4h-5.072l-.352 1.664h4.944l-.528 2.4h-4.96L18.292 14zm13.32.192c-3.28 0-4.896-1.568-4.896-3.808 0-.176.048-.544.08-.704l1.408-6.352h2.8l-1.392 6.288c-.016.08-.048.256-.048.448.016.88.688 1.728 2.048 1.728 1.472 0 2.224-.928 2.496-2.176L35.5 3.328h2.784l-1.392 6.336c-.576 2.592-1.984 4.528-5.28 4.528zM45.844 14h-7.04l2.352-10.672h2.752L42.1 11.6h4.272l-.528 2.4zm9.4 0h-7.04l2.352-10.672h2.752L51.5 11.6h4.272l-.528 2.4z" fill="#00a650" fill-rule="evenodd"></path>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                productContainer.appendChild(productCard);
            });

            crearPaginacion(paging);
        }
    } catch (error) {
        console.error('Error al renderizar productos:', error);
    }
}

// Función para crear la paginación
function crearPaginacion(paging) {
    const paginacionContainer = document.getElementById('paginacion');
    paginacionContainer.innerHTML = '';

    const { total, offset, limit } = paging;
    const totalPages = Math.ceil(total / limit);
    const currentPage = Math.floor(offset / limit) + 1;
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.innerText = 'Anterior';
        prevButton.addEventListener('click', () => buscarYRenderizarProductos(queryActual, offset - limit, limit));
        paginacionContainer.appendChild(prevButton);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        if (i === currentPage) {
            pageButton.classList.add('active');
        } else {
            pageButton.addEventListener('click', () => buscarYRenderizarProductos(queryActual, (i - 1) * limit, limit));
        }
        paginacionContainer.appendChild(pageButton);
    }

    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.innerText = 'Siguiente';
        nextButton.addEventListener('click', () => buscarYRenderizarProductos(queryActual, offset + limit, limit));
        paginacionContainer.appendChild(nextButton);
    }
}

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


// Función para crear la paginación
function crearPaginacion(paging) {
    const paginacionContainer = document.getElementById('paginacion');
    paginacionContainer.innerHTML = '';

    const { total, offset, limit } = paging;
    const totalPages = Math.ceil(total / limit);
    const currentPage = Math.floor(offset / limit) + 1;
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.innerText = 'Anterior';
        prevButton.addEventListener('click', () => buscarYRenderizarProductos(queryActual, offset - limit, limit));
        paginacionContainer.appendChild(prevButton);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        if (i === currentPage) {
            pageButton.classList.add('active');
        } else {
            pageButton.addEventListener('click', () => buscarYRenderizarProductos(queryActual, (i - 1) * limit, limit));
        }
        paginacionContainer.appendChild(pageButton);
    }

    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.innerText = 'Siguiente';
        nextButton.addEventListener('click', () => buscarYRenderizarProductos(queryActual, offset + limit, limit));
        paginacionContainer.appendChild(nextButton);
    }
}

// Función para renderizar categorías en el menú desplegable
async function fetchCategories() {
    try {
        const response = await fetch('https://api.mercadolibre.com/sites/MLA/categories');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error obteniendo categorías:', error);
        return [];
    }
}

function renderCategoriesDropdown(categories) {
    const categoriesDropdown = document.getElementById('categories-dropdown');
    categoriesDropdown.innerHTML = '';
    categories.forEach(category => {
        const categoryLink = document.createElement('a');
        categoryLink.href = "#";
        categoryLink.textContent = category.name;
        categoryLink.addEventListener('click', async (e) => {
            e.preventDefault();
            queryActual = category.id;
            buscarYRenderizarProductos(queryActual, 0, itemsPerPage, true);
        });
        categoriesDropdown.appendChild(categoryLink);
    });
}

// Función para renderizar la sección de ayuda
function renderHelpOptions() {
    const productContainer = document.getElementById('product-container');
    productContainer.innerHTML = `
        <div class="cx-peach-home__help">
            <div class="cx-peach-home__section cx-peach-home__section--size-0 search-section">
                <div class="cx-search-section">
                    <div class="search-bar-new">
                        <h1 class="search-bar__subtitle">¿Con qué podemos ayudarte?</h1>
                        <div aria-owns="cb1-listbox" class="cx-search-box">
                            <div class="andes-form-control andes-form-control--textfield cx-input-search">
                                <div class="andes-form-control__control">
                                    <input role="combobox" aria-activedescendant="" aria-controls="cb2-listbox" aria-expanded="false" id="cb1-listbox" class="andes-form-control__field" maxlength="120" placeholder="Buscá en Ayuda" aria-label="Buscá en Ayuda" rows="1" value="">
                                </div>
                            </div>
                            <button disabled="" type="button" class="andes-button cx-search-button andes-button--large andes-button--quiet andes-button--disabled" id=":Rli97m:"><span class="andes-button__content">Buscar</span></button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="realestates-web__message andes-message andes-message--orange andes-message--quiet" id=":r0:">
                <div class="andes-message__border-color--orange"></div>
                <div class="andes-badge andes-badge--pill andes-badge--orange andes-message__badge andes-badge--pill-icon andes-badge--small" id=":r0:-notification">
                    <div aria-hidden="true" class="andes-badge__icon">
                        <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="white">
                            <path d="M13.4545 5.81824H10.5454L10.909 13.8182H13.0909L13.4545 5.81824Z" fill="white"></path>
                            <path d="M12 15.2728C12.8033 15.2728 13.4545 15.924 13.4545 16.7273C13.4545 17.5307 12.8033 18.1819 12 18.1819C11.1966 18.1819 10.5454 17.5307 10.5454 16.7273C10.5454 15.924 11.1966 15.2728 12 15.2728Z" fill="white"></path>
                        </svg>
                    </div>
                </div>
                <div class="andes-message__content andes-message__content--untitled">
                    <div class="andes-message__text andes-message__text--orange">
                        <div class="realestates-web__message-description">Por un problema técnico, puede que veas en el listado de tus compras un mensaje de "No pudimos cargar los datos" pese a que nosotros los tenemos registrados. Queremos acercarte la tranquilidad de que tus compras llegarán a tiempo.
                        Te pedimos disculpas por la confusión que podemos haber ocasionado. Estamos trabajando para solucionarlo.</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
//funcion para mensaje agregado correctamente
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}
// Función para agregar productos al carrito
function addToCart(productId) {
    const quantityElement = document.getElementById('quantity');
    if (!quantityElement || !quantityElement.value.trim()) {
        alert('Por favor, seleccione una cantidad válida.');
        return;
    }
    
    const quantity = parseInt(quantityElement.value, 10);
    if (isNaN(quantity) || quantity <= 0) {
        alert('Por favor, ingrese una cantidad válida.');
        return;
    }

    getProductDetails(productId).then(product => {
        if (!product) {
            alert('Producto no encontrado. No se puede agregar al carrito.');
            return;
        }

        for (let i = 0; i < quantity; i++) {
            cart.push(product);
        }
        showToast(`${quantity} productos agregados al carrito`, 3000);
        saveCartToLocalStorage();
        renderCart();
    }).catch(error => {
        console.error('Error obteniendo detalles del producto:', error);
        alert('Error al obtener detalles del producto. Inténtalo de nuevo más tarde.');
    });
}
// Función para guardar el carrito en localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}
// Función para mostrar el carrito de compras
function renderCart() {
    const productContainer = document.getElementById('product-container');
    loadCartFromStorage();
    
    if (cart.length === 0) {
        productContainer.innerHTML = '<p>El carrito está vacío</p>';
        return;
    }

    let totalPrice = 0;
    const cartItemsHtml = cart.map((product, index) => {
        totalPrice += product.price;
        return `
            <div class="cart-item">
                <img src="${product.thumbnail}" alt="${product.title}">
                <div class="cart-item-info">
                    <h3>${product.title}</h3>
                    <p class="price">$${product.price}</p>
                    <button class="btnCarrito" onclick="removeFromCart(${index})">Eliminar</button>
                </div>
            </div>
        `;
    }).join('');

    productContainer.innerHTML = `
    <div class="carritoContent">
    <h2>Mis Productos</h2>
        <div class="cart-items-column">
            
            <div class="cart-items">
                ${cartItemsHtml}
            </div>
        </div>
        <div class="cart-actions-column">
            <div class="cart-total">
                <h3>Total: $${totalPrice.toFixed(2)}</h3>
            </div>
            <div class="cart-actions">
                <button class="btnCarrito" onclick="clearCart()">Vaciar Carrito</button>
                <button class="btnCarrito">Seguir comprando</button>
                <button class="btnCarrito" onclick="checkout()">Comprar ahora</button>
            </div>
        </div>
    </div>

`;
}

// Función para eliminar un producto del carrito
function removeFromCart(index) {
    cart.splice(index, 1); // Eliminar el producto del carrito
    saveCartToLocalStorage(); // Guardar el carrito actualizado en localStorage
    renderCart(); // Volver a renderizar el carrito actualizado
}
// Función para vaciar el carrito
function clearCart() {
    cart = []; // Vaciar el carrito
    saveCartToLocalStorage(); // Guardar el carrito vacío en localStorage
    renderCart(); // Volver a renderizar el carrito actualizado
}
// Función para cargar el carrito desde localStorage
function loadCartFromStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
}

function checkout() {
    // Crear un formulario dinámicamente en JavaScript
    const form = document.createElement('form');
    form.id = 'redirectForm'; // Establecer un ID para el formulario
    form.action = 'checkout.html'; // URL de la página con el formulario de compra
    form.method = 'GET'; // Método GET o POST según tus necesidades

    // Agregar el formulario al body para que sea enviado
    document.body.appendChild(form);

    // Enviar el formulario para redirigir al usuario
    form.submit();
}
document.addEventListener('DOMContentLoaded', function() {
    const formularioCompra = document.getElementById('formularioCompra');
    const mensajeExito = document.getElementById('mensajeExito');
  
    formularioCompra.addEventListener('submit', function(event) {
      event.preventDefault();
  
      // Mostrar el mensaje de éxito
      mensajeExito.style.display = 'block';
  
      // Opcional: Redirigir al usuario a una página de confirmación después de 3 segundos
      setTimeout(function() {
        window.location.href = 'confirmacion_compra.html';
      }, 3000);
    });
  });
  
// Funciones adicionales para mostrar las secciones de login y signup
function showLoginForm() {
    document.getElementById('paginacion').style.display = 'none';
    const productContainer = document.getElementById('product-container');
    productContainer.innerHTML = `
        <div class="andes-card grid-view_section grid-view_section--content andes-card--outline andes-card--padding-0">
            <div class="andes-card__content">
                <div class="children-wrapper">
                    <form class="login-form" action="/jms/mla/lgz/msl/login" method="POST" novalidate>
                        <div class="login-form__input">
                            <div class="login-form__input">
                                <div class="andes-form-control andes-form-control--textfield login-form__input--email andes-form-control--default">
                                    <label for="user_id">
                                        <span class="andes-form-control__label">E‑mail, teléfono o usuario</span>
                                    </label>
                                    <div class="andes-form-control__control">
                                        <input type="email" data-testid="user_id" name="user_id" autocomplete="on" autocapitalize="none" spellcheck="false" autocorrect="off" rows="1" id="user_id" class="andes-form-control__field" maxlength="120" placeholder="">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="login-form__actions">
                            <button type="submit" class="andes-button login-form__submit andes-button--large andes-button--loud">
                                <span class="andes-button__content">Continuar</span>
                            </button>
                            <a href="#" class="andes-button andes-button--large andes-button--transparent andes-button--full-width" id="registration-link">
                                <span class="andes-button__content">Crear cuenta</span>
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}

function showSignupForm() {
    document.getElementById('paginacion').style.display = 'none';
    const productContainer = document.getElementById('product-container');
    productContainer.innerHTML = `
        <div class="hub-card__container">
            <h1 class="hub-card__title">Completá los datos para crear tu cuenta</h1>
            <ul class="andes-list step-list andes-list--default">
                <div class="andes-card step-list__card andes-card--elevated andes-card--padding-16">
                    <li class="andes-list_item step-listitem andes-listitem--size-medium andes-list_item-with-secondary">
                        <div class="andes-list__item-first-column">
                            <div class="andes-list_item-asset andes-list_item-asset--icon" aria-hidden="true">
                                <div class="thumbnail-congrats">
                                    <svg class="thumbnail-pending" viewBox="0 0 100 100">
                                        <circle class="bg" cx="50" cy="50" r="40"></circle>
                                        <circle class="meter" cx="50" cy="50" r="40"></circle>
                                    </svg>
                                    <div class="asset">
                                        <svg width="24px" height="16px" viewBox="0 0 24 16" version="1.1" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <title>Thumbnail</title>
                                            <g id="Registro-ML---nativo-" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                <g id="HUB---Validación-de-e-mail" transform="translate(-28.000000, -205.000000)">
                                                    <rect fill="#FFFFFF" x="0" y="0" width="360" height="640"></rect>
                                                    <g id="Group" transform="translate(8.000000, 179.000000)">
                                                        <g id="🔲-Shadow-style">
                                                            <circle stroke-opacity="0.0700000003" stroke="#000000" cx="20" cy="20" r="19.5"></circle>
                                                        </g>
                                                        <g id="02-Medium-/-01-Simple-/-With-Thumbnail-+-Text-+-Description" transform="translate(12.000000, 0.000000)">
                                                            <g id="Thumbnail" transform="translate(0.000000, 14.000000)">
                                                                <g id="Thumbnail-state">
                                                                    <circle stroke-opacity="0.0700000003" stroke="#000000" cx="20" cy="20" r="19.5"></circle>
                                                                    <g id="Group" transform="translate(8.000000, 8.000000)" fill="#3483FA" fill-rule="nonzero">
                                                                        <g id="🖼Icon">
                                                                            <path d="M23.25,4.546797 L23.25,19.4798466 L0.75,19.4798466 L0.75,4.546797 L23.25,4.546797 Z M21.75,8.791797 L13.860521,13.3006585 C12.7754645,13.9206907 11.457949,13.9571632 10.3455444,13.4100759 L10.139479,13.3006585 L2.25,8.792797 L2.25,17.979 L21.75,17.979 L21.75,8.791797 Z M21.75,6.046 L2.25,6.046 L2.25,7.064797 L10.8836874,11.9982937 C11.5222014,12.3631589 12.294878,12.3912254 12.9540324,12.0824934 L13.1163126,11.9982937 L21.75,7.063797 L21.75,6.046 Z" id="Combined-Shape"></path>
                                                                        </g>
                                                                    </g>
                                                                </g>
                                                            </g>
                                                        </g>
                                                    </g>
                                                </g>
                                            </g>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div class="andes-list__item-text">
                                <span class="andes-list__item-primary">Agregá tu e-mail</span>
                                <span class="andes-list__item-secondary">Recibirás información de tu cuenta.</span>
                            </div>
                        </div>
                        <div class="andes-list__item-second-column">
                            <div class="andes-list_item-tertiary-container andes-list_item-tertiary-container--top">
                                <span class="andes-list_item-tertiary andes-list_item-tertiary--top">
                                    <button type="button" class="andes-button hub-item__button andes-button--medium andes-button--loud">
                                        <span class="andes-button__content">
                                            <span class="andes-button__text">Agregar</span>
                                        </span>
                                    </button>
                                </span>
                            </div>
                        </div>
                    </li>
                </div>
                <li class="andes-list_item step-listitem andes-listitem--size-medium andes-list_item-with-secondary">
                    <div class="andes-list__item-first-column">
                        <div class="andes-list_item-asset andes-list_item-asset--icon" aria-hidden="true">
                            <div class="thumbnail-congrats">
                                <svg class="thumbnail-pending" viewBox="0 0 100 100">
                                    <circle class="bg" cx="50" cy="50" r="40"></circle>
                                    <circle class="meter" cx="50" cy="50" r="40"></circle>
                                </svg>
                                <div class="asset">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M20.5996 21.6C20.5996 22.9255 19.5251 24 18.1996 24L6.39961 24C5.07412 24 3.99961 22.9255 3.99961 21.6L3.99961 5.4C3.99961 4.07452 5.07413 3 6.39961 3L18.1996 3C19.5251 3 20.5996 4.07452 20.5996 5.4L20.5996 21.6ZM19.1596 21.6L19.1596 5.4C19.1596 4.91059 18.7934 4.50672 18.32 4.44748L18.1996 4.44L6.39961 4.44C5.9102 4.44 5.50633 4.80623 5.44709 5.27958L5.43961 5.4L5.43961 21.6C5.43961 22.0894 5.80583 22.4933 6.27919 22.5525L6.39961 22.56L18.1996 22.56C18.689 22.56 19.0929 22.1938 19.1521 21.7204L19.1596 21.6ZM12.3001 6.19995C14.3909 6.19995 16.0858 7.89487 16.0858 9.98567C16.0858 12.0707 14.4002 13.7621 12.3173 13.7713L15.1907 13.7713C16.5211 13.7713 17.5996 14.9013 17.5996 16.2951L17.5996 16.7999L16.4759 16.7999L16.4759 16.2951C16.4759 15.4589 15.9889 15.2856 15.1907 15.2856L9.39593 15.2856C8.60468 15.2856 8.12775 15.453 8.12775 16.282L8.12775 16.7868L6.99961 16.7868L6.99961 16.282C6.99961 14.8954 8.07248 13.7713 9.39593 13.7713L12.283 13.7713C10.2001 13.7621 8.51441 12.0707 8.51441 9.98567C8.51441 7.89487 10.2093 6.19995 12.3001 6.19995ZM12.3003 7.71413C11.0458 7.71413 10.0288 8.73108 10.0288 9.98556C10.0288 11.24 11.0458 12.257 12.3003 12.257C13.5548 12.257 14.5717 11.24 14.5717 9.98555C14.5717 8.73108 13.5548 7.71413 12.3003 7.71413ZM17.6 19.3198C17.6 18.9056 17.2324 18.5698 16.7789 18.5698L7.82113 18.5698L7.68794 18.5796C7.29778 18.6378 7 18.947 7 19.3198C7 19.734 7.36763 20.0698 7.82113 20.0698L16.7789 20.0698L16.9121 20.06C17.3022 20.0019 17.6 19.6926 17.6 19.3198Z" fill="#3483FA"></path>
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M14.5352 0L15.5958 1.06066L13.1593 3.49713L13.1978 3.53554L12.7333 4H11.4641L10.9996 3.53553L11.038 3.49713L8.60156 1.06067L9.66222 8.79169e-06L12.0987 2.43647L14.5352 0Z" fill="#3483FA"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div class="andes-list__item-text">
                            <span class="andes-list__item-primary">Creá tu contraseña</span>
                            <span class="andes-list__item-secondary">Mantendrás tu cuenta protegida.</span>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    `;
}

// Evento para el botón de búsqueda
document.getElementById('search-button').addEventListener('click', async () => {
    const query = document.getElementById('search-input').value;
    queryActual = query;
    buscarYRenderizarProductos(queryActual, 0, itemsPerPage);
});

// Cargar las categorías y mostrarlas en el menú desplegable
document.addEventListener('DOMContentLoaded', async () => {
    const categories = await fetchCategories();
    renderCategoriesDropdown(categories);

    // Cargar ofertas por defecto en la página de inicio
    queryActual = 'ofertas';
    buscarYRenderizarProductos(queryActual, 0, itemsPerPage);
});

// Otros eventos para los enlaces (se pueden agregar funciones similares para los demás enlaces)
document.getElementById('offers-link').addEventListener('click', async (e) => {
    e.preventDefault();
    queryActual = 'ofertas';
    buscarYRenderizarProductos(queryActual, 0, itemsPerPage);
});

document.getElementById('history-link').addEventListener('click', (e) => {
    e.preventDefault();
    renderViewHistory();
});

document.getElementById('supermarket-link').addEventListener('click', async (e) => {
    e.preventDefault();
    queryActual = 'supermercado';
    buscarYRenderizarProductos(queryActual, 0, itemsPerPage);
});

document.getElementById('fashion-link').addEventListener('click', async (e) => {
    e.preventDefault();
    queryActual = 'moda';
    buscarYRenderizarProductos(queryActual, 0, itemsPerPage);
});

document.getElementById('sell-link').addEventListener('click', async (e) => {
    e.preventDefault();
    queryActual = 'vender';
    buscarYRenderizarProductos(queryActual, 0, itemsPerPage);
});

document.getElementById('help-link').addEventListener('click', (e) => {
    e.preventDefault();
    renderHelpOptions();
});

document.getElementById('login-link').addEventListener('click', (e) => {
    e.preventDefault();
    showLoginForm();
});

document.getElementById('signup-link').addEventListener('click', (e) => {
    e.preventDefault();
    showSignupForm();
});

document.getElementById('purchases-link').addEventListener('click', (e) => {
    document.getElementById('paginacion').style.display = 'none';
    e.preventDefault();
    showLoginForm();
});

document.getElementById('cart-link').addEventListener('click', (e) => {
    e.preventDefault();
    renderCart();
});

async function buscarYRenderizarProductos(query, offset = 0, limit = itemsPerPage, isCategory = false) {
    const data = await searchProducts(query, offset, limit, isCategory);
    renderProducts(data);
}

// Función para obtener detalles del producto
async function getProductDetails(productId) {
    document.getElementById('paginacion').style.display = 'none';
    try {
        const response = await fetch(`https://api.mercadolibre.com/items/${productId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error obteniendo detalles del producto:', error);
        return null;
    }
}

// Función para renderizar historial de navegación (solo ejemplo)
function renderViewHistory() {
    const productContainer = document.getElementById('product-container');
    productContainer.innerHTML = `
        <h2>Historial de navegación</h2>
        <p>Aquí se mostrarán los productos que has visto recientemente.</p>
    `;
}


