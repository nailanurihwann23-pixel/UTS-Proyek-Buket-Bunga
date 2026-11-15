/**
 * cartContextDef.js — Definisi React Context untuk Keranjang Belanja
 * Dipisahkan agar file provider tidak mengekspor non-komponen (Fast Refresh)
 */

import { createContext } from 'react';

export const CartContext = createContext(null);
