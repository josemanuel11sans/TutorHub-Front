import { useNavigate } from "react-router-dom";

const useRedirectHome = () => {
  const navigate = useNavigate();

  return () => navigate("/");
  
};

export default useRedirectHome;
