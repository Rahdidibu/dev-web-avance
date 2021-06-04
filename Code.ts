import { Block } from "./Block";

export class Code extends Block {
	constructor() {
		super();
		this.id = "```$";
		this.html = "code";
		this.canContain = false;
		this.endBlock = "```";
	}
}