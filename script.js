const container = document.getElementById('pokemon-container');
const buttons = document.querySelectorAll('#generation-buttons button');
const pokedexType = document.getElementById('pokedex-type');

const isLoggedIn = document.body.dataset.logged === "true";
const currentUser = document.body.dataset.usuario || "";
let pokemonsCapturados = [];

// Función para capitalizar con formato bonito
function capitalizar(texto) {
  return texto
    .split('-')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');
}

const generationEndpoints = {
  1: 'https://pokeapi.co/api/v2/generation/1/',
  2: 'https://pokeapi.co/api/v2/generation/2/',
  3: 'https://pokeapi.co/api/v2/generation/3/'
};

// Manejar clics de botones de generación
buttons.forEach(button => {
  button.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    const gen = parseInt(button.getAttribute('data-gen'));
    loadGeneration(gen);
  });
});

// Cambiar tipo de Pokédex
pokedexType.addEventListener('change', () => {
  const active = document.querySelector('#generation-buttons button.active');
  const gen = active ? parseInt(active.dataset.gen) : 1;
  loadGeneration(gen);
});

function loadGeneration(genNumber) {
  container.innerHTML = 'Cargando...';
  const type = pokedexType.value;

  const gensToLoad = type === "nacional"
    ? Array.from({ length: genNumber }, (_, i) => i + 1)
    : [genNumber];

  const queryCapturas = isLoggedIn
    ? fetch(`get_capturas.php?usuario=${currentUser}&generacion=${genNumber}&tipo=${type}`)
        .then(res => res.json())
    : Promise.resolve([]);

  queryCapturas.then(data => {
    if (Array.isArray(data)) {
      pokemonsCapturados = data;
    }

    // Obtener especies
    Promise.all(
      gensToLoad.map(num => fetch(generationEndpoints[num]).then(res => res.json()))
    ).then(async generations => {
      const allSpecies = generations.flatMap(g => g.pokemon_species);

      allSpecies.sort((a, b) => {
        const idA = parseInt(a.url.split('/')[6]);
        const idB = parseInt(b.url.split('/')[6]);
        return idA - idB;
      });

      const pokemons = [];

      for (let species of allSpecies) {
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

        const isCapturado = pokemonsCapturados.some(
          c => c.id_pokemon === pokemon.id && c.id_generacion === genNumber
        );

        const tipos = pokemon.types.map(t => capitalizar(t.type.name)).join(', ');

        const tipoPrincipal = pokemon.types[0].type.name.toLowerCase(); // ej: fire
        card.classList.add(`tipo-${tipoPrincipal}`);


        card.innerHTML = `
          <img src="${pokemon.sprites.front_default}" alt="${capitalizar(pokemon.name)}">
          <div>
            <a href="detalle_pokemon/pokemon.html?name=${pokemon.name}" class="nombre-link">
              <strong>${capitalizar(pokemon.name)}</strong>
            </a>
          </div>
          <div>${tipos}</div>
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
              body: `id_pokemon=${idPokemon}&capturado=${capturado}&id_generacion=${genNumber}`
            });
          });
        });
      }
    });
  });
}

// Inicializar con generación 1 por defecto
document.querySelector('button[data-gen="1"]').classList.add('active');
loadGeneration(1);
