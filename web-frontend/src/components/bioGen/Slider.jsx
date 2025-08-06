import { useState } from "react";

const Slider = ({
  min = 0,
  max = 2,
  step = 0.1,
  defaultValue = 1,
  onChange,
  label,
}) => {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (onChange) onChange(newValue);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
      />
      <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
    </div>
  );
};

export default Slider;
