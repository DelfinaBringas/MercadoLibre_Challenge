import { createHeader } from './components/Header.js';
import createMainComponent from './components/MainComponent.js';
import { createHomeView } from './views/Home.js';

const routes = {
    '#inicio': createHomeView,
};

const loadRoute = () => {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = ''; // Clear current content

    const viewCreator = routes[window.location.hash] || createHomeView;
    mainContent.appendChild(viewCreator());
};

export const initializeApp = () => {
    const app = document.getElementById('app');
    app.appendChild(createHeader());
    app.appendChild(createMainComponent());
    app.appendChild(createFooter());

    window.addEventListener('hashchange', loadRoute);
    window.addEventListener('load', loadRoute); // Load the initial route
};
