import * as z from "zod"

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export interface ActionResponse < T = any > {
  success: boolean
  message: string
  errors ? : {
    [K in keyof T] ? : string[]
  }
  inputs ? : T
}
export const formSchema = z.object({
  "DatePicker-1": z.coerce.date().optional(),
  "Select-2": z.string().min(1).optional(),
  "Textarea-3": z.string().optional()
});