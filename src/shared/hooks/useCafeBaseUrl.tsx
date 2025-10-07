
import { useAtom } from "jotai";
import { apiUrlAtom } from "../atom";

export function useCafeBaseUrl() {
    const [apiUrl] = useAtom(apiUrlAtom);
    return apiUrl;
}