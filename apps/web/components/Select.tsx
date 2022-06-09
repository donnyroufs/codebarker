import { Select as ReactSelect } from 'chakra-react-select';
import { Option } from '../types';

export type Props = {
  opts: Option[];
  value: string | any[];
  name: string;
  onChange: any;
  isInvalid?: boolean;
  isMulti?: boolean;
  placeholder?: string;
  isLoading?: boolean;
};

export const Select = ({
  isLoading,
  isMulti,
  isInvalid,
  opts,
  value,
  name,
  placeholder,
  onChange,
}: Props): JSX.Element => {
  return (
    <ReactSelect
      isLoading={isLoading}
      isMulti={isMulti}
      isInvalid={isInvalid}
      options={opts as any}
      value={value}
      name={name}
      id={name}
      placeholder={placeholder}
      onChange={onChange}
      chakraStyles={{
        control: (provided) => ({
          ...provided,
          borderColor: 'brand.border',
          backgroundColor: 'brand.700',
          mt: 2,
          _hover: {
            borderColor: 'brand.headerShade',
          },
        }),
        menu: (provided) => ({
          ...provided,
          color: 'brand.text',
          borderColor: 'brand.border',
          boxShadow: 'none',
        }),
        menuList: (provided) => ({
          ...provided,
          borderColor: 'brand.border',
          backgroundColor: 'brand.700',
        }),
        option: (provided) => ({
          ...provided,
          zIndex: 999,
          backgroundColor: 'brand.700',
          _hover: {
            backgroundColor: 'brand.500',
          },
        }),
        dropdownIndicator: (provided) => ({
          ...provided,
          backgroundColor: 'brand.500',
          color: 'white',
        }),
        indicatorSeparator: (provided) => ({
          ...provided,
          borderColor: 'brand.400',
        }),
        multiValue: (provided) => ({
          ...provided,
          background: 'brand.400',
          color: 'brand.text',
        }),
      }}
    />
  );
};
