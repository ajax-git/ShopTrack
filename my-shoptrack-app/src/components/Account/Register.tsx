import React, { useState } from 'react';
import { registerUser } from '../../api/shoptrackApi';
import { useGlobalNavigate } from '../../hooks/useGlobalNavigate';

interface FormData {
  name: string;
  email: string;
  password: string;
}

export function Register() {
  const { goToHome } = useGlobalNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: ''
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

  await registerUser(formData);

  setFormData({ name: '', email: '', password: '' });

  goToHome();
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <div className="relative flex flex-col text-gray-700 bg-white shadow-lg rounded-xl max-w-md p-8">
      <h4 className="block font-sans text-2xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
        Zarejestruj się
      </h4>
      <p className="block mt-1 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
        Miło mi cię poznać! Wprowadź swoje dane, aby się zarejestrować.
      </p>
      <form onSubmit={handleSubmit} className="max-w-screen-lg mt-8 mb-2 w-80 sm:w-96">
        <div className="flex flex-col gap-6 mb-1">
          <input
            name="name"
            value={formData.name}
            onChange={onChange}
            placeholder="Nazwa użytkownika"
            required
            className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
          />
          <input
            name="email"
            type='email'
            value={formData.email}
            onChange={onChange}
            placeholder="Adres email"
            required
            className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={onChange}
            placeholder="Hasło"
            required
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
            title="Hasło musi zawierać co najmniej 8 znaków, w tym przynajmniej jedną dużą literę, jedną małą literę i jedną cyfrę."
            className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent !border-t-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
          />
        </div>
        <button
          type="submit"
          className="mt-6 block w-full select-none rounded-lg bg-gray-900 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        >
          Sign Up
        </button>
        <p className="block mt-4 font-sans text-base antialiased font-normal leading-relaxed text-center text-gray-700">
          Posiadasz już konto?{' '}
          <a href="/account/login" className="font-medium text-gray-900">
            Zaloguj się
          </a>
        </p>
      </form>
    </div>
    </div>
  );
}
