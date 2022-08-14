import type { NextPage } from "next";
import { useRouter } from "next/router";

const Paste: NextPage = () => {
    const router = useRouter();

    return <div>paste ID: {router.query.id}</div>;
};

export default Paste;
