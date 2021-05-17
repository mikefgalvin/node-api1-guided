// IMPORTS AT THE TOP
const express = require("express")
const { endsWith } = require("lodash")
const { create } = require("./dog-model")
const Dog = require("./dog-model")
// const {create, findAll, findById } = require("./dog-model") //deconstruction approach

// INSTANCE OF EXPRESS APP
const server = express()

// GLOBAL MIDDLEWARE
server.use(express.json())

// ENDPOINTS req is talking to the server  res is the response given to the client

// [GET] / (Hello World endpoint)

// [GET] /api/dogs/:id (R of CRUD, fetch dog by :id)
server.get("/api/dogs/:id", (req, res) => {
    const idVar = req.params.id //how you pull something from the url
    Dog.findById(idVar)
        .then(dog => {
            if(!dog){
                res.status(404).json("Dog not found")
            } else{
                res.status(200).json(dog)
            }
        })
        .catch(err => {
            res.status(500).json({message: err.message})
        })
})

// [GET] /api/dogs (R of CRUD, fetch all dogs)
server.get("/api/dogs", (req, res) => {
    Dog.findAll()
    .then(dogs => {
        console.log(dogs)
        res.status(200).json(dogs)
    })
    .catch(err => {
        res.status(500).json({message: err.message})
    })
})

// [POST] /api/dogs (C of CRUD, create new dog from JSON payload)
server.post("/api/dogs", (req, res) => {
    const newDog = req.body
    if(!newDog.name || !newDog.weight){
        res.status(422).json("Name and weight required")
    } else {
        Dog.create(newDog)
        .then(dog => {
            res.status(201).json(dog)
        })
        .catch(err=> {
            res.status(500).json({message: err.message})
        })
    }

})
//async 
// server.post("/api/dogs", (req, res) => {
//     try {
//         const newDog = await Dog.create(req.body)
//         res.status(201).json(newDog)
//     } catch (err) {
//         res.status(500).json({
//             message: 'error posting new dog',
//             error: err.message,
//         })
//     }
// })

// [PUT] /api/dogs/:id (U of CRUD, update dog with :id using JSON payload)
server.put("/api/dogs/:id", async (req, res) => {
    const {id} = req.params
    const changes = req.body

    try {
        if(!changes.name || !changes.weight){
            res.status(422).json("Name and weight required")
        } else {
            const updatedDog = await Dog.update(id, changes)
            if(!updatedDog){
                res.status(422).json("No doggie here")
            } else {
                res.status(201).json(updatedDog)
            }
        }
    } catch(err){
        res.status(500).json({message: err.message})
    }
})

// [DELETE] /api/dogs/:id (D of CRUD, remove dog with :id)
server.delete("/api/dogs/:id", async (req, res) => {
    try{
        const {id} = req.params
        const deletedDog = await Dog.delete(id)
        if(!deletedDog){
            res.status(422).json("Dog doesn't exist")
        } else{
            res.status(201).json(deletedDog)
        }
    } catch(err){
        res.status(500).json({message: err.message})
    }
})

server.use("*", (req,res) => {
    res.status(404).json({message:"Why hello there!"}) //works because the middleware

})

// EXPOSING THE SERVER TO OTHER MODULES
module.exports = server
