const data = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20&offset=20")
const pokemons = await data.json()
console.log(pokemons)
console.log(pokemons.results)