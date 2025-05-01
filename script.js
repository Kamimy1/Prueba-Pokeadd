const container = document.getElementById('pokemon-container');
const buttons = document.querySelectorAll('#generation-buttons button');

const isLoggedIn = document.body.dataset.logged === "true";
const currentUser = document.body.dataset.usuario || "";
let pokemonsCapturados = [];

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const gen = button.getAttribute('data-gen');
    loadGeneration(gen);
  });
});

const generationEndpoints = {
  1: 'https://pokeapi.co/api/v2/generation/1/',
  2: 'https://pokeapi.co/api/v2/generation/2/',
  3: 'https://pokeapi.co/api/v2/generation/3/'
};

function loadGeneration(genNumber) {
  container.innerHTML = 'Cargando...';

  fetch(generationEndpoints[genNumber])
    .then(res => res.json())
    .then(async data => {
      const speciesList = data.pokemon_species;

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
          }
        } catch (err) {
          console.warn("Error con " + species.name);
        }
      }

      container.innerHTML = '';
      pokemons.forEach(pokemon => {
        const card = document.createElement('div');
        card.className = 'pokemon-card';

        const isCapturado = pokemonsCapturados.includes(pokemon.id);

        card.innerHTML = `
          <a href="detalle_pokemon/pokemon.html?name=${pokemon.name}" class="card-link">
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <div>${pokemon.name}</div>
          </a>
          ${isLoggedIn ? `
            <label>
              <input type="checkbox" class="captura-checkbox" data-id="${pokemon.id}" ${isCapturado ? 'checked' : ''}>
              Capturado
            </label>` : ''}
        `;

        container.appendChild(card);
      });

      if (isLoggedIn) {
        document.querySelectorAll('.captura-checkbox').forEach(cb => {
          cb.addEventListener('change', e => {
            const idPokemon = e.target.dataset.id;
            const capturado = e.target.checked;

            fetch('captura.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: `id_pokemon=${idPokemon}&capturado=${capturado}`
            });
          });
        });
      }
    });
}

// Inicializar (cargar generación 1)
if (isLoggedIn) {
  fetch(`get_capturas.php?usuario=${currentUser}`)
    .then(res => res.json())
    .then(data => {
      pokemonsCapturados = data;
      loadGeneration(1);
    })
    .catch(err => {
      console.error("Error al cargar capturas:", err);
      loadGeneration(1);
    });
} else {
  loadGeneration(1);
}
