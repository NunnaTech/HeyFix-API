var express = require("express")

const admin = require("firebase-admin");
var serviceAccount = require("../permissions.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://expressjs-cloudfunctions-api.firebaseio.com"
});

const db = admin.firestore()

var categoryRoutes = express.Router()

//Middle ware that is specific to this router
categoryRoutes.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now())
  next()
})

// Read
// Read item
categoryRoutes.get("/api/categories/:id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("categories").doc(req.params.id)
      let category = await document.get()
      let response = category.data()
      // check if exist
      if(!response){
        return res.status(404).send(response)
      }
      return res.status(200).send(response)
    } catch (error) {
      console.log(error)
      return res.status(500).send(error)
    }
  })()
})

// Read all
categoryRoutes.get("/api/categories/", (req, res) => {
  (async () => {
    try {
      let query = db.collection("categories")
      let response = []
      await query.get().then((querySnapshot) => {
        let docs = querySnapshot.docs //the result of our query
        for (let doc of docs) {
          //add each doc to our JSON response
          const selectedItem = {
            id: doc.id,
            name: doc.data().name,
            description: doc.data().description,
            icon: doc.data().icon,
          }
          response.push(selectedItem)
        }
        return response //each then should return a value
      })
      return res.status(200).send(response) //end of async function should return a value
    } catch (error) {
      console.log(error)
      return res.status(500).send(error)
    }
  })()
})

module.exports = categoryRoutes
