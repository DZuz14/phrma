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
      className="relative cursor-pointer h-72 w-44 mx-auto"
    >
      {/* Bottle Cap */}
      <div
        className="absolute -top-1 left-1/2 -translate-x-1/2 z-10
        w-40 h-7
        bg-indigo-500 rounded-t-xl shadow-md"
      />

      {/* Bottle Body */}
      <div
        className="relative mx-auto
        w-36 h-full
        pt-8
        flex flex-col justify-center items-center
        bg-orange-300/90 
        backdrop-blur-md rounded-xl
        border border-orange-100
        transition-all duration-300 ease-in-out
        shadow-[0_4px_10px_rgba(0,0,0,0.12),inset_0_0_8px_rgba(255,255,255,0.4)]
        hover:border-2
        hover:shadow-[0_4px_15px_rgba(0,0,0,0.15),inset_0_0_8px_rgba(255,255,255,0.4),0_0_10px_rgba(79,70,229,0.2)]"
      >
        {/* Label */}
        <div
          className="mx-auto w-32 py-2 px-3
          bg-white/90 backdrop-blur-sm rounded-md
          border border-gray-100
          shadow-[0_2px_5px_rgba(0,0,0,0.06),inset_0_1px_2px_rgba(0,0,0,0.03)]
          hover:shadow-[0_3px_8px_rgba(0,0,0,0.08),inset_0_1px_2px_rgba(0,0,0,0.03)]
          transition-shadow"
        >
          {/* Prescription Name */}
          <p
            className="text-indigo-800 font-semibold text-sm leading-snug truncate"
            title={name}
          >
            {name}
          </p>

          {/* Prescription Details */}
          <div className="mt-3 space-y-2">
            {/* Quantity */}
            <div className="text-xs space-y-0.5">
              <div className="text-indigo-400 font-medium">Quantity:</div>
              <div className="text-indigo-800 font-medium">{quantity}</div>
            </div>

            {/* Date Filled */}
            <div className="text-xs space-y-0.5">
              <div className="text-indigo-400 font-medium">Filled:</div>
              <div className="text-indigo-800 font-semibold">
                {new Date(dateFilled).toLocaleDateString()}
              </div>
            </div>

            {/* Refills */}
            <div className="text-xs">
              <div className="text-indigo-400 font-medium">Refills:</div>
              <div
                className={`font-medium ${
                  refills === 0 ? 'text-red-500' : 'text-indigo-800'
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
