import { useState, ChangeEvent } from 'react';

type FormValues<T> = { [K in keyof T]: T[K] };

type RegisterReturn = {
  name: string;
  value: any;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
};

export const useForm = <T extends Record<string, any>>(initialValues: T) => {
  const [values, setValues] = useState<FormValues<T>>({ ...initialValues });

  const register = (name: keyof T): RegisterReturn => ({
    name: name as string,
    value: values[name],
    onChange: (event) => {
      let value: any = event.target.value;
      if (typeof values[name] === 'number') {
        value = Number(value);
      }
      setValues((prev) => ({ ...prev, [name]: value }));
    }
  });

  const reset = () => setValues({ ...initialValues });

  return { values, register, reset };
};
