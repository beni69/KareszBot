import fetch from "node-fetch";

export const download = async (url: string) => (await fetch(url)).buffer();
