
const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyCntPB-qN_-K60eVMgJkJEy8Dn2ZxvxC6Y',
    Promise: Promise
  });
  
// Geocode an address.
// googleMapsClient.geocode({
//     address: '1600 Amphitheatre Parkway, Mountain View, CA'
//   }, function(err, response) {
//     if (!err) {
//       console.log(response.json.results);
//     }
//   });


  // distanceMatrix an address.
    // googleMapsClient.distanceMatrix({
    //    origins: 28.49958 + ',' + 77.08511,
    //    destinations: 28.47318 + ',' + 77.04767,
    //    mode: 'driving'
    // },
    //  function(err, response){
    //     if(!err) {
    //         console.log(JSON.stringify(response));
    //         console.log(JSON.stringify(response.json.rows));
    //     }

    // });

// * Making a distance matrix request.
const coordinates = {
    origins: {
      lat: '28.49958',
      long: '77.08511'
    }
  }
     // Geocode an address.
     googleMapsClient.distanceMatrix({
        origins: [{
            lat: '23.29654',
            long: '79.20662'
          }],
        destinations: [{
            lat: '28.97357',
            long: '77.27279'
          }],
        mode: 'driving'
     }).asPromise().then((response) => {
        console.log( JSON.stringify(response.json.rows[0]));
      })
      .catch(err => console.log(err));


      // * Making a directions request.
        // googleMapsClient.directions({
        //     origin: `${coordinates.origins.lat},${coordinates.origins.long}`,
        //     destination: `${coordinates.destinations.lat},${coordinates.destinations.long}`,
        // }).asPromise().then((response) => {
        //     console.log(response.json)
        // })
        // .catch(err => console.log(err));


         //for(var x=0; x<results.length; x++){
                    
                   // origns.push({lat:results[x].warelatitude,long:results[x].warelongitute});
                   // destinations.push({lat:results[x].latiude,long:results[x].longitude});
                    //console.log(x,"===orign====",{lat:results[x].warelatitude,long:results[x].warelongitute})
                    //console.log(x,"===dddd====",{lat:results[x].latiude,long:results[x].longitude})
                    // googleMapsClient.distanceMatrix({
                    //     origins: {lat:results[x].warelatitude,long:results[x].warelongitute},
                    //     destinations: {lat:results[x].latiude,long:results[x].longitude},
                    //     mode: 'driving'
                    //  }).asPromise().then((response) => { 
                    //     //console.log(response.json.rows[0].elements[0].distance.text);
                        
                    //   }).catch(err => console.log(err));
               // }