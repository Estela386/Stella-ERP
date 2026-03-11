export type MessageOption = {
  label: string
  message: string
}

export type Message = {
  id: number
  text?: string
  sender: "user" | "bot"
  type?: "text" | "card" | "options"
  data?: {
    title: string
    description: string
  }
  options?: MessageOption[]
}