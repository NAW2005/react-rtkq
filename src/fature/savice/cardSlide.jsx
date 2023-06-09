import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  cartItems: [],
  totalAmount: 0,
};
const stroage_KEY = "cartItems";
const storedItems = Cookies.get(stroage_KEY);

function calculateTotalAmount(cartItems) {
  return cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
}

if (storedItems) {
  initialState.cartItems = JSON.parse(storedItems);
  initialState.totalAmount = calculateTotalAmount(initialState.cartItems);
}

export const cardSlide = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, { payload }) => {
      const isExisted = state.cartItems.find((item) => item.id === payload.id);
      if (isExisted) {
        return state;
      } else {
        state.cartItems = [...state.cartItems, { ...payload, quantity: 1 }];
      }
      state.totalAmount = calculateTotalAmount(state.cartItems);
      Cookies.set(stroage_KEY, JSON.stringify(state.cartItems));
    },

    removefromCart: (state, { payload }) => {
      state.cartItems = state.cartItems.filter((i) => i.id !== payload.id);
      state.quantity--;
      state.totalAmount -= payload.price * payload.quantity;

      state.totalAmount = calculateTotalAmount(state.cartItems);
      Cookies.set(stroage_KEY, JSON.stringify(state.cartItems));
    },

    addItemsQuantity: (state, { payload }) => {
      const data = state.cartItems.map((i) => {
        if (i.id === payload.id) {
          return { ...i, quantity: i.quantity + 1 };
        } else {
          return i;
        }
      });
      state.cartItems = data;
      state.totalAmount = calculateTotalAmount(data);
      Cookies.set(stroage_KEY, JSON.stringify(state.cartItems));
    },

    deleteItemsQuantity: (state, { payload }) => {
      const data = state.cartItems.map((i) => {
        if (i.id === payload.id && i.quantity > 1) {
          return { ...i, quantity: i.quantity - 1 };
        } else {
          return i;
        }
      });
      state.cartItems = data;
      if (payload.quantity !== 1) {
        state.totalAmount -= payload.price;
      }
      Cookies.set(stroage_KEY, JSON.stringify(state.cartItems));
    },
  },
});

export const {
  addToCart,
  removefromCart,
  addItemsQuantity,
  deleteItemsQuantity,
} = cardSlide.actions;
export default cardSlide.reducer;
