import type { NextPage } from "next";
import { useState } from "react";

const Home: NextPage = () => {
    const [pasteText, setPasteText] = useState<string>("");

    return (
        <div className="flex flex-col justify-center items-center w-full h-screen bg-gray-800 text-white">
            <h1 className="font-bold mb-4 text-3xl">Pastebin clone</h1>
            <textarea
                rows={10}
                cols={50}
                value={pasteText}
                onChange={e => setPasteText(e.target.value)}
                className="p-2 bg-gray-700 border-2 border-white rounded-md"
            ></textarea>
            <button className="font-bold px-2 py-1 cursor-pointer mt-4 bg-cyan-700 border-2 border-white rounded-xl w-24 hover:scale-105 hover:bg-cyan-500 d transition-all">
                Submit
            </button>
        </div>
    );
};

export default Home;
