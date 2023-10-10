// allUserDataList = [
//     {
//       id: 'gE5oGtaoR28FzQiYAAAC',
//       uname: 'chinmay',
//       room: 'sp-1',
//       ticket: 'HS-2',
//       iffscr: 4
//     },
//     {
//       id: 'BU7uHZNrw_jVKOTAAAAD',
//       uname: 'angela',
//       room: 'sp-1',
//       ticket: 'HS-2',
//       iffscr: 7
//     },
//     {
//       id: 'j-N-vlW5yc7e93QPAAAE',
//       uname: 'angela',
//       room: 'hot',
//       ticket: 'HS-3',
//       iffscr: 20
//     }
//   ]

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

// console.log(calTotalIFFScore(allUserDataList, room='sp-2', ticket='HS-2'))

module.exports = {
    calTotalIFFScore
}