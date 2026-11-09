'use client';
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { THEMES } from "../../page";

export default function PokeLoader() {

    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const [theme, setTheme] = useState("aero");
    const { id } = useParams();
    const [pokemon, setPokemon] = useState(null);
    const [descricao, setDescricao] = useState("");
    const [erro, setErro] = useState(null);
    const [salvo, setSalvo] = useState(false);
    const [especie, setEspecie] = useState(null);
    const femea = especie ? (especie.gender_rate / 8) * 100 : 0;
    const macho = 100 - femea;
    const [shiny, setShiny] = useState(false);


    useEffect(() => {
        const saved = localStorage.getItem("theme");
        if (saved && THEMES[saved]) setTheme(saved);
    }, []);

    const changeTheme = (key) => {
        setTheme(key);
        localStorage.setItem("theme", key);
    };

    useEffect(() => {
        const onClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        const onKey = (e) => e.key === "Escape" && setOpen(false);
        document.addEventListener("mousedown", onClick);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onClick);
            document.removeEventListener("keydown", onKey);
        };
    }, []);

    useEffect(() => {
        async function carregar() {
            try {
                setPokemon(null);
                setErro(null);

                const [resP, resE] = await Promise.all([
                    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`),
                    fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`),
                ]);
                if (!resP.ok || !resE.ok) throw new Error("Pokémon not found.");

                const p = await resP.json();
                const e = await resE.json();

                const entrada =
                    e.flavor_text_entries.find((x) => x.language.name === "pt") ||
                    e.flavor_text_entries.find((x) => x.language.name === "en");

                setPokemon(p);
                setEspecie(e);
                setDescricao(entrada ? entrada.flavor_text.replace(/[\n\f]/g, " ") : "");
            } catch (err) {
                setErro(err.message);
            }
        }
        carregar();
    }, [id]);

    useEffect(() => {
        if (!pokemon) return;
        const lista = JSON.parse(localStorage.getItem("myPokemon") || "[]");
        setSalvo(lista.some((p) => p.id === pokemon.id));
    }, [pokemon]);

    function alternarSalvo() {
        const lista = JSON.parse(localStorage.getItem("myPokemon") || "[]");
        let nova;

        if (lista.some((p) => p.id === pokemon.id)) {
            nova = lista.filter((p) => p.id !== pokemon.id);
        } else {
            nova = [
                ...lista,
                {
                    id: pokemon.id,
                    nome: pokemon.name,
                    imagem: pokemon.sprites.other["official-artwork"].front_default,
                },
            ];
        }

        localStorage.setItem("myPokemon", JSON.stringify(nova));
        setSalvo(!salvo);
    }

    function WebsiteSoundsystem(audioName) {
        const snd = new Audio(audioName);
        snd.volume = 0.25;
        snd.play();
        snd.currentTime = 0;
    }


    return (

        <div id="body" data-theme={theme} className=" isolate font-sans">
            {Object.entries(THEMES).map(([key, t]) => (
                <div
                    key={key}
                    className={`fixed inset-0 -z-10 bg-size-[100%_auto] bg-repeat-y bg-top transition-opacity duration-700 ${t.wallpaper} ${theme === key ? "opacity-100" : "opacity-0"}`}
                />
            ))}

            <div id="header" className="grid justify-center rounded-b-2xl pb-5 pt-5 shadow-xl/30 bg-linear-to-b from-white/60 to-white/0 transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-lg">
                <header>
                    <h1 className="flex text-center text-9xl text-primary font-bold text-shadow-lg/30 text-shadow-shade"><img src="https://www.freeiconspng.com/uploads/pokeball-icon-26.png" alt="" className="w-10 h-10 justify-self-end self-center" />{pokemon && (pokemon.name.toUpperCase())}<img src="https://www.freeiconspng.com/uploads/pokeball-icon-26.png" alt="" className="w-10 h-10 justify-self-end self-center" /></h1>
                </header>
            </div>

            <div id="mainContent" className="grid justify-center pt-16 pb-10">

                <div id="divBackBtn" className="fixed left-6 top-32.5 z-50">

                    <button id="backBtn" className="shadow-xl/30 border-2 border-accent rounded-full bg-linear-to-br from-white/50 to-white/0 transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-lg">
                        <Link href="/" onClick={() => WebsiteSoundsystem("/Back.mp3")}><img src="https://i.redd.it/vyu0jqsf7ota1.png" alt="" className=" w-15 h-15 p-2" /></Link>
                    </button>

                </div>

                <div id="pokemonContainer" className="w-400 justify-center pt-10 transition-all duration-300 ease-in-out hover:scale-102 shadow-xl/30 bg-linear-to-br from-white/50 to-white/5 rounded-3xl bg-blend-soft-light p-8">

                    {erro && <p className="text-white font-extrabold border-2 border-accent bg-linear-to-b from-white to-sky-400">{erro}</p>}
                    {!erro && !pokemon && <p className="text-white font-extrabold border-2 border-accent bg-linear-to-b from-white to-sky-400">Loading...</p>}

                    {pokemon && (
                        <>
                            <img
                                src={shiny
                                    ? pokemon.sprites.other["official-artwork"].front_shiny
                                    : pokemon.sprites.other["official-artwork"].front_default}
                                alt={pokemon.name}
                                className="w-50 h-50 rounded-full bg-linear-to-br from-white/50 to-white/5 overflow-visible shadow-lg justify-center"
                            />

                            <h2 className="capitalize text-5xl font-bold text-primary text-shadow-lg/30 text-shadow-shade pt-6">
                                {pokemon.name} <span className="opacity-60">#{pokemon.id}</span>
                            </h2>

                            <p className="capitalize text-3xl font-semibold text-accent pt-2">
                                {pokemon.types.map((t) => t.type.name).join(" / ")}
                            </p>

                            <p className="normal-case text-2xl text-primary font-semibold pt-4">Pokedex Entry: "{descricao}"</p>

                            <p className="text-2xl text-primary font-semibold pt-4">
                                Height: {pokemon.height / 10} m · Weight: {pokemon.weight / 10} kg
                            </p>

                            <p className="capitalize text-2xl text-primary font-semibold pt-4">
                                Abilities:{" "}
                                {pokemon.abilities
                                    .map((a) => a.ability.name.replace("-", " ") + (a.is_hidden ? " (hidden)" : ""))
                                    .join(", ")}
                            </p>

                        </>)}
                    {especie && (
                        <>
                            <p className="capitalize text-2xl font-semibold text-primary pt-4">
                                {especie.gender_rate === -1
                                    ? "Gender: Genderless"
                                    : `Gender: ♂ ${macho}% · ♀ ${femea}%`}
                            </p>

                            <p className="capitalize text-2xl font-semibold text-primary pt-4">
                                Habitat: {especie.habitat?.name ?? "unknown"}
                            </p>

                            <p className="capitalize text-2xl font-semibold text-primary pt-4">
                                {especie.is_legendary && "Rarity: Legendary"}
                                {especie.is_mythical && "Rarity: Mythical"}
                            </p>
                        </>
                    )}

                    {pokemon && (
                        <>
                            <div className="grid gap-2 pt-6">
                                {pokemon.stats.map((s) => (
                                    <div key={s.stat.name} className="flex items-center gap-4">
                                        <span className="uppercase w-48 text-xl text-primary font-semibold">{s.stat.name.replace("-", " ")}</span>
                                        <div className="flex-1 h-4 rounded-full bg-white/20">
                                            <div
                                                className="h-4 rounded-full bg-accent"
                                                style={{ width: `${(s.base_stat / 255) * 100}%` }}
                                            />
                                        </div>
                                        <span className="w-12 text-xl text-primary font-semibold">{s.base_stat}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    <div id="buttons" className="flex mt-8">
                        <button
                            className="self-end mr-4 text-primary text-3xl p-4 rounded-3xl font-extrabold border-2 border-accent bg-linear-to-b from-white/70 to-white/10"
                            onClick={() => {
                                setShiny(!shiny);
                                WebsiteSoundsystem("/Shiny.mp3");
                            }}
                        >
                            {shiny ? "✧ Normal" : "✦ Shiny"}
                        </button>

                        <button
                            onClick={() => {
                                const grito = new Audio(pokemon.cries.latest);
                                grito.volume = 0.1;
                                grito.play();
                            }}
                            className="self-end mr-4 text-primary text-3xl p-4 rounded-3xl font-extrabold border-2 border-accent bg-linear-to-b from-white/70 to-white/10"
                        >
                            🕪 Cry
                        </button>

                        <button
                            onClick={() => {
                                alternarSalvo();
                                WebsiteSoundsystem("/Save.mp3");
                            }}
                            className="self-end text-primary text-3xl p-4 rounded-3xl font-extrabold border-2 border-accent bg-linear-to-b from-white/70 to-white/10"
                        >
                            {salvo ? "★ Saved" : "☆ Save Pokémon"}
                        </button>
                    </div>

                </div>


            </div>
        </div>
    );
}
