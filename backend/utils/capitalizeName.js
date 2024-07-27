const capitalizeName = (name )=>{

    if (!name || typeof name !== 'string') {
        return ''; 
    }


    const splittedName = name.split(' ')

    const modifiedName = splittedName.map((item,index)=>{


        return item.charAt(0).toUpperCase() + splittedName[index].slice(1); 
    }).join(' ')

    return modifiedName; 


}

module.exports = capitalizeName ; 