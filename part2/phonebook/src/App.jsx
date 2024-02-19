import { useState, useEffect } from "react";
import personsServices from "./services/personsServices";
import Filter from "./components/Filter";
import NewContactForm from "./components/NewContactForm";
import PersonsDisplay from "./components/PersonsDisplay";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newPerson, setNewPerson] = useState({ name: "", number: "" });
  const [filterString, setFilterString] = useState("");
  const [notification, setNotification] = useState({
    message: null,
    className: null,
  });

  useEffect(() => {
    console.log("effect");
    personsServices.getAll().then((initialPersons) => {
      console.log("promise fulfilled");
      setPersons(initialPersons);
    });
  }, []);

  const handleSubmit = (event) => {
    const newName = newPerson.name;
    const newNumber = newPerson.number;
    event.preventDefault();
    if (persons.some((person) => person.name === newName)) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const person = persons.find((person) => person.name === newName);
        personsServices
          .update(person.id, { ...person, number: newNumber })
          .then((updatedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== updatedPerson.id ? person : updatedPerson
              )
            );
            setNewPerson({ name: "", number: "" });
            setNotification({
              message: `Person '${person.name}' was updated successfully`,
              className: "success",
            });
            setTimeout(() => {
              setNotification({ message: null, className: null });
            }, 5000);
          })
          .catch(() => {
            setNotification({
              message: `Person '${person.name}' has already been removed from server`,
              className: "error",
            });
            setTimeout(() => {
              setNotification({ message: null, className: null });
            }, 5000);
          });
      }
    } else {
      personsServices
        .create({ name: newName, number: newNumber })
        .then((createdPerson) => {
          setPersons(persons.concat(createdPerson));
          setNewPerson({ name: "", number: "" });
          setNotification({
            message: `Person '${createdPerson.name}' was created successfully`,
            className: "success",
          });
          setTimeout(() => {
            setNotification({ message: null, className: null });
          }, 5000);
        });
    }
  };

  const handleDelete = (event, id, name) => {
    event.preventDefault();
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      personsServices
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          setNotification({
            message: `Person '${name}' was deleted successfully`,
            className: "success",
          });
          setTimeout(() => {
            setNotification({ message: null, className: null });
          }, 5000);
        })
        .catch(() => {
          setNotification({
            message: `Person '${name}' has already been removed from server`,
            className: "error",
          });
          setTimeout(() => {
            setNotification({ message: null, className: null });
          }, 5000);
        });
    }
  };

  const personsDisplay = persons.filter((person) =>
    person.name.toLowerCase().includes(filterString.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter filterString={filterString} setFilterString={setFilterString} />
      <NewContactForm
        handleSubmit={handleSubmit}
        newPerson={newPerson}
        setNewPerson={setNewPerson}
      />
      <PersonsDisplay
        personsDisplay={personsDisplay}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default App;
