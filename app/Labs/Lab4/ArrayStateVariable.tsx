import { useState } from "react";
import { Button, ListGroup, ListGroupItem } from "react-bootstrap";

export default function ArrayStateVariable() {
  const [array, setArray] = useState([1, 2, 3, 4, 5]);
  const addElement = () => {
    setArray([...array, Math.floor(Math.random() * 100)]);
  };
  const deleteElement = (index: number) => {
    setArray(array.filter((item, i) => i !== index));
  };
  return (
    <div id="wd-array-state-variables" className="container mt-4">
      <h2 className="mb-3">Array State Variable</h2>
      <Button variant="success" className="mb-3" onClick={addElement}>
        Add Element
      </Button>
      <ListGroup>
        {array.map((item, index) => (
          <ListGroupItem key={index} className="d-flex justify-content-between align-items-center">
            <span>{item}</span>
            <Button 
              variant="danger" 
              size="sm"
              onClick={() => deleteElement(index)}
            >
              Delete
            </Button>
          </ListGroupItem>
        ))}
      </ListGroup>
      <hr />
    </div>
  );
}
