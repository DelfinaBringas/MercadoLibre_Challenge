export function createHeader() {
  const header = document.createElement('header');
  header.innerHTML = `
      <input type="text" id="search-input" placeholder="Buscar productos">
      <button id="search-button">Buscar</button>
  `;
  return header;
}