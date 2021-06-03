import { readFileSync } from 'fs';

const file = readFileSync('text.md', 'utf8');
const md = file.split('\n\n'); // remove tabulations for LF file.

/* enum States {
	NULL, "identify", "read", "following", "ending"
}; */

class Block {
	id: string;
	html: string;
	multiLine: boolean = false;
	canContain: boolean = true;
	endBlock: string;
}

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
		this.multiLine = true;
		this.canContain = false;
	}
}

class CODE extends Block {
	constructor() {
		super();
		this.id = "```sh";
		this.html = "code";
		this.canContain = false;
		this.endBlock = "```";
	}
}

const blocks: Array<Block> = [new TITLE_1, new TITLE_2, new TITLE_3, new CODE];

var json;
var objects = [];

function identify(line: string, index: number = 0, identifier: string = ""): Block | null {
	if (index > line.length) {
		// Block is a paragraph or a bad-formatted line
		return new PARAGRAPH;
	}

	let substr = line.substring(index, index + 1);
	if(substr === "\\") substr = line.substring(index, index + 2);

	// Stop identification when space char detected
	if (substr === " " || substr === "\n") {
		for (let block of blocks) {
			if (identifier !== block.id) continue;
			else return block;
		}
	}

	identifier += substr;

	return identify(line, index + 1, identifier);
}

function read(line: string, block: Block): string {
	if (block.id.length) {
		if(block.endBlock) {
			line = line.substring(0, line.length - block.endBlock.length);
		}
		return line.substring(block.id.length + 1);
	}

	return line;
}

function convertToObjects(text: string, block: Block) {
	
	if (block.canContain) {
		objects.push({ [block.html]: { label: text, content: {} } });
	} else {
		objects.push({ [block.html]: text });
	}
}

function saveToJson(child: Object, objects: Array<Object>, index: number) {
	if (index < 0) return child;

	var parent = objects[index];
	if (parent[Object.keys(parent)[0]].content) {
		parent[Object.keys(parent)[0]].content = { ...parent[Object.keys(parent)[0]].content, ...child };
	} else {
		parent = Object.assign(child, objects[index]);
	}

	return saveToJson(parent, objects, index - 1);
}

// -------------------------------------------------------

for (let line of md) {
	if (line.length === 0) continue;

	let block: Block = identify(line);
	let text = read(line, block);

	try {
		convertToObjects(text, block);
	} catch (error) {
		console.warn(error);
	}
}

console.log(objects);
json = saveToJson({}, objects, objects.length - 1);

console.log(JSON.stringify(json));

// https://asciiparait.fr/courses/development-advanced/02-state-machines/