import { Button } from "@material-tailwind/react"; 
import { useAuth } from '../context/AuthContext';
import { useGlobalNavigate } from '../hooks/useGlobalNavigate';

interface NavbarProps {
  onSearchChange: (newSearchTerm: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearchChange }) => {
  const { isLoggedIn, logOut } = useAuth();
  const { goToRegister, goToLogin } = useGlobalNavigate();

  const handleLogout = () => {
    logOut();
    goToLogin();
  };

  return (
    <div className = "navbar">
      <nav className="block w-full max-w-screen-xl px-4 py-3 mx-auto text-white shadow-md rounded-xl bg-gradient-to-tr from-blue-gray-900 to-blue-gray-800">
        <div className="flex flex-wrap items-center justify-between text-white gap-y-4">
          <a href="/" className="mr-4 ml-2 block cursor-pointer py-1.5 font-sans text-base font-semibold leading-relaxed tracking-normal text-inherit antialiased">
            ShopTrack
          </a>
          {isLoggedIn ? (
            <div className="relative flex items-center gap-x-1">
              <button
                className="select-none rounded-lg bg-gradient-to-tr from-red-600 to-red-500 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none lg:inline-block"
                type="button"
                onClick={handleLogout}
              >
                <span>Wyloguj</span>
              </button>
              
              <div className="relative h-10 w-full min-w-[288px]">
                <input
                  type="search"
                  className="peer h-full w-full rounded-[7px] border border-white border-t-transparent bg-transparent px-3 py-2.5 pr-20 font-sans text-sm font-normal  !text-white outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-white focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                  onChange={(e) => onSearchChange(e.target.value)}
                />
                  <label
                    className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight !text-white transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-white before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-white after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-white peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-white peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-white peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                    Szukaj...
                  </label>
                </div>
                <button
                  className="!absolute right-1 top-1 select-none rounded bg-white py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-blue-gray-900 shadow-md shadow-blue-gray-500/10 transition-all hover:shadow-lg hover:shadow-blue-gray-500/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  type="button">
                  Szukaj
                </button>
              </div>
          ) : (
            <div className="relative flex items-center gap-x-1">
              <Button variant="text" size="sm" className="inline-block bg-white" onClick={() => goToLogin()}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <span>Logowanie</span>
              </Button>
              <Button variant="gradient" size="sm" className="lg:inline-block" onClick={() => goToRegister()} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <span>Rejestracja</span>
              </Button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}