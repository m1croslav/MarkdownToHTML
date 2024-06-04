const fs = require('fs');

const parseMarkdown = (markdown) => {
    let html = '';
    let inPreformatted = false;

    markdown.split('\n').forEach(line => {
        if (line.startsWith('```')) {
            if (inPreformatted) {
                html += '</pre>\n';
                inPreformatted = false;
            } else {
                html += '<pre>\n';
                inPreformatted = true;
            }
        } else if (inPreformatted) {
            html += line + '\n';
        } else {
            line = line.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
                .replace(/_(.+?)_/g, '<i>$1</i>')
                .replace(/`(.+?)`/g, '<tt>$1</tt>');

            if (line.trim() === '') {
                html += '</p>\n<p>';
            } else {
                html += line + '\n';
            }
        }
    });

    if (inPreformatted) {
        throw new Error('Invalid Markdown: Unclosed preformatted block');
    }

    return html.replace(/<p>\s*<\/p>/g, '').trim();
};
const main = () => {
    if (process.argv.length < 3) {
        console.error('Usage: node index.js <input-file> [--out <output-file>]');
        process.exit(1);
    }

    const inputFilePath = process.argv[2];
    const outputFlagIndex = process.argv.indexOf('--out');
    const outputFilePath = outputFlagIndex > -1 ? process.argv[outputFlagIndex + 1] : null;

    if (!fs.existsSync(inputFilePath)) {
        console.error(`Error: File not found: ${inputFilePath}`);
        process.exit(1);
    }

    const markdown = fs.readFileSync(inputFilePath, 'utf8');

    try {
        const html = '<p>' + parseMarkdown(markdown) + '</p>';
        if (outputFilePath) {
            fs.writeFileSync(outputFilePath, html, 'utf8');
        } else {
            console.log(html);
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

main();
// Revert
