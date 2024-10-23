import { useState, useEffect } from 'react'
import personService from './services/person';

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

const App = (props) => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

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

  const addName = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }

    if (persons.some(person => person.name === newName)) {
      window.alert(`${newName} is already added to phonebook`)
    } else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          console.log(returnedPerson)
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
    }
  }

  const removePerson = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta persona?")) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
        })
        .catch(error => {
          console.error("Error al eliminar la persona:", error);
          window.alert("Error al eliminar la persona. Inténtalo de nuevo.");
        });
    }
  }

  // la expresión person.name && person.name se utiliza para asegurarse de que la propiedad name del objeto person existe y no es undefined
  const personsToShow = persons.filter(person =>
    person.name && person.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
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

