const container = document.getElementById('pokemon-details');
const params = new URLSearchParams(window.location.search);
const name = params.get('name');

if (!name) {
  container.innerHTML = "No se indicó ningún Pokémon.";
}

async function loadPokemon(name) {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const pokemon = await res.json();

    const speciesRes = await fetch(pokemon.species.url);
    const species = await speciesRes.json();

    const evolutionRes = await fetch(species.evolution_chain.url);
    const evolutionChain = await evolutionRes.json();

    const types = pokemon.types.map(t => t.type.name).join(', ');
    const stats = pokemon.stats.map(stat => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('');
    const moves = pokemon.moves.slice(0, 10).map(move => `<li>${move.move.name}</li>`).join('');

    // Obtener la cadena evolutiva (nombres)
    const evolutionNames = [];
    let evo = evolutionChain.chain;
    while (evo) {
      evolutionNames.push(evo.species.name);
      evo = evo.evolves_to[0];
    }

    const evoList = evolutionNames.map(name => `<li>${name}</li>`).join('');

    container.innerHTML = `
      <h1>${pokemon.name}</h1>
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
      <h3>Tipos</h3>
      <p>${types}</p>
      <h3>Estadísticas</h3>
      <ul>${stats}</ul>
      <h3>Movimientos (primeros 10)</h3>
      <ul>${moves}</ul>
      <h3>Cadena evolutiva</h3>
      <ul>${evoList}</ul>
      <a href="../index.html">← Volver</a>
    `;
  } catch (err) {
    console.error(err);
    container.innerHTML = 'Error al cargar los datos del Pokémon.';
  }
}

loadPokemon(name);
