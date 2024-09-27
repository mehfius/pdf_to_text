const pdfUtil = require('pdf-to-text');
const fs = require('fs');

const extract_text = async (stream) => {
    return new Promise((resolve, reject) => {
        pdfUtil.pdfToText(stream, (err, data) => {
            if (err) {
                console.error('Erro ao extrair texto do PDF:', err);
                return reject(err);
            }

            const cleanedData = data
                .replace(/[^\x20-\x7E]/g, '')
                .replace(/\s{2,}/g, ' ');

       
            fs.unlink(stream, (unlinkErr) => {
                if (unlinkErr) {
                    console.error('Erro ao deletar arquivo temporário:', unlinkErr);
                }
            });

            resolve(cleanedData); 
        });
    });
};

module.exports = { extract_text };
