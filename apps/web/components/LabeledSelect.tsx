import { Label } from './Label';
import { Required } from './Required';
import { Select, Props as SelectProps } from './Select';

type Props = SelectProps & {
  labelName: string | JSX.Element;
  isRequired?: boolean;
};

export const LabeledSelect = ({
  opts,
  value,
  name,
  onChange,
  labelName,
  isInvalid = false,
  isRequired = false,
  isMulti = false,
  placeholder = 'Select...',
  isLoading = false,
}: Props): JSX.Element => {
  return (
    <Label
      htmlFor={name}
      _styles={{
        w: 'full',
      }}
    >
      {labelName}
      {isRequired && <Required />}
      <Select
        isLoading={isLoading}
        isMulti={isMulti}
        isInvalid={isInvalid}
        opts={opts as any}
        value={value}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
      />
    </Label>
  );
};
