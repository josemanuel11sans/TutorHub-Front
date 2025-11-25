import { useNavigate } from "react-router-dom";

const useRedirectHome = () => {
  const navigate = useNavigate();

  return () => navigate("/login");
  
};

export default useRedirectHome;
