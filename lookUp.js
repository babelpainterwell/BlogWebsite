
exports.find = (postName, postsArray)=>{
    for (let i = 0; i < postsArray.length; i++){
        if (postsArray[i].title === postName) {
            return i;
        }
    }
    return -1;
}