import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { trpc } from "../utils/trpc";
import type { TExpiresIn } from "../utils/types";

const Home: NextPage = () => {
    const [pasteText, setPasteText] = useState<string>("");
    const [passwordText, setPasswordText] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [shouldRequirePassword, setShouldRequirePassword] = useState<boolean>(false);
    const router = useRouter();
    const createPasteMutation = trpc.useMutation("paste.create");
    const selectExpireTimeRef = useRef<HTMLSelectElement>(null);

    const handleSubmit = (e: React.MouseEvent) => {
        e.preventDefault();

        if (pasteText === "") {
            setError("Please enter some text");

            return;
        }
        if (shouldRequirePassword && passwordText === "") {
            setError("Please enter a password");

            return;
        }

        createPasteMutation.mutate(
            {
                text: pasteText,
                expiresIn: selectExpireTimeRef.current?.value as TExpiresIn,
                password: passwordText || undefined,
                locked: shouldRequirePassword,
            },
            {
                onSuccess: ({ id, locked }) => {
                    if (locked) {
                        router.push({
                            pathname: "/pastes/validate",
                            query: { id },
                        });
                    } else {
                        router.push(`/pastes/${id}`);
                    }
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

            {error && <p className="my-2 text-red-500 font-bold">{error}</p>}

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

            <div className="flex flex-col justify-center items-center mt-4">
                <div className="flex justify-center items-center mb-2 gap-1">
                    <p className="font-bold text-sm">Require password</p>
                    <input
                        type="checkbox"
                        onChange={() => setShouldRequirePassword(prev => !prev)}
                        className="cursor-pointer"
                    />
                </div>
                <input
                    type="password"
                    className={`appearance-none transition-opacity duration-200 bg-gray-700 border-2 px-2 text-sm border-white rounded-xl cursor-pointer ${
                        shouldRequirePassword ? "opacity-100" : "opacity-0"
                    }`}
                    name="password"
                    placeholder="Password"
                    required={shouldRequirePassword}
                    value={passwordText}
                    onChange={e => setPasswordText(e.target.value)}
                />
            </div>

            <button
                className="font-bold px-2 py-1 cursor-pointer mt-4 bg-cyan-700 border-2 border-white rounded-xl w-24 hover:scale-105 hover:bg-cyan-500 transition-all"
                disabled={createPasteMutation.isLoading}
                onClick={e => handleSubmit(e)}
            >
                Submit
            </button>
        </div>
    );
};

export default Home;
