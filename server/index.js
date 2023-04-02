import epxress from "express";
import mysql from "mysql";
import dotenv from 'dotenv'
dotenv.config()

const app = epxress()
app.use(epxress.json())

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
})

app.route("/api/v1/coins")
    .get((req, res) => {
        connection.query("SELECT * FROM `coins`", (err, data) => {
            if (err) {
                res.status(500).send({ message: err.sqlMessage })
            }
            res.send(data)
        })
    })
    .post((req, res) => {
        const { name,
            category,
            country,
            composition,
            quality,
            denomination,
            price,
            year,
            weight,
            img_face,
            img_back,
            full_desc } = req.body
        const query = `INSERT INTO coins 
            (name,category,country,composition,quality,denomination,price,year,weight,img_face,img_back,full_desc)
        Values
            ("${name}","${category}","${country}","${composition}","${quality}","${denomination}","${price}","${year}","${weight}","${img_face}","${img_back}","${full_desc}");
        `
        connection.query(query, (err, data) => {
            if (err) {
                res.status(500).send({ message: err.sqlMessage })
            }
            res.status(200).send(data)
        })
    })

app.route("/api/v1/coin/:id")
    .get((req, res) => {
        const id = parseInt(req.params.id);
        connection.query(`SELECT * FROM coins WHERE  id = ${id}`, (err, data) => {
            if (err) {
                res.status(500).send({ message: err.sqlMessage })
            }
            else if (!data.length) {
                res.status(404).send({ message: "Coin not found !" })
            }
            else {
                res.status(200).send(data)
            }
        })
    })
    .put((req, res) => {
        const id = parseInt(req.params.id);
        const { name,
            category,
            country,
            composition,
            quality,
            denomination,
            price,
            year,
            weight,
            img_face,
            img_back,
            full_desc } = req.body
        const query = `UPDATE coins SET 
        name="${name}",category="${category}",country="${country}",composition="${composition}",
        quality="${quality}",denomination="${denomination}",price="${price}",year="${year}",
        weight="${weight}",img_face="${img_face}",img_back="${img_back}",full_desc="${full_desc}"
        WHERE id=${id}`
        connection.query(query, (err, data) => {
            if (err) {
                res.status(500).send({ message: err.sqlMessage })
            }
            else if (!data.affectedRows) {
                res.status(404).send({ message: " Coin not found !" })
            }
            else {
                res.status(200).send(data)
            }
        })
    })
    .delete((req, res) => {
        const id = parseInt(req.params.id);
        connection.query(`DELETE FROM coins WHERE id=${id}`, (err, data) => {
            if (err) {
                res.status(500).send({ message: err.sqlMessage })
            }
            else if (!data.affectedRows) {
                res.status(404).send({ message: " Coin not found !" })
            }
            else {
                res.status(200).send(data)
            }
        })
    })
const PORT = process.env.PORT || 8080
app.listen(PORT)