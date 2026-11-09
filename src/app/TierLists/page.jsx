'use client';
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { THEMES } from "../page";
import { toPng } from 'html-to-image';

const TIERS = [
    { letra: "S", cor: "from-red-500 to-red-500/40" },
    { letra: "A", cor: "from-orange-500 to-orange-500/40" },
    { letra: "B", cor: "from-yellow-500 to-yellow-500/40" },
    { letra: "C", cor: "from-lime-500 to-lime-500/40" },
    { letra: "D", cor: "from-green-500 to-green-500/40" },
    { letra: "F", cor: "from-indigo-500 to-indigo-500/40" },
];

const LETRAS = TIERS.map((t) => t.letra);
const TIERS_VAZIAS = { S: [], A: [], B: [], C: [], D: [], F: [] };

function CartaoPokemon({ p }) {
    return (
        <img
            src={p.imagem}
            alt={p.nome}
            crossOrigin="anonymous"   // necessário para a exportação em imagem
            draggable                 // permite agarrar e arrastar
            onDragStart={(e) => e.dataTransfer.setData("text/plain", String(p.id))}
            className="w-30 h-30 object-contain cursor-grab"
        />
    );
}

export default function TierLists() {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const [theme, setTheme] = useState("aero");

    const [salvos, setSalvos] = useState([]);
    const [tiers, setTiers] = useState(TIERS_VAZIAS);
    const [nome, setNome] = useState("");
    const [carregado, setCarregado] = useState(false);
    const areaRef = useRef(null);

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
        setSalvos(JSON.parse(localStorage.getItem("myPokemon") || "[]"));

        const guardada = JSON.parse(localStorage.getItem("tierList") || "null");
        if (guardada) {
            setTiers(guardada.tiers);
            setNome(guardada.nome);
        }
        setCarregado(true);
    }, []);

    useEffect(() => {
        if (!carregado) return;
        localStorage.setItem("tierList", JSON.stringify({ nome, tiers }));
    }, [nome, tiers, carregado]);

    function mover(id, destino) {
        setTiers((atual) => {
            const novo = {};

            for (const t of LETRAS) novo[t] = atual[t].filter((x) => x !== id);

            if (destino !== "pool") novo[destino] = [...novo[destino], id];
            return novo;
        });
    }

    useEffect(() => {
        const aoArrastar = (e) => {
            const margem = 150;
            const vel = 5;
            if (e.clientY < margem) window.scrollBy(0, -vel);
            else if (window.innerHeight - e.clientY < margem) window.scrollBy(0, vel);

            if (e.clientX < margem) window.scrollBy(-vel, 0);
            else if (window.innerWidth - e.clientX < margem) window.scrollBy(vel, 0);
        };
        window.addEventListener("dragover", aoArrastar);
        return () => window.removeEventListener("dragover", aoArrastar);
    }, []);

    function aoSoltar(e, destino) {
        e.preventDefault();
        const id = Number(e.dataTransfer.getData("text/plain"));
        if (id) mover(id, destino);
    }

    async function salvarImagem() {
        if (!areaRef.current) {
            alert("Falta ligar o ref: ponha ref={areaRef} na div #tierList");
            return;
        }
        try {
            const url = await toPng(areaRef.current, {
                backgroundColor: "primary",
                pixelRatio: 2,
                cacheBust: true,
            });
            const a = document.createElement("a");
            a.download = `${nome.trim() || "tier-list"}.png`;
            a.href = url;
            a.click();
            WebsiteSoundsystem("/Save.mp3");
        } catch (err) {
            console.error("Erro ao gerar a imagem:", err);
            alert("Não foi possível gerar a imagem. Abra o console (F12) para ver o erro.");
        }
    }

    function WebsiteSoundsystem(audioName) {
        const snd = new Audio(audioName);
        snd.volume = 0.25;
        snd.play();
        snd.currentTime = 0;
    }

    const porId = Object.fromEntries(salvos.map((p) => [p.id, p]));
    const colocados = new Set(LETRAS.flatMap((t) => tiers[t]));
    const naoColocados = salvos.filter((p) => !colocados.has(p.id));

    return (

        <div id="body" data-theme={theme} className="relative isolate font-sans">
            {Object.entries(THEMES).map(([key, t]) => (
                <div
                    key={key}
                    className={`fixed inset-0 -z-10 bg-size-[100%_auto] bg-repeat-y bg-top transition-opacity duration-700 ${t.wallpaper} ${theme === key ? "opacity-100" : "opacity-0"}`}
                />
            ))}

            <div id="header" className="grid justify-center rounded-b-2xl pb-5 pt-5 shadow-xl/30 bg-linear-to-b from-white/60 to-white/0 transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-lg">
                <header>
                    <h1 className="flex text-center text-9xl text-primary font-bold text-shadow-lg/30 text-shadow-shade"><img src="https://frutigeraeroarchive.org/images/icons/utilities/explorer.ico" alt="" className="w-10 h-10 justify-self-end self-center" />TIER LISTS <img src="https://frutigeraeroarchive.org/images/icons/utilities/explorer.ico" alt="" className="w-10 h-10 justify-self-end self-center" /></h1>
                    <h1 className="text-center text-primary font-bold text-shadow-lg/30 text-shadow-shade">(Your Pokémon appear at the very bottom. Drag them, give the tier list a name and save it as an image!)</h1>
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
                        <Link href="/TierLists" onMouseEnter={() => WebsiteSoundsystem("/Hover.mp3")} onClick={() => WebsiteSoundsystem("/Enter.mp3")} className="rounded-xl flex text-start text-3xl font-semibold text-primary text-shadow-lg/30 text-shadow-shade gap-4 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shadow-xl/30 text-shadow-lg">Tier Lists <img src="https://frutigeraeroarchive.org/images/icons/utilities/explorer.ico" alt="" className="w-10 h-10 justify-self-end" /></Link>
                        <Link href="/Notes" onMouseEnter={() => WebsiteSoundsystem("/Hover.mp3")} onClick={() => WebsiteSoundsystem("/Enter.mp3")} className="rounded-xl flex text-start text-3xl font-semibold text-primary text-shadow-lg/30 text-shadow-shade gap-4 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shadow-xl/30 text-shadow-lg">Notes <img src="https://frutigeraeroarchive.org/images/icons/windows_vista/vista_sticky_notes.ico" alt="" className="w-10 h-10 justify-self-end" /></Link>
                        <br />
                        <h1 className="flex text-center text-3xl font-semibold text-accent text-shadow-lg/30 text-shadow-shade gap-4">Website Styles</h1> <hr className="h-2 rounded bg-accent border-0" />
                        <a href="#" onMouseEnter={() => WebsiteSoundsystem("/Hover.mp3")} onClick={(e) => { e.preventDefault(); changeTheme("aero"); WebsiteSoundsystem("Click2.wav") }} className="rounded-xl flex text-start text-3xl font-semibold text-indigo-200 text-shadow-lg/30 text-shadow-shade gap-4 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shadow-xl/30 text-shadow-lg">Aero Scape<img src="https://em-content.zobj.net/source/apple/325/bubbles_1fae7.png" alt="" className="w-10 h-10 justify-self-end" /></a>
                        <a href="#" onMouseEnter={() => WebsiteSoundsystem("/Hover.mp3")} onClick={(e) => { e.preventDefault(); changeTheme("dorfic"); WebsiteSoundsystem("Click2.wav") }} className="rounded-xl flex text-start text-3xl font-semibold text-orange-400 text-shadow-lg/30 text-shadow-shade gap-4 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shadow-xl/30 text-shadow-lg">DORFic Lounge<img src="https://png.pngtree.com/png-clipart/20250105/original/pngtree-summer-fruit-fresh-orange-half-orange-png-image_6792015.png" alt="" className="w-10 h-10 justify-self-end" /></a>
                        <a href="#" onMouseEnter={() => WebsiteSoundsystem("/Hover.mp3")} onClick={(e) => { e.preventDefault(); changeTheme("jellyfishes"); WebsiteSoundsystem("Click2.wav") }} className="rounded-xl flex text-start text-3xl font-semibold text-violet-400 text-shadow-lg/30 text-shadow-shade gap-4 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shadow-xl/30 text-shadow-lg">Violet Jellyfishes<img src="https://png.pngtree.com/png-clipart/20250513/original/pngtree-vibrant-purple-jellyfish-png-image_20957555.png" alt="" className="w-10 h-10 justify-self-end" /></a>
                    </div>
                </div>

                <div className="grid grid-cols-2 mb-8 p-2">
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="✏️Name Your Tier List..."
                        className="underline underline-offset-4 justify-self-start w-100 text-2xl font-semibold text-primary mr-2 outline-hidden border-3 border-primary rounded-3xl p-4"
                    />
                    <button onClick={() => { salvarImagem(); }} className="justify-self-end w-50 bg-linear-to-tl from-sky-400 to-white border-2 border-primary rounded-xl text-3xl text-primary font-bold p-1 cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg shadow-xl/30 text-shadow-lg text-center"><h1 className="grid">Save Image</h1></button>
                </div>

                <div id="tierListsContainer" className="border-3 border-accent w-400 grid pt-16 transition-all duration-300 ease-in-out hover:scale-102 shadow-xl/30 bg-linear-to-br from-white/50 to-white/5 rounded-3xl bg-blend-soft-light p-8">

                    <br />
                    <div id="tierList" ref={areaRef} className="justify-self-center w-350 shadow-xl/30 bg-linear-to-br from-white/50 to-white/5 rounded-3xl bg-blend-soft-light p-10">

                        {nome.trim() !== "" && (
                            <h2 className="whitespace-pre-wrap wrap-break-word text-center text-6xl font-bold text-primary pb-8">{nome}</h2>
                        )}

                        <div className="grid gap-6 justify-center">
                            {TIERS.map(({ letra, cor }) => (
                                <div
                                    key={letra}
                                    id={`rank${letra}`}
                                    className="flex w-300 shadow-xl/30 bg-linear-to-br from-white/50 to-white/5 rounded-3xl bg-blend-soft-light"
                                >
                                    {/* Quadrado colorido com a letra */}
                                    <p className={`bg-linear-to-br ${cor} w-35 h-35 shrink-0 text-center text-6xl text-white content-center rounded-3xl`}>
                                        {letra}
                                    </p>

                                    {/* Zona onde se solta os Pokémon */}
                                    <div
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={(e) => aoSoltar(e, letra)}
                                        className="flex-1 flex flex-wrap items-center gap-2 p-2"
                                    >
                                        {tiers[letra]
                                            .map((id) => porId[id])
                                            .filter(Boolean)
                                            .map((p) => (
                                                <CartaoPokemon key={p.id} p={p} />
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>


                    <br /><br />

                </div>

                <div id="pokemonContainerRankable" className="mt-5 w-400 justify-center pt-10 transition-all duration-300 ease-in-out shadow-xl/30 bg-linear-to-br from-white/50 to-white/5 rounded-3xl bg-blend-soft-light p-16">
                    <h1 className="pb-4 text-center text-4xl text-primary text-shadow-lg/30 text-shadow-shade font-semibold">
                        All of Your Pokémon Will Appear Here!
                    </h1>

                    <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => aoSoltar(e, "pool")}
                        className="flex flex-wrap justify-center gap-3 min-h-32"
                    >
                        {carregado && salvos.length === 0 && (
                            <p className="text-2xl text-primary">
                                You have no saved Pokémon yet.{" "}
                                <Link href="/" className="underline">Search for one</Link> and save it first!
                            </p>
                        )}

                        {naoColocados.map((p) => (
                            <CartaoPokemon key={p.id} p={p} />
                        ))}

                    </div>
                </div>
            </div>
        </div>
    );
}