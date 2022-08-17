import type { NextPage } from "next";
import { useRouter } from "next/router";

const ErrorPage: NextPage = () => {
    const router = useRouter();

    return (
        <div className="flex flex-col justify-center items-center w-full h-screen bg-gray-800 text-white">
            <p className="text-xl font-bold mb-4">
                Paste not found, please use a <span className="text-cyan-700">valid</span>{" "}
                url and make sure it is not <span className="text-cyan-700">expired</span>
            </p>
            <button
                className="font-bold px-2 py-1 cursor-pointer mt-4 bg-cyan-700 border-2 border-white rounded-xl hover:scale-105 hover:bg-cyan-500 transition-all text-sm"
                onClick={() => router.push("/")}
            >
                Create your own paste here
            </button>
        </div>
    );
};

export default ErrorPage;
