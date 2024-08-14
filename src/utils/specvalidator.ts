import _, { ObjectSchema, ValidationOptions, ValidationResult } from 'joi';

// Define the type for the optionalConfig parameter
interface OptionalConfig extends ValidationOptions {
  throwJoiError?: boolean;
}

export const validateSpec = <T>(
  spec: ObjectSchema<T>,
  data: unknown,
  optionalConfig: OptionalConfig = {}
): T => {
  const { error, value } = spec.validate(data, {
    allowUnknown: true,
    stripUnknown: true,
    errors: {
      wrap: {
        label: '',
      },
    },
    ...optionalConfig,
  }) as ValidationResult<T>;
  if (error) {
    if (optionalConfig.throwJoiError) {
      throw error;
    } else {
      throw new Error(error.message);
    }
  }

  return value;
};

// Type for the asynchronous validation function
export const validateAsyncSpec = async <T>(
  spec: ObjectSchema<T>,
  data: unknown,
  optionalConfig: OptionalConfig = {}
): Promise<T> => {
  try {
    const value = await spec.validateAsync(data, {
      allowUnknown: true,
      stripUnknown: true,
      errors: {
        wrap: {
          label: '',
        },
      },
      ...optionalConfig,
    }) as T;

    return value;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Unknown error occurred');
    }
  }
};
