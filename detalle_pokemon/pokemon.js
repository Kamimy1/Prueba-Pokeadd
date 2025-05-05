function capitalizar(texto) {
  return texto
    .split('-')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');
}

const params = new URLSearchParams(window.location.search);
const nombre = params.get("name");
const contenedor = document.getElementById("pokemon-detalle");

if (!contenedor) {
  console.error("No se encontró el elemento #pokemon-detalle");
  throw new Error("Falta el contenedor en el HTML");
}

if (!nombre) {
  contenedor.innerHTML = "<p>Pokémon no especificado.</p>";
} else {
  fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`)
    .then(res => res.json())
    .then(pokemon => {
      contenedor.innerHTML = `
        <h2>${capitalizar(pokemon.name)}</h2>
        <img src="${pokemon.sprites.front_default}" alt="${capitalizar(pokemon.name)}">

        <h3>Tipos</h3>
        <ul>
          ${pokemon.types.map(t => `<li>${capitalizar(t.type.name)}</li>`).join("")}
        </ul>

        <h3>Estadísticas</h3>
        <ul>
          ${pokemon.stats.map(stat => `<li>${capitalizar(stat.stat.name)}: ${stat.base_stat}</li>`).join("")}
        </ul>

        <h3>Movimientos</h3>
        <table border="1" cellpadding="5">
          <thead>
            <tr>
              <th>Movimiento</th>
              <th>Cómo se aprende</th>
              <th>Nivel</th>
              <th>Versión</th>
            </tr>
          </thead>
          <tbody>
            ${pokemon.moves.map(move => {
              const detalles = move.version_group_details.find(
                v => v.version_group.name === "red-blue" || 
                     v.version_group.name === "gold-silver" || 
                     v.version_group.name === "ruby-sapphire"
              );
              if (!detalles) return "";

              return `
                <tr>
                  <td>${capitalizar(move.move.name)}</td>
                  <td>${capitalizar(detalles.move_learn_method.name)}</td>
                  <td>${detalles.level_learned_at}</td>
                  <td>${capitalizar(detalles.version_group.name)}</td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      `;

      // Cargar cadena evolutiva
      fetch(pokemon.species.url)
        .then(res => res.json())
        .then(species => fetch(species.evolution_chain.url))
        .then(res => res.json())
        .then(evo => {
          const cadena = [];
          let actual = evo.chain;

          do {
            const nombre = actual.species.name;
            const id = actual.species.url.split("/")[6];
            cadena.push({ nombre, id });
            actual = actual.evolves_to[0];
          } while (actual);

          const evoHTML = cadena.map(p =>
            `<div style="display:inline-block; text-align:center; margin:10px;">
              <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png" alt="${capitalizar(p.nombre)}"><br>
              ${capitalizar(p.nombre)}
            </div>`
          ).join("→");

          contenedor.innerHTML += `
            <h3>Cadena evolutiva</h3>
            <div>${evoHTML}</div>
          `;
        });
    })
    .catch(err => {
      console.error(err);
      contenedor.innerHTML = "<p>Error al cargar el Pokémon.</p>";
    });
}
