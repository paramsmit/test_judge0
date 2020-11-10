function decode_base64(data){
    if(data === null) return null
    let buff = new Buffer.from(data, 'base64');
    let text = buff.toString('ascii');  
    return text;
}

module.exports.decode_base64 = decode_base64;

