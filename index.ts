import { readFileSync } from 'fs';

const file = readFileSync('text.md', 'utf8');
const md = file.split('\n\n');

/* enum States {
	NULL, "identify", "read", "following", "ending"
}; */

class Block {
	id: string;
	html: string;
	multiLine: boolean = false;
	canContain: boolean = true;
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
		this.id = "```$";
		this.html = "code";
		this.canContain = false;
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
		parent = child;
		var childs = [];

		// Fix for Typescript ^3.9 issue (https://github.com/microsoft/vscode/issues/116219)
		var tmp = JSON.stringify(child);
		if (tmp.indexOf('content') < 0) {
			while (index >= 0) {
				child = objects[index];

				if (child[Object.keys(child)[0]].content) {
					parent = child;
					break;
				}
				childs.push(child);
				index--;
			}

			childs.forEach(child => {
				parent[Object.keys(parent)[0]].content = { ...parent[Object.keys(parent)[0]].content, ...child };
			});
		}
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

json = saveToJson({}, objects, objects.length - 1);

console.log(JSON.stringify(json));

// https://asciiparait.fr/courses/development-advanced/02-state-machines/