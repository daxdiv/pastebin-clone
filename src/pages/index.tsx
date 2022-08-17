import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { trpc } from "../utils/trpc";
import type { TExpiresIn } from "../utils/types";

const Home: NextPage = () => {
    const [pasteText, setPasteText] = useState<string>("");
    const router = useRouter();
    const createPasteMutation = trpc.useMutation("paste.create");
    const selectExpireTimeRef = useRef<HTMLSelectElement>(null);

    const handleSubmit = (e: React.MouseEvent) => {
        e.preventDefault();

        if (pasteText === "") return;

        createPasteMutation.mutate(
            {
                text: pasteText,
                expiresIn: selectExpireTimeRef.current?.value as TExpiresIn,
            },
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

            <div className="flex justify-center items-center mt-4 gap-2">
                <p className="font-bold text-sm custom-select-arrow">
                    {" "}
                    {/* class defined in globals.css */}
                    Paste expires in:{" "}
                </p>
                <select
                    className="appearance-none bg-gray-700 border-2 pl-2 pr-4 text-sm border-white text-center font-bold rounded-xl relative cursor-pointer"
                    name="select-expire-time"
                    defaultValue="1h"
                    ref={selectExpireTimeRef}
                >
                    <option value="1h">1 hour</option>
                    <option value="1d">1 day</option>
                    <option value="1w">1 week</option>
                    <option value="1m">1 month</option>
                    <option value="1y">1 year</option>
                </select>
            </div>

            <button
                className="font-bold px-2 py-1 cursor-pointer mt-4 bg-cyan-700 border-2 border-white rounded-xl w-24 hover:scale-105 hover:bg-cyan-500 d transition-all"
                disabled={createPasteMutation.isLoading}
                onClick={e => handleSubmit(e)}
            >
                Submit
            </button>
        </div>
    );
};

export default Home;
