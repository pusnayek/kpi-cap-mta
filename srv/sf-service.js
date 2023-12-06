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
        let user = req.user.id
        return userapi.run(SELECT.from('User', b => { b.userId, b.defaultLocale }).where({userId: user}))
    }) 

})