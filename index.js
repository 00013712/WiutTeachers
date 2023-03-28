const express = require("express")

const app = new express()

app.set('view engine', 'pug')

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
	res.render('create')
})

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`)
})
