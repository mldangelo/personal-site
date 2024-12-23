import { useState, useEffect, useCallback, useRef } from 'react';

type SetValue<T> = T | ((prevValue: T) => T);

interface StorageOptions<T> {
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
  validator?: (value: T) => boolean;
  onError?: (error: Error) => void;
}

const defaultSerializer = JSON.stringify;
const defaultDeserializer = JSON.parse;

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: StorageOptions<T> = {}
): [T, (value: SetValue<T>) => void, { error: Error | null; isLoading: boolean }] {
  const {
    serializer = defaultSerializer,
    deserializer = defaultDeserializer,
    validator = () => true,
    onError,
  } = options;

  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const initialValueRef = useRef(initialValue);

  // Get initial value from localStorage or use initialValue
  const getStoredValue = useCallback((): T => {
    if (typeof window === 'undefined') return initialValueRef.current;

    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValueRef.current;

      const parsed = deserializer(item);
      if (!validator(parsed)) {
        throw new Error(`Invalid value stored for key "${key}"`);
      }

      return parsed;
    } catch (error) {
      const typedError = error instanceof Error ? error : new Error(String(error));
      console.warn(`Error reading localStorage key "${key}":${typedError}`);
      onError?.(typedError);
      setError(typedError);
      return initialValueRef.current;
    } finally {
      setIsLoading(false);
    }
  }, [key, deserializer, validator, onError]);

  const [storedValue, setStoredValue] = useState<T>(getStoredValue);

  // Return memoized update function
  const setValue = useCallback(
    (value: SetValue<T>) => {
      try {
        setError(null);
        // Allow value to be a function for previous state pattern
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        if (!validator(valueToStore)) {
          throw new Error('Invalid value provided');
        }

        setStoredValue(valueToStore);

        if (typeof window !== 'undefined') {
          const serialized = serializer(valueToStore);
          window.localStorage.setItem(key, serialized);
        }
      } catch (error) {
        const typedError = error instanceof Error ? error : new Error(String(error));
        console.warn(`Error setting localStorage key "${key}":${typedError}`);
        onError?.(typedError);
        setError(typedError);
      }
    },
    [key, storedValue, serializer, validator, onError]
  );

  // Sync with other tabs/windows
  useEffect(() => {
    function handleStorageChange(event: StorageEvent) {
      if (event.key === key && event.newValue !== null) {
        try {
          const parsed = deserializer(event.newValue);
          if (!validator(parsed)) {
            throw new Error(`Invalid value received from storage event for key "${key}"`);
          }
          setStoredValue(parsed);
          setError(null);
        } catch (error) {
          const typedError = error instanceof Error ? error : new Error(String(error));
          console.warn(`Error parsing localStorage value:${typedError}`);
          onError?.(typedError);
          setError(typedError);
        }
      }
    }

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, deserializer, validator, onError]);

  return [storedValue, setValue, { error, isLoading }];
}
