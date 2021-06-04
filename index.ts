import { readFileSync } from 'fs';
import { Block } from './Block';
import { Title1 } from './Title1';
import { Title2 } from './Title2';
import { Title3 } from './Title3';
import { Code } from './Code';
import { UnorderedList } from './UnorderedList';
import { Paragraph } from './Paragraph';

// Read markdown file to parse
const file = readFileSync('text.md', 'utf8');
// Remove tabulations for LF file
const md = file.split('\n\n');

// Define blocks used to identify each markdown lines
const blocks: Array<Block> = [new Title1, new Title2, new Title3, new Code, new UnorderedList];

/**
 * Identify line from a markdown
 * @param line string
 * @param index number
 * @param identifier string
 * @returns Block
 */
function identify(line: string, index: number = 0, identifier: string = ""): Block | null {
	if (index > line.length) {
		// Block is a paragraph or a bad-formatted line
		return new Paragraph;
	}

	let substr = line.substring(index, index + 1);
	if (substr === "\\") substr = line.substring(index, index + 2);

	// Stop identification when space char detected
	if (substr === " " || substr === "\n") {
		for (let block of blocks) {
			if (identifier !== block.id) {
				let indexOfVariable = block.id.indexOf('$');

				if (indexOfVariable >= 0) {
					let blockId = block.id.replace('$', identifier.substr(indexOfVariable, identifier.length));
					if (identifier === blockId) return block;
				}

				continue;
			}

			return block;
		}
	}

	identifier += substr;

	return identify(line, index + 1, identifier);
}

/**
 * Read line content
 * @param line string
 * @param block Block
 * @returns string
 */
function read(line: string, block: Block): string {
	if (block.id.length) {
		if (block.endBlock) {
			line = line.substring(0, line.length - block.endBlock.length);
		}
		return line.substring(block.id.length + 1); // +1 to count space
	}

	return line;
}

/**
 * Convert a markdown "block" to an object, store it in an array and return the array
 * @param text string
 * @param block Block
 * @param objects Array<Object>
 * @returns Array<Object>
 */
function convertToObjects(text: string, block: Block, objects: Array<Object>): Array<Object> {
	if (block.canContain) {
		objects.push({ [block.html]: { label: text, content: {} } });
	} else {
		objects.push({ [block.html]: text });
	}
	return objects;
}

/**
 * Convert objects to json
 * @param child Object
 * @param objects Array<Object>
 * @param index number
 * @returns Object
 */
function saveToJson(child: Object, objects: Array<Object>, index: number): Object {
	if (index < 0) return child;

	var parent = objects[index];
	if (parent[Object.keys(parent)[0]].content) {
		parent[Object.keys(parent)[0]].content = { ...parent[Object.keys(parent)[0]].content, ...child };
	} else {
		if (objects[index]['ul']) {
			let ul = objects[index]['ul'].split('\n');
			let list = { ul: [] };
			for (let li = 0; li < ul.length; li++) {
				if (ul[li].substring(0, 1) === "*") list['ul'].push({ li: ul[li].substring(2) });
				else list['ul'].push({ li: ul[li] });
			}

			parent = Object.assign(child, list);
		} else parent = Object.assign(child, objects[index]);
	}

	return saveToJson(parent, objects, index - 1);
}

// -------------------------------------------------------

let objects = [];
for (let line of md) {
	if (line.length === 0) continue;

	// First, identify the line
	let block: Block = identify(line);
	// Then, read the content
	let text = read(line, block);
	// Finally, convert it into an object an store it in an array
	convertToObjects(text, block, objects);
}

// Store result in variable
var json = saveToJson({}, objects, objects.length - 1);

// Log final json result in console
console.log(JSON.stringify(json));