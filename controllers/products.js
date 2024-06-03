const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

const bcrypt = require('bcryptjs/dist/bcrypt');
const apiResponse = require('../utils/response/apiResponse');
const authenticateUtil = require('../utils/response/apiResponse');



// Where Products is prisma schema

exports.getAll = async (req, res) => {
    try {
        //read all 
        const response = await prisma.Products.findMany();
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

exports.getById = async (req, res) => {
    const id = req.params.id*1;
    try {
        //search for id
        const response = await prisma.Products.findUnique({
            where: {
                id: id,
            },
        })
        //devolve o carro
        res.status(200).json(response)
    } catch (error) {
        res.status(404).json({ msg: error.message })
    }
}

exports.create = async (req, res) => {
    const { title, price, year, tags, colection, description, coverimg, rating, artist, artistId } = req.body; // or data
    try {
        const art = await prisma.Products.create({
            data: {
                title: title,
                price: price,
                // year: year,
                tags: tags,
                // colection: colection,
                // description: description,
                // coverimg: coverimg,
                rating: rating,
                artist: artist,
                artistId: artistId*1,
            },
        })
        res.status(201).json(art)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}


exports.update = async (req, res) => {
    const { id, title, price, year, tags, colection, description, coverimg, rating } = req.body;
    try {
        //procurar o carro com id e atualizar os dados
        const art = await prisma.Products.update({
            where: {
                id: id*1,
            },
            data: {
                title: title,
                price: price,
                year: year,
                tags: tags,
                colection: colection,
                description: description,
                coverimg: coverimg,
                rating: rating
            },
        })
        //devolve o carro atualizado
        res.status(200).json(art)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }

}

//delete listing by id
exports.delete = async (req, res) => {
    //le o id do carro
    const id = req.params.id;
    try {
        //delete student
        await prisma.Products.delete({
            where: {
                id: id*1,
            },
        })
        //just return ok
        res.status(200).send("ok");
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }

}


// For auth middleware actions. 
// Not for the answers

exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.users.findUnique({
            where: {email: email},
            
        })       
        if (user) {
            var passwordIsValid = bcrypt.compareSync(password,user.password);
            if (passwordIsValid) {
                const accessToken = authenticateUtil.generateAccessToken({ id: user.id, name: user.name, isAdmin : user.isAdmin });
                res.status(200).json({ name: user.name, id: user.id, token: accessToken });
            } else {
                res.status(401).json({ msg: "Invalid Password !!" });
            }
        }
    } catch (error) {
        res.status(401).json({ msg: error.message })
    }
}
exports.signup = async (req, res) => {
    try {
        const { name, email, password, isAdmin } = req.body;
        await prisma.Users.create({
            data: {
                email: email,
                name: name,
                password: bcrypt.hashSync(password, 8),
                profilePic: "images/blank-profile-picture.webp",
                isAdmin: isAdmin
            },
        })
        return this.signin(req, res);
    } catch (error) {
        res.status(401).json({ msg: error.message })
    }
}

//ver o token
exports.readToken= async (req, res) =>{
    try{
        const { token } = req.body;
        authenticateUtil.certifyAccessToken(token)
         .then(decode => {
            res.status(200).json(decode);
// Aqui pode ler os dados decodificados do token
            // Faça o que quiser com os dados decodificados, como salvá-los em variáveis ou usar em outras operações
          })
          .catch(err => {
            res.status(401).json(err);
            //console.error('Erro ao verificar o token:', err);
          });
    } catch (error){
        res.status(401).json({ msg: error.message })
    }
}