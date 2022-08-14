import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
    const [pasteText, setPasteText] = useState<string>("");
    const router = useRouter();
    const createPasteMutation = trpc.useMutation("paste.create");

    const handleSubmit = (e: React.MouseEvent) => {
        e.preventDefault();

        if (pasteText === "") return;

        createPasteMutation.mutate(
            { text: pasteText },
            {
                onSuccess: ({ id }) => {
                    router.push(`/pastes/${id}`);
                },
            }
        );
    };

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
            <button
                className="font-bold px-2 py-1 cursor-pointer mt-4 bg-cyan-700 border-2 border-white rounded-xl w-24 hover:scale-105 hover:bg-cyan-500 d transition-all"
                onClick={e => handleSubmit(e)}
            >
                Submit
            </button>
        </div>
    );
};

export default Home;
