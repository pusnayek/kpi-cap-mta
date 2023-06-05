const cds = require('@sap/cds')

class DataService extends cds.ApplicationService { init() {

  const { Admins } = cds.entities ('ET')

  this.on('getGreeting', () => 'Hello World' ) 

  // Reduce stock of ordered books if available stock suffices
  this.on ('uploadAdmins', async req => {
    try {
        // const data = JSON.parse(req.data)
        console.log(req.user)
        // await INSERT.into(Admins).entries(data)
        // return JSON.stringify(req.data)
        return 'OK'
    } catch(error) {
        return error
    }
  })

  return super.init()
}}

module.exports = { DataService }