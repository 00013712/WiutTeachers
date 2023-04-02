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

app.get('/api/v1/teachers', (req, res) => {
	fs.readFile('./data/teachers.json', (err, data) => {
		if (err) throw err

		const teachers = JSON.parse(data)

		res.json(teachers)
	})
})

app.post('/add', (req, res) => {
	const firstname = req.body.firstname
	const secondname = req.body.secondname
	const age = req.body.age
	const emailaddress = req.body.emailaddress
	const major = req.body.major
	
	if (firstname.trim() === '' || secondname.trim() === '' || age.trim() === '' ||  emailaddress.trim() === '' ){
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

	const teacher = teachers.filter(teacher => teacher.id === id)[0]

	res.render('detail', {teacher: teacher})
	})
})

app.get('/:id/delete', (req, res) => {
	const id = req.params.id
	fs.readFile('./data/teachers.json', (err, data) => {
	  if (err) throw err
	  const teachers = JSON.parse(data)
	  const filtered = teachers.filter(teacher => teacher.id != id)
	  fs.writeFile('./data/teachers.json', JSON.stringify(filtered), err => {
		if (err) throw err
		res.render('teachers', {teachers: filtered, deleted: true})
	  })
	})
  })

app.post('/:id/edit', (req, res) => {
		const id = req.params.id
		const firstname = req.body.firstname
		const secondname = req.body.secondname
		const age = req.body.age
		const emailaddress = req.body.emailaddress
		const major = req.body.major

		if (firstname.trim() === '' || secondname.trim() === '' || age.trim() === '' ||  emailaddress.trim() === '') {
			fs.readFile('./data/teachers.json', (err, data) => {
			if (err) throw err
			const teachers = JSON.parse(data)
			const teacher = teachers.filter(teacher => teacher.id === id)[0]
			res.render('detail', {teacher: teacher, error: true})
			})
		} else {
		fs.readFile('./data/teachers.json', (err, data) => {
			if (err) throw err
			const teachers = JSON.parse(data)
			const teacher = teachers.filter(teacher => teacher.id === id)[0]

			const teacherId = teachers.indexOf(teacher)
			const splicedTeacher = teachers.splice(teacherId, 1)[0]
			splicedTeacher.firstname = firstname
			splicedTeacher.secondname = secondname
			splicedTeacher.age = age
			splicedTeacher.emailaddress = emailaddress
			splicedTeacher.major = major
		

			teachers.push(splicedTeacher)
			fs.writeFile('./data/teachers.json', JSON.stringify(teachers), err => {
			if (err) throw err

			res.render('teachers', {teachers: teachers, edited: true})
			})
		})
	}
})


app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`)
})

function id () {
	//return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase()
	return '_' + Math.random().toString(36).substr(2, 9);
}
