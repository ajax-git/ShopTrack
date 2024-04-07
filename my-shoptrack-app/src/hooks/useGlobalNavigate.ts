import { useNavigate } from 'react-router-dom';

interface NavigationFunctions {
  goToHome: () => void;
  goToLogin: () => void;
  goToRegister: () => void;
}

export const useGlobalNavigate = (): NavigationFunctions => {
  const navigate = useNavigate();

  const goToHome = () => navigate('/');
  const goToLogin = () => navigate('/account/login');
  const goToRegister = () => navigate('/account/register');

  return { goToHome, goToLogin, goToRegister };
};
