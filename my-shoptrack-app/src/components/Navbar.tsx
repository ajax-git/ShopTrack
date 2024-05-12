import React, { useState, useEffect } from 'react';
import { Button, Input } from "@material-tailwind/react"; 
import { useAuth } from '../context/AuthContext';
import { useGlobalNavigate } from '../hooks/useGlobalNavigate';
import { useLocation } from 'react-router-dom';

interface NavbarProps {
  onSearchChange: (newSearchTerm: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearchChange }) => {
  const { isLoggedIn, logOut } = useAuth();
  const { goToRegister, goToLogin } = useGlobalNavigate();
  const [ showSearch, setShowSearch]  = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    setShowSearch(location.pathname === '/');
  }, [location.pathname]);

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
              <Button variant="text" size="sm" className="inline-block bg-white" onClick={() => handleLogout()}  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <span>Wyloguj</span>
              </Button>
              
              <div className="relative flex w-full gap-2 md:w-max">
                {showSearch && (
                  <Input
                    type="search"
                    color="white"
                    label="Szukaj..."
                    className="pr"
                    onChange={(e: any) => onSearchChange(e.target.value)}
                    containerProps={{
                      className: "min-w-[100px]",
                    }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined}    />
                )}
              </div>
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