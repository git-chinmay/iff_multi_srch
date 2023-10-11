const calTotalIFFScore = (allUserDataList, rm, tkt) => {
    let totalIFFScore = 0
    allUserDataList.map((user)=>{
        const {room, ticket, iffscr} = user;
        if (room === rm && ticket === tkt){
            totalIFFScore += iffscr;
        }
    });
    return totalIFFScore;
}

module.exports = {
    calTotalIFFScore
}