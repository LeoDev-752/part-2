import { useState, useEffect } from 'react'
import personService from './services/person'

const Filter = ({ searchTerm, handleSearchChange }) => (
  <div>
    filter shown with:
    <input value={searchTerm} onChange={handleSearchChange} />
  </div>
)

const AddPersons = ({ newName, newNumber, handleNameChange, handleNumberChange, addName }) => (
  <form onSubmit={addName}>
    <div>name: </div>
    <div><input value={newName} onChange={handleNameChange} /></div>
    <div>number: </div>
    <div><input value={newNumber} onChange={handleNumberChange} /></div>
    <div><button type="submit">add</button></div>
  </form>
)

const ShowPersons = ({ personsToShow, removePerson }) => (
  <ul>
    {personsToShow.map((person, index) =>
      <li
        key={index}>{person.name} {person.number}
        <button onClick={() => removePerson(person.id)}>delete</button>
      </li>
    )}
  </ul>
)

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  const notificationStyle = {
    color: type === 'error' ? 'red' : 'green',
    fontStyle: 'italic',
    fontSize: 30,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    margin: 5,
    padding: 10,
    border: `2px solid ${type === 'error' ? 'red' : 'green'}`,
  }

  return (
    <div style={notificationStyle}>
      {message}
    </div>
  )
}

const App = (props) => {
  // El efecto se ejecuta después de la 1era renderización por eso los estados estan vacíos y no nulos
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  // Los mensajes deben ser nulos para que no carguen los diseños css mientras no haya mensaje (tengo un control para que no peten si son null)
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPerson => {
        setPersons(initialPerson)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  // Se llama addname pero añade a una persona
  const addName = (event) => {
    event.preventDefault()
    const personObject = { name: newName, number: newNumber }

    const existingPerson = persons.find(person => person.name === newName) // tuve que definir una variable donde guardo la informacion del callback para poder utilizarla más abajo
    console.log(existingPerson)
    if (existingPerson) {
      if (window.confirm(`${existingPerson.name} is already added to phonebook, please replace the old number with a new one?`)) {
        const updatePerson = { ...existingPerson, number: newNumber }

        personService
          .update(existingPerson.id, updatePerson)
          .then(response => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : response.data))
            setMessage(`Updated ${newName}`)
            setNewName('')
            setNewNumber('')
            setTimeout(() => setMessage(null), 5000)
          })
      }
    } else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setMessage(`Added ${newName}`)
          setNewName('')
          setNewNumber('')
          setTimeout(() => setMessage(null), 5000)
        })
    }
  }

  const removePerson = (id) => {
    const personToRemove = persons.find(person => person.id === id)

    if (window.confirm(`Delete ${personToRemove.name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch(error => {
          setErrorMessage(`Information of ${personToRemove.name} has already been removed from the server.`)
          setTimeout(() => setErrorMessage(null), 5000)
        })
    }
  }

  // la expresión person.name && person.name se utiliza para asegurarse de que la propiedad name del objeto person existe y no es undefined
  const personsToShow = persons.filter(person =>
    person.name && person.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} type="success" />
      <Notification message={errorMessage} type="error" />
      <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
      <h2>add a new</h2>
      <AddPersons
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addName={addName}
      />
      <h2>Numbers</h2>
      <ShowPersons personsToShow={personsToShow} removePerson={removePerson} />
    </div>
  )
}

export default App

