import { useId } from "react";

export type SegmentedOption<Value extends string> = {
  value: Value;
  label: string;
};

type SegmentedControlProps<Value extends string> = {
  value: Value;
  legend: string;
  onChange: (value: Value) => void;
  options: SegmentedOption<Value>[];
};

export const SegmentedControl = <Value extends string>(
  props: SegmentedControlProps<Value>,
) => {
  const { value, legend, options, onChange } = props;

  const groupName = useId();

  return (
    <fieldset className="segmented">
      <legend className="visually-hidden">{legend}</legend>
      {options.map((option) => (
        <label key={option.value} className="segmented__option">
          <input
            type="radio"
            name={groupName}
            value={option.value}
            className="visually-hidden"
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />
          <span className="segmented__label">{option.label}</span>
        </label>
      ))}
    </fieldset>
  );
};
