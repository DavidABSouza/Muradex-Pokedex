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
                if (!resP.ok || !resE.ok) throw new Error("Pokémon não encontrado");

                const p = await resP.json();
                const e = await resE.json();

                const entrada =
                    e.flavor_text_entries.find((x) => x.language.name === "pt") ||
                    e.flavor_text_entries.find((x) => x.language.name === "en");

                setPokemon(p);
                setDescricao(entrada ? entrada.flavor_text.replace(/[\n\f]/g, " ") : "");
            } catch (err) {
                setErro(err.message);
            }
        }
        carregar();
    }, [id]);

    function menuSound() {
        const snd = new Audio("/Click.mp3");
        snd.play();
        snd.currentTime = 0;
    }

    function clickSound() {
        const snd = new Audio("/Click2.wav");
        snd.play();
        snd.currentTime = 0;
    }


    return (

        <div id="body" data-theme={theme} className=" isolate font-sans">
            {Object.entries(THEMES).map(([key, t]) => (
                <div
                    key={key}
                    className={`absolute inset-0 -z-10 bg-size-[100%_auto] bg-repeat-y bg-top transition-opacity duration-700 ${t.wallpaper} ${theme === key ? "opacity-100" : "opacity-0"}`}
                />
            ))}

            <div id="header" className="grid justify-center rounded-b-2xl pb-5 pt-5 shadow-xl/30 bg-linear-to-b from-white/60 to-white/0 transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-lg">
                <header>
                    <h1 className="flex text-center text-9xl text-primary font-bold text-shadow-lg/30 text-shadow-shade"><img src="https://www.freeiconspng.com/uploads/pokeball-icon-26.png" alt="" className="w-10 h-10 justify-self-end self-center" />{pokemon && (pokemon.name.toUpperCase())}<img src="https://www.freeiconspng.com/uploads/pokeball-icon-26.png" alt="" className="w-10 h-10 justify-self-end self-center" /></h1>
                </header>
            </div>

            <div id="mainContent" className="grid justify-center pt-16 pb-10">

                <div ref={ref} id="dropdownTools" className="fixed left-6 top-32.5 z-50">

                    <button onClick={() => {
                        setOpen((o) => !o)
                        menuSound()
                    }} id="dropdownBtn" className="shadow-xl/30 border-2 border-accent rounded-full bg-linear-to-br from-white/50 to-white/0 transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-lg">
                        <img src="https://frutigeraeroarchive.org/images/icons/windows_vista/vista_book_2.ico" alt="" className="p-2" />
                    </button>

                    <div id="dropdownContent" className={`absolute left-0 top-full mt-2 w-85 grid border-2 border-accent rounded-xl bg-linear-to-br from-white/50 to-white/0 p-4 gap-4 origin-top-left transition-all duration-300 ease-in-out ${open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}`}>
                        <h1 className="flex text-center text-3xl font-semibold text-accent text-shadow-lg/30 text-shadow-shade gap-4">Tools</h1> <hr className="h-2 rounded bg-accent border-0" />
                        <a href="/" className="rounded-xl flex text-start text-3xl font-semibold text-primary text-shadow-lg/30 text-shadow-shade gap-4 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shadow-xl/30 text-shadow-lg">Starter Page <img src="https://www.freeiconspng.com/uploads/pokeball-icon-28.png" alt="" className="w-10 h-10" /></a>
                        <Link href="/MyPokemon" className="rounded-xl flex text-start text-3xl font-semibold text-primary text-shadow-lg/30 text-shadow-shade gap-4 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shadow-xl/30 text-shadow-lg">My Pokémon <img src="https://www.freeiconspng.com/uploads/pokeball-icon-26.png" alt="" className="w-10 h-10 justify-self-end" /></Link>
                        <Link href="/TierLists" className="rounded-xl flex text-start text-3xl font-semibold text-primary text-shadow-lg/30 text-shadow-shade gap-4 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shadow-xl/30 text-shadow-lg">Tier Lists <img src="https://frutigeraeroarchive.org/images/icons/utilities/explorer.ico" alt="" className="w-10 h-10 justify-self-end" /></Link>
                        <Link href="/Notes" className="rounded-xl flex text-start text-3xl font-semibold text-primary text-shadow-lg/30 text-shadow-shade gap-4 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shadow-xl/30 text-shadow-lg">Notes <img src="https://frutigeraeroarchive.org/images/icons/windows_vista/vista_sticky_notes.ico" alt="" className="w-10 h-10 justify-self-end" /></Link>
                        <br />
                        <h1 className="flex text-center text-3xl font-semibold text-accent text-shadow-lg/30 text-shadow-shade gap-4">Website Styles</h1> <hr className="h-2 rounded bg-accent border-0" />
                        <a href="#" onClick={(e) => { e.preventDefault(); changeTheme("aero"); clickSound() }} className="rounded-xl flex text-start text-3xl font-semibold text-indigo-200 text-shadow-lg/30 text-shadow-shade gap-4 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shadow-xl/30 text-shadow-lg">Aero Scape<img src="https://em-content.zobj.net/source/apple/325/bubbles_1fae7.png" alt="" className="w-10 h-10 justify-self-end" /></a>
                        <a href="#" onClick={(e) => { e.preventDefault(); changeTheme("dorfic"); clickSound() }} className="rounded-xl flex text-start text-3xl font-semibold text-orange-400 text-shadow-lg/30 text-shadow-shade gap-4 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shadow-xl/30 text-shadow-lg">DORFic Lounge<img src="https://png.pngtree.com/png-clipart/20250105/original/pngtree-summer-fruit-fresh-orange-half-orange-png-image_6792015.png" alt="" className="w-10 h-10 justify-self-end" /></a>
                        <a href="#" onClick={(e) => { e.preventDefault(); changeTheme("jellyfishes"); clickSound() }} className="rounded-xl flex text-start text-3xl font-semibold text-violet-400 text-shadow-lg/30 text-shadow-shade gap-4 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shadow-xl/30 text-shadow-lg">Violet Jellyfishes<img src="https://png.pngtree.com/png-clipart/20250513/original/pngtree-vibrant-purple-jellyfish-png-image_20957555.png" alt="" className="w-10 h-10 justify-self-end" /></a>
                    </div>

                </div>

                <div id="pokemonContainer" className="w-400 justify-center pt-10 transition-all duration-300 ease-in-out hover:scale-102 shadow-xl/30 bg-linear-to-br from-white/50 to-white/5 rounded-3xl bg-blend-soft-light p-8">

                    {erro && <p className="text-3xl text-primary">{erro}</p>}
                    {!erro && !pokemon && <p className="text-3xl text-primary">Carregando...</p>}

                    {pokemon && (
                        <>
                            <img
                                src={pokemon.sprites.other["official-artwork"].front_default}
                                alt={pokemon.name}
                                className="w-50 h-50 rounded-full bg-linear-to-br from-white/50 to-white/5 overflow-visible shadow-lg justify-center"
                            />

                            <h2 className="capitalize text-5xl font-bold text-primary text-shadow-lg/30 text-shadow-shade pt-6">
                                {pokemon.name} <span className="opacity-60">#{pokemon.id}</span>
                            </h2>

                            <p className="capitalize text-3xl font-semibold text-accent pt-2">
                                {pokemon.types.map((t) => t.type.name).join(" / ")}
                            </p>

                            <p className="text-2xl text-primary pt-4">{descricao}</p>

                            <p className="text-2xl text-primary pt-4">
                                Height: {pokemon.height / 10} m · Weight: {pokemon.weight / 10} kg
                            </p>
                        </>
                    )}

                </div>


            </div>
        </div>
    );
}
