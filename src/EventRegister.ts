type TFunction = (...args: any) => any

class CallStack {
	private callStack: {[key: string]: TFunction} = {}

	add(handle: string, fn: TFunction) {
		if (handle in this.callStack) {
			throw new Error(`Couldn't add event with handle ${handle} to stack - handle already exists`)
		} else this.callStack[handle] = fn
	}

	executeStack() {
		Object.values(this.callStack).forEach(fn => fn())
	}
	
	remove(handle: string) {
		if (handle in this.callStack) {
			delete this.callStack[handle]
		} else throw new Error(`Couldn't remove event with handle ${handle} to stack - handle doesn't exists`)
	}
}

enum EventTypes {
	Toggleable,
	Held,
	Pressed
}