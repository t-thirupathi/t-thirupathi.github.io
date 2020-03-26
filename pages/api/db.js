const { GoogleSpreadsheet } = require('google-spreadsheet')

// const creds = {
//   client_email: process.env.google_service_account_email,
//   private_key: process.env.google_private_key,
// }

const creds = require('./client_secret.json')

const sheetId = '1nzXUdaIWC84QipdVGUKTiCSc5xntBbpMpzLm6Si33zk'

const doc = new GoogleSpreadsheet(sheetId)

module.exports = { doc, creds }
