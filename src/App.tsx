import "./styles.css";
import Form from "./components/Form";
/*
This is the takehome version of the challenge Signup Form.

In this version, you are to design and build a reusable and extensible
Form component, and apply it to the use case of a Signup Form.

Signup Form:

Build a user Signup form in React with the following features.

1. An email and a password input
2. Email must have an “@” and the domain side must include a “.”
3. Password must include
    1.  at least one special character
    2. one number and be at least 8 characters
4. Submission request handling
   1. Utilize the mock API function to handle submissions
5. Basic aesthetics with pure CSS


------------------------------------


*/

export default function App() {
  return (
    <div className="App">
      <h1>Signup Form </h1>
      <Form />
    </div>
  );
}
