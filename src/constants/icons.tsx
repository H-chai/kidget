import type { ComponentType } from "react";
import {
  MdOutlineCleaningServices,
  MdOutlineDryCleaning,
  MdOutlineLocalLaundryService,
  MdOutlineFastfood,
  MdOutlineShoppingCart,
  MdCheckCircleOutline,
} from "react-icons/md";
import { PiCookingPotBold, PiTShirt } from "react-icons/pi";
import { FaRegTrashAlt } from "react-icons/fa";
import { ImSpoonKnife } from "react-icons/im";
import { GiVacuumCleaner } from "react-icons/gi";
import { RiPlantLine } from "react-icons/ri";

export type TransactionIconDef = {
  id: string;
  Component: ComponentType<{ size?: number; color?: string }>;
  bg: string;
  color: string;
};

export const TRANSACTION_ICONS: TransactionIconDef[] = [
  {
    id: "cleaning",
    Component: MdOutlineCleaningServices,
    bg: "#3c87d5",
    color: "#ffffff",
  },
  {
    id: "drycleaning",
    Component: MdOutlineDryCleaning,
    bg: "#a057e0",
    color: "#ffffff",
  },
  {
    id: "laundry",
    Component: MdOutlineLocalLaundryService,
    bg: "#0891B2",
    color: "#ffffff",
  },
  {
    id: "cooking",
    Component: PiCookingPotBold,
    bg: "#f18334",
    color: "#ffffff",
  },
  {
    id: "fastfood",
    Component: MdOutlineFastfood,
    bg: "#f15034",
    color: "#ffffff",
  },
  {
    id: "shopping",
    Component: MdOutlineShoppingCart,
    bg: "#eed21e",
    color: "#ffffff",
  },
  { id: "tshirt", Component: PiTShirt, bg: "#ea60cf", color: "#ffffff" },
  { id: "trash", Component: FaRegTrashAlt, bg: "#6B7280", color: "#ffffff" },
  { id: "cutlery", Component: ImSpoonKnife, bg: "#f18334", color: "#ffffff" },
  { id: "vacuum", Component: GiVacuumCleaner, bg: "#3c87d5", color: "#ffffff" },
  { id: "plant", Component: RiPlantLine, bg: "#12b620", color: "#ffffff" },
  {
    id: "check",
    Component: MdCheckCircleOutline,
    bg: "#0D9488",
    color: "#ffffff",
  },
];

export const getIconDef = (
  id: string | null | undefined,
): TransactionIconDef | undefined =>
  id ? TRANSACTION_ICONS.find((ic) => ic.id === id) : undefined;
