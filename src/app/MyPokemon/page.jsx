'use client';
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { THEMES } from "../page";

export default function MyPokemon() {

    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const [theme, setTheme] = useState("aero");
    const [lista, setLista] = useState([]);
    const [carregado, setCarregado] = useState(false);

    useEffect(() => {
        setLista(JSON.parse(localStorage.getItem("myPokemon") || "[]"));
        setCarregado(true);
    }, []);

    function remover(id) {
        const nova = lista.filter((p) => p.id !== id);
        setLista(nova);
        localStorage.setItem("myPokemon", JSON.stringify(nova));
    }

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

    function WebsiteSoundsystem(audioName) {
        const snd = new Audio(audioName);
        snd.volume = 0.25;
        snd.play();
        snd.currentTime = 0;
    }


    return (

        <div id="body" data-theme={theme} className="isolate font-sans">
            {Object.entries(THEMES).map(([key, t]) => (
                <div
                    key={key}
                    className={`fixed inset-0 -z-10 bg-size-[100%_auto] bg-repeat-y bg-top transition-opacity duration-700 ${t.wallpaper} ${theme === key ? "opacity-100" : "opacity-0"}`}
                />
            ))}

            <div id="header" className="grid justify-center rounded-b-2xl pb-5 pt-5 shadow-xl/30 bg-linear-to-b from-white/60 to-white/0 transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-lg">
                <header>
                    <h1 className="flex text-center text-9xl text-primary font-bold text-shadow-lg/30 text-shadow-shade"><img src="https://www.freeiconspng.com/uploads/pokeball-icon-26.png" alt="" className="w-10 h-10 justify-self-end self-center" />YOUR POKÉMON <img src="https://www.freeiconspng.com/uploads/pokeball-icon-26.png" alt="" className="w-10 h-10 justify-self-end self-center" /></h1>
                    <h1 className="text-center text-primary font-bold text-shadow-lg/30 text-shadow-shade">(Your saved Pokémon appear here for easier organization!)</h1>
                </header>
            </div>

            <div id="mainContent" className="grid justify-center pt-16 pb-10">

                <div ref={ref} id="dropdownTools" className="fixed left-6 top-32.5 z-50">

                    <button onClick={() => {
                        setOpen((o) => !o)
                        WebsiteSoundsystem("DropdownClick.mp3")
                    }} id="dropdownBtn" className="shadow-xl/30 border-2 border-accent rounded-full bg-linear-to-br from-white/50 to-white/0 transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-lg">
                        <img src="https://frutigeraeroarchive.org/images/icons/windows_vista/vista_book_2.ico" alt="" className="p-2" />
                    </button>

                    <div id="dropdownContent" className={`absolute left-0 top-full mt-2 w-85 grid border-2 border-accent rounded-xl bg-linear-to-br from-white/50 to-white/0 p-4 gap-4 origin-top-left transition-all duration-300 ease-in-out ${open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}`}>
                        <h1 className="flex text-center text-3xl font-semibold text-accent text-shadow-lg/30 text-shadow-shade gap-4">Tools</h1> <hr className="h-2 rounded bg-accent border-0" />
                        <Link href="/" onMouseEnter={() => WebsiteSoundsystem("/Hover.mp3")} onClick={() => WebsiteSoundsystem("/Enter.mp3")} className="rounded-xl flex text-start text-3xl font-semibold text-primary text-shadow-lg/30 text-shadow-shade gap-4 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shadow-xl/30 text-shadow-lg">Starter Page <img src="https://www.freeiconspng.com/uploads/pokeball-icon-28.png" alt="" className="w-10 h-10" /></Link>
                        <Link href="/MyPokemon" onMouseEnter={() => WebsiteSoundsystem("/Hover.mp3")} onClick={() => WebsiteSoundsystem("/Enter.mp3")} className="rounded-xl flex text-start text-3xl font-semibold text-primary text-shadow-lg/30 text-shadow-shade gap-4 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shadow-xl/30 text-shadow-lg">My Pokémon <img src="https://www.freeiconspng.com/uploads/pokeball-icon-26.png" alt="" className="w-10 h-10 justify-self-end" /></Link>
                        <Link href="/TierLists" onMouseEnter={() => WebsiteSoundsystem("/Hover.mp3")} onClick={() => WebsiteSoundsystem("/Enter.mp3")}  className="rounded-xl flex text-start text-3xl font-semibold text-primary text-shadow-lg/30 text-shadow-shade gap-4 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shadow-xl/30 text-shadow-lg">Tier Lists <img src="https://frutigeraeroarchive.org/images/icons/utilities/explorer.ico" alt="" className="w-10 h-10 justify-self-end" /></Link>
                        <Link href="/Notes" onMouseEnter={() => WebsiteSoundsystem("/Hover.mp3")} onClick={() => WebsiteSoundsystem("/Enter.mp3")} className="rounded-xl flex text-start text-3xl font-semibold text-primary text-shadow-lg/30 text-shadow-shade gap-4 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shadow-xl/30 text-shadow-lg">Notes <img src="https://frutigeraeroarchive.org/images/icons/windows_vista/vista_sticky_notes.ico" alt="" className="w-10 h-10 justify-self-end" /></Link>
                        <br />
                        <h1 className="flex text-center text-3xl font-semibold text-accent text-shadow-lg/30 text-shadow-shade gap-4">Website Styles</h1> <hr className="h-2 rounded bg-accent border-0" />
                        <a href="#" onMouseEnter={() => WebsiteSoundsystem("/Hover.mp3")} onClick={(e) => { e.preventDefault(); changeTheme("aero"); WebsiteSoundsystem("Click2.wav") }} className="rounded-xl flex text-start text-3xl font-semibold text-indigo-200 text-shadow-lg/30 text-shadow-shade gap-4 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shadow-xl/30 text-shadow-lg">Aero Scape<img src="https://em-content.zobj.net/source/apple/325/bubbles_1fae7.png" alt="" className="w-10 h-10 justify-self-end" /></a>
                        <a href="#" onMouseEnter={() => WebsiteSoundsystem("/Hover.mp3")} onClick={(e) => { e.preventDefault(); changeTheme("dorfic"); WebsiteSoundsystem("Click2.wav") }} className="rounded-xl flex text-start text-3xl font-semibold text-orange-400 text-shadow-lg/30 text-shadow-shade gap-4 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shadow-xl/30 text-shadow-lg">DORFic Lounge<img src="https://png.pngtree.com/png-clipart/20250105/original/pngtree-summer-fruit-fresh-orange-half-orange-png-image_6792015.png" alt="" className="w-10 h-10 justify-self-end" /></a>
                        <a href="#" onMouseEnter={() => WebsiteSoundsystem("/Hover.mp3")} onClick={(e) => { e.preventDefault(); changeTheme("jellyfishes"); WebsiteSoundsystem("Click2.wav") }} className="rounded-xl flex text-start text-3xl font-semibold text-violet-400 text-shadow-lg/30 text-shadow-shade gap-4 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shadow-xl/30 text-shadow-lg">Violet Jellyfishes<img src="https://png.pngtree.com/png-clipart/20250513/original/pngtree-vibrant-purple-jellyfish-png-image_20957555.png" alt="" className="w-10 h-10 justify-self-end" /></a>
                    </div>

                </div>

                <main className="p-6 flex flex-col gap-3">
                    {carregado && lista.length === 0 && (
                        <p className="w-250 h-20 text-white text-center text-3xl p-4 font-extrabold border-2 border-accent rounded-3xl bg-linear-to-b from-white/50 to-white/15">You haven't saved any Pokémon yet.</p>
                    )}

                    {lista.map((p) => (
                        <div key={p.id} className="flex items-center w-350 justify-center pt-10 transition-all duration-300 ease-in-out hover:scale-102 shadow-xl/30 bg-linear-to-br from-white/50 to-white/5 rounded-3xl bg-blend-soft-light p-8">
                            <Link onMouseEnter={() => WebsiteSoundsystem("/Hover.mp3")} onClick={() => WebsiteSoundsystem("/Back.mp3")} href={`/PokeLoader/${p.id}`} className="w-350 flex items-center gap-6 rounded-3xl transition-all duration-300 ease-in-out cursor-pointer p-4 text-center text-primary">
                                <img src={p.imagem} alt={p.nome} className="w-24 h-24 object-contain shrink-0" />
                                <p className="capitalize font-semibold text-3xl flex-1">{p.nome}</p>
                                <p className="text-xl opacity-60">#{p.id}</p>
                            </Link>
                            <button onClick={() => {remover(p.id); WebsiteSoundsystem("Remove.mp3");}} className="text-primary text-3xl p-4 rounded-3xl font-extrabold border-2 border-accent bg-linear-to-b from-white/70 to-white/10">
                                Remove
                            </button>
                        </div>
                    ))}
                </main>

            </div>
        </div>
    );
}
