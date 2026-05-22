import { useContext } from "react";
import { LoadingContext } from "@/context/LoadingContextValue";

export const useLoading = () => useContext(LoadingContext);

export default useLoading;
