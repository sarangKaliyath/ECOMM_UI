import dayjs from "dayjs";

export const isNewProduct = (createdAt: string) =>
  dayjs().diff(createdAt, "day") <= 15;