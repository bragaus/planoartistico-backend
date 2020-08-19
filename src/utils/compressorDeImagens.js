const fs = require('fs'), sharp = require('sharp');
const https = require('https');
const path = require('path');
const { rejects } = require('assert');

exports.compressImage = (file, size) => {

    const caminho = path.resolve(__dirname, '..', '..', 'images', file.key);

    const arquivo = fs.createWriteStream(caminho);

    return new Promise((resolve, reject) => {
        https.get(file.location, (resposta) => {
            resposta.pipe(arquivo);

            arquivo.on('finish', () => {
                sharp(caminho) // Executa o SHARP na imagem que será comprimida
                .resize(size) // Redimensa para o tamanho solicitado
                .toFormat('webp') // Forçando a conversão do arquivo para webp
                .webp({ quality: 80 }) // Setando uma qualidade
                .toBuffer() // Transformando o arquivo em buffer
                .then( data => { // data = arquivo tratado
                    
                    // Deletando o arquivo antigo:
                    // O fs.access serve para testar se o arquivo realmente existe.
                    fs.access(caminho, (err) => {
        
                        // Um erro significa que o arquivo não existe
                        if (!err) {
                            
                            // Se não houver erros o arquivo vai ser deletado.
                            fs.unlink(caminho, (err) => {
                                if(err) console.log(err)
                            })
        
                        }
        
                    });
        
                    const arquivoBase64 = new Buffer.from(data).toString('base64');
                    return resolve(arquivoBase64)
                });
            });     
        })
    })




//         response.pipe(arquivo)

//         arquivo.on('finish', () => {
//              sharp(caminho) // Executa o SHARP na imagem que será comprimida
//             .resize(size) // Redimensa para o tamanho solicitado
//             .toFormat('webp') // Forçando a conversão do arquivo para webp
//             .webp({ quality: 80 }) // Setando uma qualidade
//             .toBuffer() // Transformando o arquivo em buffer
//             .then( data => { // data = arquivo tratado
                
//                 // Deletando o arquivo antigo:
//                 // O fs.access serve para testar se o arquivo realmente existe.
//                 fs.access(caminho, (err) => {
    
//                     // Um erro significa que o arquivo não existe
//                     if (!err) {
                        
//                         // Se não houver erros o arquivo vai ser deletado.
//                         fs.unlink(caminho, (err) => {
//                             if(err) console.log(err)
//                         })
    
//                     }
     
//                 });
    
//                 const arquivoBase64 = new Buffer.from(data).toString('base64');
//                 return arquivoBase64
//             });     
//         });
//     }

}