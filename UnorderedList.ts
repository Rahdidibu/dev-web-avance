import { Block } from "./Block";

export class UnorderedList extends Block {
	constructor() {
		super();
		this.id = "*";
		this.html = "ul";
		this.canContain = false;
	}
}