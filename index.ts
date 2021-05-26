import { readFileSync } from 'fs';

const file = readFileSync('text.md', 'utf8');
const md = file.split('\n\n');

enum States {
	NULL, "identify", "read", "following", "ending"
};

class Block {
	id: string;
	html: string;
	multiLine: boolean = false;
};

class TITLE_1 extends Block {
	constructor() {
		super();
		this.id = "#";
		this.html = "h1";
	}
}

class TITLE_2 extends Block {
	constructor() {
		super();
		this.id = "##";
		this.html = "h2";
	}
}

class TITLE_3 extends Block {
	constructor() {
		super();
		this.id = "###";
		this.html = "h3";
	}
}

class PARAGRAPH extends Block {
	constructor() {
		super();
		this.id = "";
		this.html = "p";
	}
}

class CODE extends Block {
	constructor() {
		super();
		this.id = "```$";
		this.html = "code";
	}
}

const blocks: Array<Block> = [new TITLE_1, new TITLE_2, new TITLE_3, new CODE];

function identify(line: string, index: number = 0, identifier: string = ""): Block | null {
	if (index > line.length) {
		// Block is a paragraph or a bad-formatted line
		return new PARAGRAPH;
	}

	let substr = line.substring(index, index + 1);

	// Stop identification when space char detected
	if (substr === " ") {
		for (let block of blocks) {
			if (identifier !== block.id) {

				// TODO : return block paragraph instead

				continue;
			} else {
				return block;
			}
		}
	}

	identifier += substr;

	return identify(line, index + 1, identifier);
}

function read(line: string, block: Block): string {
	if (block.id.length) {
		return line.substring(block.id.length + 1);
	}

	return line;
}

function saveToJson(text: string, block: Block) {
	if (json[block.html]) {
		return;
	}

	json[block.html] = text;
}

// -------------------------------------------------------

var json = {};

for (let line of md) {
	if (line.length === 0) continue;

	console.log(line);

	let block: Block = identify(line);

	console.log(block);

	let text = read(line, block);

	console.log('------');

	try {
		saveToJson(text, block);
	} catch (error) {
		// return;
	}
};

console.log(json);

// https://asciiparait.fr/courses/development-advanced/02-state-machines/