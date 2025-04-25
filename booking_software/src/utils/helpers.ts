import { categories } from "@/constants/config"

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)


export const selectOptions = categories.map((c) => ({
  value: c,
  label: capitalize(c)
}))