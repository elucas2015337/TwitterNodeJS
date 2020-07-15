'use strict'

var Tweet = require('../models/tweet')
var User = require('../models/user')
var jwt  = require("../services/jwt")

function crearTweet(req, res){

    var tweet = new Tweet();
    var datos = req.body.command.split(' ');

    if(datos[1]){

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); 
        var yyyy = today.getFullYear();
        tweet.body = ""
            for (let i = 1; i < datos.length; i++) {
                tweet.body = tweet.body +" "+ datos[i]
                
            }
            tweet.fecha = mm + '/' + dd + '/' + yyyy
            tweet.usuario = req.user.sub
            //return res.send({ message: tweet.body })
                    tweet.save((err, tweetPublicado) => {
                        if(err) return res.status(500).send({message: 'error al publicar el tweet'})
                        if(tweetPublicado){
                            res.status(200).send({usuario: req.user.usuario,
                                                    fecha: tweetPublicado.fecha,
                                                    tweet: tweetPublicado.body})
                        }else{
                            res.status(404).send({message: 'no se ha podido publicar tu tweet'})
                        }
                        
                    })
                
    }else{
        res.status(200).send({
            message: 'Escribe algo en tu tweet'
        })
    }
}

function editarTweet(req, res) {
    var nuevoBody = ""
    var datos = req.body.command.split(' ');
    if(datos[2]){
       Tweet.findById(datos[1], (err, tweetEncontrado)=>{
           if(err) return res.status(500).send({ message: 'error en la petición de tweets' })
           
           if(!tweetEncontrado) return res.status(404).send({ message: 'No hemos encontrado el tweet' })
           //return res.send({ message: req.user.sub })
           if(tweetEncontrado.usuario == req.user.sub){
              // return res.send({ message: tweetEncontrado.id })
              for (let i = 2; i < datos.length; i++) {
                  nuevoBody = nuevoBody + " " + datos[i]
                  
              }
               Tweet.findByIdAndUpdate(tweetEncontrado.id, {body: nuevoBody}, {new: true}, (err, tweetActualizado)=>{
                    if(err) return res.status(500).send({ message: "error en la petición de tweets" })
                    if(!tweetActualizado) return res.status(404).send({ message: 'No se ha podido actualizar el tweet' })
                    res.status(200).send({usuario: req.user.usuario,
                        fecha: tweetActualizado.fecha,
                        tweet: tweetActualizado.body})
               })
           }else{
               return res.send({ message: 'Este tweet no te pertenece' })
           }

       })
    }else{
        return res.send({ message: 'Introduce el id del tweet y el nuevo texto para tu tweet o no lo edites' })
    }
        
}

function eliminarTweet(req, res) {
    var datos = req.body.command.split(' ');
    if(datos[1]){
       Tweet.findById(datos[1], (err, tweetEncontrado)=>{
           if(err) return res.status(500).send({ message: 'error en la petición de tweets' })
           if(!tweetEncontrado) return res.status(404).send({ message: 'No hemos encontrado el tweet' })
           //return res.send({ message: req.user.sub })
           if(tweetEncontrado.usuario == req.user.sub){
               Tweet.findByIdAndDelete(tweetEncontrado.id, (err, tweeteliminado)=>{
                    if(err) return res.status(500).send({ message: "error en la petición de tweets" })
                    if(!tweeteliminado) return res.status(404).send({ message: 'No se ha podido eliminar el tweet' })
                    return res.status(200).send({ message: 'tweet eliminado' })
               })
           }else{
               return res.send({ message: 'Este tweet no te pertenece' })
           }

       })
    }else{
        return res.send({ message: 'Introduce el id del tweet' })
    }
}


module.exports={
    crearTweet,
    editarTweet,
    eliminarTweet
}