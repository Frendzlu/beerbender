import Cell from "./Cell";
import Item from "../Item";
import {MappedEnum} from "../Generics";

enum RoomType {
	Normal = "Normal",
	Shop = "Shop",
	Lore = "Lore",
	Finish = "Finish",
	MiniBoss = "MiniBoss",
	Platforming = "Platforming"
}

const RoomTypeColors: MappedEnum<RoomType> = {
	Normal: "#2a42a5",
	Shop: "#c28401",
	Lore: "#59dbca",
	Finish: "#a6d239",
	MiniBoss: "#5a101d",
	Platforming: "#056f62",
}

interface IRoom {
	cells: Cell[]
	type: RoomType
	height: number
	width: number
}

class NormalRoom implements IRoom {
	cells: Cell[]
	height: number
	type = RoomType.Normal
	width: number
}

class Shop implements IRoom {
	cells: Cell[]
	height: number
	type = RoomType.Shop
	width: number
	soldItems: Item[]
}

class Lore implements IRoom {
	cells: Cell[];
	height: number;
	type = RoomType.Lore;
	width: number;
	displayedLore = "I have no fucking clue"
}
/*
class Lore implements IRoom {
	cells: Cell[];
	height: number;
	type = RoomType.Lore;
	width: number;
	displayedLore: string = "I have no fucking clue"
}*/