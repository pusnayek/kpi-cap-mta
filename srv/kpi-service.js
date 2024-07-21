const cds = require('@sap/cds')

class DataService extends cds.ApplicationService { init() {

    this.before('*', function (req) {
        const user = new cds.User.Privileged
        return this.tx({ user }, tx => tx.run(
          INSERT.into('RequestLog').entries({
            url: req._.req.url,
            user: req.user.id
          })
        ))
    })

    return super.init()
}}

module.exports = { DataService }