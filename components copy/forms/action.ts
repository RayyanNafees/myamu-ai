"use server"
import {
  type ActionResponse,
  formSchema
} from './form-schema';

export const serverAction = async (prevState: ActionResponse | null, data: FormData): Promise < ActionResponse > => {

  const entries = data.entries()
  const rawData = Object.fromEntries(entries) as Record < string,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    any >

    // convert 'on' values to boolean
    for (const key in rawData) {
      if (rawData[key] === 'on') {
        rawData[key] = true
      }
    }

  // validate inputs data with zod schema
  const validatedData = formSchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      message: 'Invalid data',
      errors: validatedData.error.flatten().fieldErrors,
      inputs: rawData,
    }
  }
  // do something with the data
  return {
    success: true,
    message: 'Data saved'
  }
}