import { useState, ChangeEvent } from 'react';

type FormValues<T> = { [K in keyof T]: T[K] };

type RegisterReturn<T> = {
  name: string;
  value: T[keyof T];
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
};

export const useForm = <T extends Record<string, unknown>>(
  initialValues: T
) => {
  const [values, setValues] = useState<FormValues<T>>({ ...initialValues });

  const register = <K extends keyof T>(name: K): RegisterReturn<T> => ({
    name: name as string,
    value: values[name],
    onChange: (event) => {
      let value: T[K] | number = event.target.value as T[K];
      if (typeof values[name] === 'number') {
        value = Number(value);
      }
      setValues((prev) => ({ ...prev, [name]: value }));
    }
  });

  const reset = () => setValues({ ...initialValues });

  return { values, register, reset };
};
