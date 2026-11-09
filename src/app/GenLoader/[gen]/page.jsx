'use client';
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { THEMES } from "../../page";

export default function GenLoader() {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const [theme, setTheme] = useState("aero");
    const [erro, setErro] = useState(null);
    const { gen } = useParams();
    const [lista, setLista] = useState([]);
    const [carregando, setCarregando] = useState(true);

    const GERACOES = {
        1: { offset: 0, quantidade: 151 },
        2: { offset: 151, quantidade: 100 },
        3: { offset: 251, quantidade: 135 },
        4: { offset: 386, quantidade: 107 },
        5: { offset: 493, quantidade: 156 },
        6: { offset: 649, quantidade: 72 },
        7: { offset: 721, quantidade: 88 },
        8: { offset: 809, quantidade: 96 },
        9: { offset: 905, quantidade: 120 },
    };

    useEffect(() => {
        const g = GERACOES[gen];
        if (!g) {
            setErro("Geração inválida");
            setCarregando(false);
            return;
        }

        async function carregar() {
            try {
                const res = await fetch(
                    `https://pokeapi.co/api/v2/pokemon?limit=${g.quantidade}&offset=${g.offset}`
                );
                if (!res.ok) throw new Error("Falha ao buscar a PokéAPI");
                const dados = await res.json();

                setLista(
                    dados.results.map((p) => {
                        const id = Number(p.url.split("/").filter(Boolean).pop());
                        return {
                            id,
                            nome: p.name,
                            imagem: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
                        };
                    })
                );
            } catch (e) {
                setErro(e.message);
            } finally {
                setCarregando(false);
            }
        }
        carregar();
    }, [gen]);


    useEffect(() => {
        const saved = localStorage.getItem("theme");
        if (saved && THEMES[saved]) setTheme(saved);
    }, []);

    const changeTheme = (key) => {
        setTheme(key);
        localStorage.setItem("theme", key);
    };


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
                    <h1 className="flex text-center text-9xl text-primary font-bold text-shadow-lg/30 text-shadow-shade"><img src="https://www.freeiconspng.com/uploads/pokeball-icon-26.png" alt="" className="w-10 h-10 justify-self-end self-center" />GENERATION {gen}<img src="https://www.freeiconspng.com/uploads/pokeball-icon-26.png" alt="" className="w-10 h-10 justify-self-end self-center" /></h1>
                </header>
            </div>

            <div id="mainContent" className="grid justify-center pt-16 pb-10">

                <div id="divBackBtn" className="fixed left-6 top-32.5 z-50">

                    <button onClick={() => WebsiteSoundsystem("/Back.mp3")} id="backBtn" className="shadow-xl/30 border-2 border-accent rounded-full bg-linear-to-br from-white/50 to-white/0 transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-lg">
                        <Link href="/"><img src="https://i.redd.it/vyu0jqsf7ota1.png" alt="" className=" w-15 h-15 p-2" /></Link>
                    </button>

                </div>

                {carregando && <p className="text-white font-extrabold border-2 border-accent bg-linear-to-b from-white to-sky-400">Loading...</p>}
                {erro && <p className="text-white font-extrabold border-2 border-accent bg-linear-to-b from-white to-sky-400">{erro}</p>}

                <div className="flex flex-col gap-3 w-full">
                    {lista.map((p) => (
                        <Link key={p.id} onClick={() => WebsiteSoundsystem("/Enter.mp3")} onMouseEnter={() => WebsiteSoundsystem("/Hover.mp3")} href={`/PokeLoader/${p.id}`} className="w-350 flex items-center gap-6 rounded-3xl transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-lg cursor-pointer bg-linear-to-b from-white/50 to-white/20 text-center text-primary">
                            <img src={p.imagem} alt={p.nome} loading="lazy" className="w-40 h-40 object-contain shrink-0" />
                            <p className="capitalize font-semibold text-3xl flex-1">{p.nome}</p>
                            <p className="text-xl opacity-60 pr-4">#{p.id}</p>
                        </Link>
                    ))}
                </div>

            </div>
        </div>
    );
}
