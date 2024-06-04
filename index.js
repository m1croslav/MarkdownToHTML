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
