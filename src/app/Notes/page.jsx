"use client";
import Image from "next/image";
import Link from "next/link";

import { useState, useRef, useEffect } from "react";

export const THEMES = {
    aero: { label: "Aero Scape", wallpaper: "bg-[url('/bg-starterpage.png')]" },
    dorfic: { label: "DORFic Lounge", wallpaper: "bg-[url('/bg-dorfic.png')]" },
    jellyfishes: { label: "Jellyfishes Glow", wallpaper: "bg-[url('/bg-jellyfishes.png')]" },
};

export default function Notes() {

    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const [theme, setTheme] = useState("aero");
    const [salvos, setSalvos] = useState([]);
    const [escolhido, setEscolhido] = useState("");
    const [texto, setTexto] = useState("");
    const [notas, setNotas] = useState([]);
    const [carregado, setCarregado] = useState(false);

    useEffect(() => {
        setSalvos(JSON.parse(localStorage.getItem("myPokemon") || "[]"));
        setNotas(JSON.parse(localStorage.getItem("pokeNotes") || "[]"));
        setCarregado(true);
    }, []);


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

    function guardar(nova) {
        setNotas(nova);
        localStorage.setItem("pokeNotes", JSON.stringify(nova));
    }

    function adicionar() {
        const p = salvos.find((s) => String(s.id) === escolhido);
        if (!p || texto.trim() === "") return;

        const nova = {
            id: Date.now(),
            pokemonId: p.id,
            pokemon: p.nome,
            imagem: p.imagem,
            texto: texto.trim(),
            data: new Date().toLocaleDateString("en-EN"),
        };

        guardar([nova, ...notas]);
        setEscolhido("");
        setTexto("");
    }

    function apagar(id) {
        guardar(notas.filter((n) => n.id !== id));
    }


    return (

        <div id="body" data-theme={theme} className="relative isolate font-sans">
            {Object.entries(THEMES).map(([key, t]) => (
                <div
                    key={key}
                    className={`absolute inset-0 -z-10 bg-size-[100%_auto] bg-repeat-y bg-top transition-opacity duration-700 ${t.wallpaper} ${theme === key ? "opacity-100" : "opacity-0"}`}
                />
            ))}

            <div id="header" className="grid justify-center rounded-b-2xl pb-5 pt-5 shadow-xl/30 bg-linear-to-b from-white/60 to-white/0 transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-lg">
                <header>
                    <h1 className="flex text-center text-9xl text-primary font-bold text-shadow-lg/30 text-shadow-shade"><img src="https://frutigeraeroarchive.org/images/icons/windows_vista/vista_sticky_notes.ico" alt="" className="w-10 h-10 justify-self-end self-center" />NOTES <img src="https://frutigeraeroarchive.org/images/icons/windows_vista/vista_sticky_notes.ico" alt="" className="w-10 h-10 justify-self-end self-center" /></h1>
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

                <div id="notesContainer" className="w-275 justify-center pt-10 transition-all duration-300 ease-in-out hover:scale-102 shadow-xl/30 bg-linear-to-br from-white/50 to-white/5 rounded-3xl bg-blend-soft-light p-8">

                    <div id="addNote">

                        <h1 className="pb-4 text-center text-4xl text-primary text-shadow-lg/30 text-shadow-shade font-semibold">Write and Save Notes on any Pokémon You want!</h1>
                        <br />
                        <form action="" className="grid justify-center border-3 border-accent rounded-3xl p-4">

                            <h1 className="text-center text-2xl text-primary font-bold p-1 pb-4 text-shadow-lg/30 justify-self-start">Select the Pokémon:</h1>
                            <select
                                value={escolhido}
                                onChange={(e) => setEscolhido(e.target.value)}
                                className="w-200 text-2xl font-semibold text-primary rounded-l-3xl mr-2 outline-hidden border-3 border-primary p-4"
                            >
                                <option value="" className="text-primary">Select one of your saved Pokémon...</option>
                                {salvos.map((s) => (
                                    <option key={s.id} value={s.id} className="capitalize text-primary">
                                        {s.nome}
                                    </option>
                                ))}
                            </select>
                            {carregado && salvos.length === 0 && (
                                    <p className="text-center text-2xl text-white font-bold p-1 pb-4 text-shadow-lg/30 justify-self-center">
                                        You have no saved Pokémon yet.{" "}
                                        <Link href="/" className="underline">Search for one</Link> and save it first!
                                    </p>
                                )}

                            <br /><br /><br />
                            <h1 className="text-center text-2xl text-primary font-bold p-1 pb-4 text-shadow-lg/30 justify-self-start">Add the Text You want:</h1>
                            <textarea value={texto} onChange={(e) => setTexto(e.target.value)} id="digite-efeito" placeholder="Talk about it..! C'mon!!" required className="w-200 h-50 text-2xl font-semibold text-primary ronded-xl mr-2  outline-hidden border-3 border-primary rounded-3xl p-4"></textarea>

                            <br /><br /><br />
                            <button onClick={adicionar} type="button" id="adicionar" className="w-100 w-bg-linear-to-tl from-sky-400 to-white border-2 border-primary rounded-xl text-3xl text-primary font-bold p-1 cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shadow-xl/30 text-shadow-lg justify-self-center">Add Note!</button>
                        </form>

                    </div>
                </div>
                <br /><br /><br />
                <div id="createdNotes" className="w-275 justify-center pt-10 transition-all duration-300 ease-in-out hover:scale-102 shadow-xl/30 bg-linear-to-br from-white/50 to-white/5 rounded-3xl bg-blend-soft-light p-8">
                    <h1 className="pb-4 text-center text-4xl text-primary text-shadow-lg/30 text-shadow-shade font-semibold">Created Notes: </h1>
                    {notas.map((n) => (
                        <div key={n.id} className="flex gap-4 rounded-xl p-4 bg-white/10">
                            <Link href={`/PokeLoader/${n.pokemonId}`}>
                                <img src={n.imagem} alt={n.pokemon} className="w-20 h-20 object-contain shrink-0" />
                            </Link>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center gap-4">
                                    <h3 className="capitalize text-4xl font-semibold text-primary">{n.pokemon}</h3>
                                    <button className="text-primary font-semibold" onClick={() => apagar(n.id)}>Delete</button>
                                </div>
                                <p className="whitespace-pre-wrap wrap-break-word pt-2 text-accent text-2xl">{n.texto}</p>
                                <p className="text-sm opacity-60 pt-2 text-shade">{n.data}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
