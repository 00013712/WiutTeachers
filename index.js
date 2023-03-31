const express = require("express")

const app = new express()

const fs = require('fs')

app.set('view engine', 'pug')

app.use('/static', express.static('public'))

app.use(express.urlencoded({ extended: false }))

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
	res.render('home')
})

app.get('/add', (req, res) => {
	res.render('create')
})

app.post('/add', (req, res) => {
	const firstname = req.body.firstname
	const secondname = req.body.secondname
	const age = req.body.age
	const emailaddress = req.body.emailaddress
	const major = req.body.major
	
	if (firstname.trim() === '' && secondname.trim() === '' && age.trim() === '' && emailaddress.trim() === ''){
		res.render('create', {error: true})
	} else {
		fs.readFile('./data/teachers.json', (err, data) => {
			if (err) throw err

			const teachers = JSON.parse(data)

			teachers.push({
				id: id(),
				firstname: firstname,
				secondname: secondname,
				age: age,
				emailaddress: emailaddress,
				major: major
			})

			fs.writeFile('./data/teachers.json', JSON.stringify(teachers), err => {
				if (err) throw err

				res.render('create', {success: true})
			})
		})
	}
})

//const teachers = ['Some good teacher', 'Some good teacher 2']

app.get('/teachers', (req, res) => {
	fs.readFile('./data/teachers.json', (err, data) => {
		if (err) throw err

	const teachers = JSON.parse(data)

	res.render('teachers', {teachers: teachers})
	})
})

app.get('/teachers/:id', (req, res) => {
	const id = req.params.id

	fs.readFile('./data/teachers.json', (err, data) => {
		if (err) throw err

	const teachers = JSON.parse(data)

	const teacher = teachers.filter(teacher => teacher.id == id)[0]

	res.render('detail', {teacher: teacher})
	})
})

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`)
})

function id () {
	//return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase()
	return '_' + Math.random().toString(36).substr(2, 9);
}
