function decode_base64(data){
    let buff = new Buffer(data, 'base64');
    let text = buff.toString('ascii');  
    return text;
}

module.exports.decode_base64 = decode_base64;