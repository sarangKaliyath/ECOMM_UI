import { useMutation } from "@tanstack/react-query";
import { createOrderApi } from "./api";
import type { CreateOrderResponse } from "./types";

export const useCreateOrder = () =>
  useMutation<CreateOrderResponse, unknown, number>({
    mutationFn: (shippingAddressId) => createOrderApi({ shippingAddressId }),
  });
