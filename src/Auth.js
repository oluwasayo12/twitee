import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [validationError, setValidationError] = useState("")
  let data = {
    email: email,
    password: password,
  };

  const HandleRegister = () => {
    axios.post(`https://twiteeex.herokuapp.com/v1/register`, data, {
      "headers": {
        'Content-Type': 'application/json',
      }}).then((res) => {
      // console.log(res.data.message);
      setValidationError(res.data.message)

    }).catch(error => {
          let errorResponse = error.response.data
          if(errorResponse.status === false && 'data' in errorResponse)
          {
            //check if error data is an array
            if(Array.isArray(errorResponse.data)){
              let errorData = errorResponse.data
              for (let index = 0; index < errorData.length; index++) {
                const errorMessage = errorData[index].msg;
                // console.log(errorMessage)
                setValidationError(errorMessage);
                
              }
            }
          }
          if(errorResponse.status === false && 'error' in errorResponse)
          {
            setValidationError(errorResponse.error.error_message);
          }
      });
  };

  const HandleLogin = () => {
    axios.post(`https://twiteeex.herokuapp.com/v1/login`, data).then((res) => {
      // console.log(res.data);
      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("name", res.data.data.name);
      if (res.data.message === "login successful") {
        setMessage(res.data.message);
        navigate("/posts");
      }
    }).catch(error => {
        let errorResponse = error.response.data
        if(errorResponse.status === false && 'data' in errorResponse)
        {
          //check if error data is an array
          if(Array.isArray(errorResponse.data)){
            let errorData = errorResponse.data
            for (let index = 0; index < errorData.length; index++) {
              const errorMessage = errorData[index].msg;
              // console.log(errorMessage)
              setMessage(errorMessage);
              
            }
          }
        }
        if(errorResponse.status === false && 'error' in errorResponse)
        {
          setMessage(errorResponse.error.error_message);
        }
    });
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "50%",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <input
          type="email"
          className="inp"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          type="password"
          className="inp"
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button className="inp_but" onClick={HandleLogin}>
          Login
        </button>
        <small style={{ color: "red" }}>{message}</small>
      </div>
      <div
        style={{
          width: "50%",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderLeft: "1px solid gray",
        }}
      >
        <input
          type="email"
          className="inp"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          type="text"
          className="inp"
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        {validationError.length > 0 &&
                  <p>{validationError}</p>
                }
        <button className="inp_but" onClick={HandleRegister}>
          Register
        </button>
      </div>
    </div>
  );
};

export default Auth;
