interface PrescriptionBottleProps {
  name: string;
  quantity: number;
  dateFilled: string;
  refills: number;
  onClick?: () => void;
}

/**
 * Prescription Bottle Component
 *
 * This component represents a prescription bottle with a name, quantity, date filled, and refills.
 * It displays the prescription details in a bottle-like format with a cap, body, and label.
 *
 */
export const PrescriptionBottle: React.FC<PrescriptionBottleProps> = ({
  name,
  quantity,
  dateFilled,
  refills,
  onClick,
}) => {
  return (
    <div onClick={onClick} className="w-full flex justify-center">
      <div className="w-44 relative cursor-pointer flex flex-col items-center transition-transform hover:scale-105 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        {/* Bottle Cap */}
        <div className="w-full h-7 bg-indigo-500 rounded-t-xl shadow-inner border-b border-indigo-600" />

        {/* Bottle Body */}
        <div className="w-full h-[280px] flex flex-col justify-center items-center bg-orange-300/80 border border-orange-100 rounded-b-xl shadow-xl">
          {/* Label */}
          <div className="w-4/5 p-4 bg-white/90 backdrop-blur-md rounded-md border border-gray-200 shadow-lg">
            {/* Prescription Name */}
            <p
              className="font-bold text-md tracking-tight truncate text-indigo-700"
              title={name}
            >
              {name}
            </p>

            {/* Prescription Details */}
            <div className="mt-4">
              <Detail label="Quantity" value={quantity} />
              <Detail
                label="Filled"
                value={new Date(dateFilled).toLocaleDateString()}
              />
              <Detail
                label="Refills"
                value={refills}
                className={refills === 0 ? 'text-red-500' : 'text-indigo-500'}
                showDivider={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface DetailProps {
  label: string;
  value: string | number;
  showDivider?: boolean;
  className?: string;
}

/**
 * Detail Component
 *
 * This component displays a label and value pair with optional divider
 * and custom styling. For use in PrescriptionBottle component only.
 */
const Detail = ({
  label,
  value,
  showDivider = true,
  className = 'text-indigo-500',
}: DetailProps) => {
  return (
    <>
      <div className="mb-3">
        <div className="text-indigo-500 tracking-wider uppercase text-[10px]">
          {label}:
        </div>
        <div className={`font-semibold text-sm mt-1 ${className}`}>{value}</div>
      </div>
      {showDivider && <div className="h-px bg-indigo-200 mb-3" />}
    </>
  );
};
