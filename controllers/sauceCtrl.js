const Sauce = require("../models/sauce")
const fs = require("fs")

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    sauceObject.likes = 0
    sauceObject.dislikes = 0
    delete sauceObject._id
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    })
    sauce.save()
        .then(() => res.status(201).json({ message: "Objet enregistré !" }))
        .catch(error => {
            console.log(error)
            res.status(400).json({ error })
        })
}

exports.likeSauce = (req, res, next) => {
    const like = req.body.like
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            switch (like) {
                case 0:
                    const userIdLikeIndex = sauce.usersLiked.indexOf(req.body.userId)
                    const userIdDislikeIndex = sauce.usersDisliked.indexOf(req.body.userId)
                    if (userIdLikeIndex != -1) {
                        sauce.usersLiked.splice(userIdLikeIndex, 1)
                        sauce.likes -= 1
                    }
                    if (userIdDislikeIndex != -1) {
                        sauce.usersDisliked.splice(userIdDislikeIndex, 1)
                        sauce.dislikes -= 1
                    }
                    break
                case 1:
                    if (sauce.likes != undefined) {
                        sauce.likes += 1
                    }
                    sauce.usersLiked.push(req.body.userId)
                    // console.log(sauce)
                    break
                case -1:
                    if (sauce.dislikes != undefined) {
                        sauce.dislikes += 1
                    }
                    sauce.usersDisliked.push(req.body.userId)
                    // console.log(sauce)
                    break
            }
            Sauce.findByIdAndUpdate({ _id: req.params.id }, { ...sauce, _id: req.params.id })
                .then(() => res.status(200).json({ message: "Like modifié !" }))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ error })
        })
}

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
        } : { ...req.body }
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: "Objet modifié !" }))
        .catch(error => res.status(400).json({ error }))
}

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split("/images/")[1]
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Objet supprimé !" }))
                    .catch(error => res.status(400).json({ error }))
            })
        })
        .catch(error => res.status(500).json({ error }))
}

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }))
}

exports.getSauce = (req, res, next) => {
    Sauce.find()
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }))
}