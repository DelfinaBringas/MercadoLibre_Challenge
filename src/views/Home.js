export function createHomeView() {
    const homeView = document.createElement('div');
    homeView.id = 'home-view';
    
    const carousel = document.createElement('div');
    carousel.id = 'carouselExample';
    carousel.className = 'carousel slide';
    carousel.innerHTML = `
        <div class="carousel-inner">
            <div class="carousel-item active">
                <img src="image1.jpg" class="d-block w-100" alt="...">
            </div>
            <div class="carousel-item">
                <img src="image2.jpg" class="d-block w-100" alt="...">
            </div>
            <div class="carousel-item">
                <img src="image3.jpg" class="d-block w-100" alt="...">
            </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
    `;
    
    const icons = document.createElement('div');
    icons.className = 'icon-grid';
    icons.innerHTML = `
        <div class="icon-item">
            <img src="icon1.png" alt="Icon 1">
            <p>Icon 1</p>
        </div>
        <div class="icon-item">
            <img src="icon2.png" alt="Icon 2">
            <p>Icon 2</p>
        </div>
        <div class="icon-item">
            <img src="icon3.png" alt="Icon 3">
            <p>Icon 3</p>
        </div>
    `;

    homeView.appendChild(carousel);
    homeView.appendChild(icons);
    
    return homeView;
}
