import React, { useState } from 'react';
import { loginUser } from '../../api/shoptrackApi';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useGlobalNavigate } from '../../hooks/useGlobalNavigate';

export function Login() {
  const { goToHome } = useGlobalNavigate();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { logIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { token } = await loginUser(login, password);
      localStorage.setItem('token', token);
      logIn();
      goToHome();
    } catch (error) {
      if (error instanceof Error) {
        toast.error((error as Error).message);
      } else {
        toast.error((error as Error).message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <div className="relative flex flex-col text-gray-700 bg-white shadow-lg rounded-xl max-w-md p-8">
        <h4 className="block font-sans text-2xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          Logowanie
        </h4>
        <p className="block mt-1 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
          Wprowadź swoje dane, aby się zalogować.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 mb-2 w-80 sm:w-96">
          {isLoading && (
            <div className="grid min-h-[140px] w-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
              <svg
                className="text-gray-300 animate-spin"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
              >
                <path
                  d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                  stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"
                />
                <path
                  d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                  stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" className="text-gray-900"
                />
              </svg>
            </div>
          )}
          {!isLoading && (
            <div className="flex flex-col gap-6 mb-1">
              <input
                type="text"
                name="login"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Email lub nazwa użytkownika"
                required
                className="peer h-full w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border focus:border-2 focus:border-gray-900 focus:outline-0"
              />
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Hasło"
                required
                className="peer h-full w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border focus:border-2 focus:border-gray-900 focus:outline-0"
              />
            </div>
          )}
          <button
            type="submit"
            className="mt-6 block w-full select-none rounded-lg bg-gray-900 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md transition-all hover:shadow-lg focus:opacity-[0.85] active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50"
          >
            Zaloguj się
          </button>
          <p className="block mt-4 text-center text-base font-normal">
            Nie masz konta?{' '}
            <a href="/account/register" className="font-medium text-gray-900">
              Zarejestruj się
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
