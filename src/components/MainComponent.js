const createMainComponent = () => {
    const main = document.createElement('main');
    main.id = 'main-content';
    main.innerHTML = '<h1>Productos</h1>';
    return main;
};

export default createMainComponent;
