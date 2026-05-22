import { useLocation } from "react-router-dom";
import GlobalLoading from "@/components/common/GlobalLoading";
import { useLoading } from "@/hooks/useLoading";

const GlobalLoader = ({ children }) => {
  const { loading } = useLoading();
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/login" && loading && <GlobalLoading />}
      {children}
    </>
  );
};

export default GlobalLoader;
