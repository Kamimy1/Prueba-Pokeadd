const container = document.getElementById('pokemon-container');
const buttons = document.querySelectorAll('#generation-buttons button');
const generationEndpoints = {
  1: 'https://pokeapi.co/api/v2/generation/1/',
  2: 'https://pokeapi.co/api/v2/generation/2/',
  3: 'https://pokeapi.co/api/v2/generation/3/'
};

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const gen = button.getAttribute('data-gen');
    loadGeneration(gen);
  });
});

async function loadGeneration(genNumber) {
  container.innerHTML = 'Cargando...';

  try {
    const res = await fetch(generationEndpoints[genNumber]);
    const data = await res.json();
    const speciesList = data.pokemon_species;

    // Ordenar por ID (se extrae de la URL)
    speciesList.sort((a, b) => {
      const idA = parseInt(a.url.split('/')[6]);
      const idB = parseInt(b.url.split('/')[6]);
      return idA - idB;
    });

    const pokemons = [];

    for (let species of speciesList) {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${species.name}`);
        if (res.ok) {
          const data = await res.json();
          pokemons.push(data);
        } else {
          console.warn(`No encontrado: ${species.name}`);
        }
      } catch (err) {
        console.error(`Error con ${species.name}:`, err);
      }
    }

    container.innerHTML = '';
    pokemons.forEach(pokemon => {
      const card = document.createElement('div');
      card.className = 'pokemon-card';
      card.innerHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <div>${pokemon.name}</div>
      `;
      container.appendChild(card);
    });

  } catch (err) {
    container.innerHTML = 'Error al cargar los Pokémon.';
    console.error(err);
  }
}

// Cargar por defecto generación 1
loadGeneration(1);
5