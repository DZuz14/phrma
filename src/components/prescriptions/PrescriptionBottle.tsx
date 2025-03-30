import React from 'react';

interface PrescriptionBottleProps {
  name: string;
  quantity: number;
  dateFilled: string;
  refills: number;
  onClick?: () => void;
}

/**
 * Prescription Bottle Component
 * Displays a prescription bottle with details
 * and handles click events for detail view
 */
export const PrescriptionBottle: React.FC<PrescriptionBottleProps> = ({
  name,
  quantity,
  dateFilled,
  refills,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="relative group cursor-pointer transition-transform hover:-translate-y-1 hover:scale-105 active:scale-100"
    >
      {/* Bottle Cap */}
      <div
        className="absolute -top-1 left-1/2 -translate-x-1/2 z-10
        w-28 sm:w-32 lg:w-36 h-5 sm:h-6
        bg-indigo-500 rounded-t-xl shadow-md"
      />

      {/* Bottle Body */}
      <div
        className="relative mx-auto
        w-24 sm:w-28 lg:w-32 h-44 sm:h-52 lg:h-56
        pt-6 sm:pt-8
        bg-orange-300/90 
        backdrop-blur-md rounded-xl
        border border-orange-300/20
        transition-all duration-300 ease-in-out
        group-hover:border-orange-100
        shadow-[0_4px_10px_rgba(0,0,0,0.12),inset_0_0_8px_rgba(255,255,255,0.4)]
        group-hover:shadow-[0_6px_15px_rgba(0,0,0,0.18),inset_0_0_12px_rgba(255,255,255,0.5)]"
      >
        {/* Label */}
        <div
          className="absolute top-[55%] left-1/2 transform -translate-x-1/2 -translate-y-1/2
          w-[85%] sm:w-[90%] p-2 sm:p-3.5
          bg-white backdrop-blur-sm rounded-md
          border border-gray-100
          transition-all duration-300
          group-hover:border-white
          shadow-[0_2px_5px_rgba(0,0,0,0.06)]
          group-hover:shadow-[0_4px_10px_rgba(0,0,0,0.08)]"
        >
          {/* Prescription Name */}
          <p
            className="text-indigo-900 font-semibold text-sm sm:text-sm leading-snug truncate"
            title={name}
          >
            {name}
          </p>

          {/* Prescription Details */}
          <div className="mt-2.5 sm:mt-3 space-y-1.5 sm:space-y-2 tracking-normal">
            {/* Quantity */}
            <div className="text-lg sm:text-xs space-y-0.5">
              <div className="text-indigo-400 font-medium">Quantity:</div>
              <div className="text-indigo-900 font-medium">{quantity}</div>
            </div>

            {/* Date Filled */}
            <div className="text-sm text-xs space-y-0.5">
              <div className="text-indigo-400 font-medium">Filled:</div>
              <div className="text-indigo-900 font-semibold">
                {new Date(dateFilled).toLocaleDateString()}
              </div>
            </div>

            {/* Refills */}
            <div className="text-[10px] sm:text-xs">
              <div className="text-indigo-400 font-medium">Refills:</div>
              <div
                className={`font-medium${
                  refills === 0 ? 'text-red-500' : 'text-indigo-900'
                }`}
              >
                {refills}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
