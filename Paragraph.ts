import { Block } from "./Block";

export class Paragraph extends Block {
	constructor() {
		super();
		this.id = "";
		this.html = "p";
		this.multiLine = true;
		this.canContain = false;
	}
}