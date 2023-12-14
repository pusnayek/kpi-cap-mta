module.exports = (async function() {
    
    const cds = require('@sap/cds')
    const core = require('@sap-cloud-sdk/core');

    // const sDestinationName = 'sap_hcmcloud_core_odata';


    const userapi = await cds.connect.to('PLTUserManagement')
    // const { Users } = userapi.entities

    this.on('READ', 'Users', (req) => {
        console.log('Passing request to remote system')    
        return userapi.run(req.query)
    })

    this.on('getUser', (req, res) => {
        console.log('Passing request to remote system')    
        let user =  req.user.id
        console.log(user)    
        return userapi.run(SELECT.from('User', b => { b.userId, b.defaultLocale, b.ethnicity }).where({userId: user}))
    }) 

    this.on('updateClockValues', async (req, res) => {
        console.log('Passing request to remote system')    
        const query = UPDATE.entity('User').byKey({userId: "adminPN"}).set({
            ethnicity: 'RR'
        })

        userapi.run(query).then((data) => {
            console.log(data)
        }).catch(error => {
            console.log(error)
        })
        return 'Done!'   
    }) 

})