const PersonsDisplay = ({ personsDisplay, handleDelete }) => {
  return (
    <>
      <h2>Numbers</h2>
      {personsDisplay.map((person) => (
        <div key={person.id}>
          {person.name} {person.number}
          <button onClick={(event) => handleDelete(event, person.id, person.name)}>Delete</button>
        </div>
      ))}
    </>
  );
};
export default PersonsDisplay;
