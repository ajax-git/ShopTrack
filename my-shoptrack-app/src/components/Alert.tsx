import React, { useState } from 'react';

const Alert = () => {
  const [dismissed, setDismissed] = useState(false);

  const handleClose = () => {
    setDismissed(true);
    document.cookie = "alertDismissed=true; max-age=604800";
  };

  const alertDismissed = document.cookie.includes("alertDismissed=true") || dismissed;

  if (alertDismissed) {
    return null;
  }

  return (
   <><div role="alert" className="relative flex w-full px-4 py-4 mt-auto text-base text-white bg-gray-900 rounded-lg font-regular">
          <div className="mr-12">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" className="w-12 h-12 mb-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25"></path>
              </svg>
              <h6 className="block mb-1 font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-inherit">
                  ShopTrack w fazie testów
              </h6>
              <p className="block font-sans text-sm antialiased font-normal leading-normal text-inherit opacity-80">
                  ShopTrack jest obecnie w fazie testów. W związku z tym mogą wystąpić różne błędy.
              </p>
              <div className="flex gap-3 mt-4">
                  <button onClick={handleClose} className="block font-sans text-sm antialiased font-medium leading-normal text-inherit opacity-80">
                      OKEJ
                  </button>
              </div>
          </div>
      </div><br /></>
  );
};

export default Alert;
