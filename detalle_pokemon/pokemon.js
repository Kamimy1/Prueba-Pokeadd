const container = document.getElementById('pokemon-details');
const params = new URLSearchParams(window.location.search);
const name = params.get('name');

if (!name) {
  container.innerHTML = "No se indicó ningún Pokémon.";
}

// Función para capitalizar
function capitalizar(texto) {
  return texto
    .split('-')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');
}

// Mostrar datos del Pokémon
async function loadPokemon(name) {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const pokemon = await res.json();

    const speciesRes = await fetch(pokemon.species.url);
    const species = await speciesRes.json();

    const evolutionRes = await fetch(species.evolution_chain.url);
    const evolutionChain = await evolutionRes.json();

    const types = pokemon.types.map(t => capitalizar(t.type.name)).join(', ');
    const stats = pokemon.stats.map(stat => `<li>${capitalizar(stat.stat.name)}: ${stat.base_stat}</li>`).join('');

    const tipoPrincipal = pokemon.types[0].type.name.toLowerCase();
    document.body.classList.add(`tipo-${tipoPrincipal}`);

    // Cadena evolutiva
    async function buildEvolutionChainHTML(chain) {
      const evolutionHTML = [];
    
      async function traverse(evo) {
        const speciesName = evo.species.name;
        try {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${speciesName}`);
          const data = await res.json();
    
          evolutionHTML.push(`
            <div class="evo-card">
              <a href="pokemon.html?name=${speciesName}">
                <img src="${data.sprites.front_default}" alt="${capitalizar(speciesName)}">
                <p>${capitalizar(speciesName)}</p>
              </a>
            </div>
          `);
        } catch (err) {
          console.warn(`No se pudo cargar ${speciesName}`);
        }
    
        // Recorrer todos los hijos
        for (const next of evo.evolves_to) {
          await traverse(next);
        }
      }
    
      await traverse(chain);
      return evolutionHTML.join('');
    }

    const evoHTML = await buildEvolutionChainHTML(evolutionChain.chain);

    // Movimientos por generación
    const generationVersionGroups = {
      1: ['red-blue', 'yellow'],
      2: ['gold-silver', 'crystal'],
      3: ['ruby-sapphire', 'emerald', 'firered-leafgreen']
    };

    // PokeApi entiende las generaciones como i, ii, iii
    const generationOrder = ['i', 'ii', 'iii'];
    const romanToNumber = { i: 1, ii: 2, iii: 3 };

    const generationName = species.generation.name.split('-')[1];
    const genIndex = generationOrder.indexOf(generationName);
    const selectedGenerations = generationOrder.slice(0, genIndex + 1).map(roman => romanToNumber[roman]);

    const selectedVersionGroups = selectedGenerations.flatMap(gen => generationVersionGroups[gen]);

    const moveMap = new Map();

    // Filtrar los movimientos por versión
    pokemon.moves.forEach(moveEntry => {
      moveEntry.version_group_details.forEach(versionDetail => {
        if (selectedVersionGroups.includes(versionDetail.version_group.name)) {
          const key = moveEntry.move.name;
          if (!moveMap.has(key)) {
            moveMap.set(key, {
              name: moveEntry.move.name,
              level: versionDetail.level_learned_at,
              method: versionDetail.move_learn_method.name,
              version_group: versionDetail.version_group.name
            });
          }
        }
      });
    });

    const uniqueMoves = Array.from(moveMap.values());

    const movesTable = uniqueMoves.map(move => `
      <tr>
        <td>${capitalizar(move.name)}</td>
        <td>${capitalizar(move.method)}</td>
        <td>${move.level}</td>
      </tr>
    `).join('');

    // HTML para mostrar los datos
    container.innerHTML = `

      <a href="../index.php">← Volver</a>
      <br>
      <h1>${capitalizar(pokemon.name)}</h1>
      <img src="${pokemon.sprites.front_default}" alt="${capitalizar(pokemon.name)}">
      
      <h3>Tipos</h3>
      <p>${types}</p>

      <h3>Estadísticas</h3>
      <ul>${stats}</ul>

      <h3>Cadena evolutiva</h3>
      <div class="evolution-chain">
        ${evoHTML}
      </div>

      <h3>Movimientos aprendidos hasta Generación ${romanToNumber[generationName]}</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Movimiento</th>
            <th>Método</th>
            <th>Nivel</th>
          </tr>
        </thead>
        <tbody>
          ${movesTable}
        </tbody>
      </table>

      <br>
      <a href="../index.php">← Volver</a>
    `;
  } catch (err) {
    console.error(err);
    container.innerHTML = 'Error al cargar los datos del Pokémon.';
  }
}

loadPokemon(name);
