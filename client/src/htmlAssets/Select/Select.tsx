import { useState } from 'react';
import styles from './Select.module.css'

interface SelectProps {
  name?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

const SelectElement = (props: SelectProps) => {

  return (
    <select
      id={props.name}
      className={styles.formSelect}
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
    >
      {props.options.map((option) => (
        <option
          className={styles.option}
          key={option}
          value={option}
        >
          {option}
        </option>
      ))}
    </select>
  )
}

export default function App() {

  const [selectValue, setSelectValue] = useState('');
  const handleSelectChange = (value: string) => {
    setSelectValue(value);
  }

  return (
    <SelectElement
      options={['Ordinary', 'Important', 'Critical']}
      value={selectValue}
      onChange={handleSelectChange}
    />
  );
}
