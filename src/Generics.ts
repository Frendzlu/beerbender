export type MappedEnum<K extends string> = {
	[key in K]: string
}