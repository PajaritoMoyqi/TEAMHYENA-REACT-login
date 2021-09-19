import './App.css';
import { useRef, useState } from 'react';

import axios from "axios";

import writingsArr from './writing.json';

const getRandomUser = async () => {
  try {
    const data = await axios.get("https://random-data-api.com/api/users/random_user");
    return data;
  } catch(err) {
    console.log("error: ", err);
  }
}

const App = () => {

  const initialInfo = {
    login: false,
    name: '',
    birthDate: '',
    address: '',
    email: '',
    phoneNumber: '',
    subscription: {},
    employment: '',
    alert: false
  }

  const [info, setInfo] = useState(initialInfo);

  const nameInput = useRef();
  const pwInput = useRef();

  const { login, name, birthDate, address, email, phoneNumber, subscription, employment, alert } = info;

  const submitUser = () => {

    if(!nameInput.current.value || !pwInput.current.value) {
      setInfo({
        ...info,
        alert: true
      });
      
      nameInput.current.value = '';
      pwInput.current.value = '';

      return;
    }

    getRandomUser()
      .then(raw => {
        
        nameInput.current.value = '';
        pwInput.current.value = '';

        const {country, state, city, street_name, street_address, zip_code} = raw.data.address;
        setInfo({
          ...info,
          login: true,
          name: raw.data.first_name + ' ' + raw.data.last_name,
          birthDate: raw.data.date_of_birth,
          address: `${street_address}, ${street_name}, ${city}, ${state}, ${zip_code} ${country}`,
          email: raw.data.email,
          phoneNumber: raw.data.phone_number,
          subscription: raw.data.subscription,
          employment: raw.data.employment.title,
          alert: false
        })

      });
  }

  const logoutUser = () => {
    setInfo({
      ...info,
      ...initialInfo
    });
  }

  return (
    <div className="App">
      <div className="App-container">
        <header className="App-header">
          <h1>Login Mini Project</h1>
        </header>
        <section className="App-section">
          <div className="input-box">
            { 
              login ?
                <input className="logout-btn" type="button" value="Logout" onClick={logoutUser} />
              :
                <>
                  <label>User Name</label>
                  <input name="housename" type="text" placeholder="User Name" ref={nameInput} required autoFocus />
                  <label>Password</label>
                  <input name="password" type="password" placeholder="Password" ref={pwInput} required />
                  <input type="button" value="Login" onClick={submitUser} />
                </>
            }
            {alert && <p className="alert-msg">You need to enter both id and pw</p>}
          </div>
          <div className="output-box">
            <p><strong>{login && `Wellcome, ${name}`}</strong></p>
            <div className="personal-data-box">
              {login && <p><strong>Date of Birth : </strong> {birthDate}</p>}
              {login && <p><strong>Address : </strong> {address}</p>}
              {login && <p><strong>Email : </strong> {email}</p>}
              {login && <p><strong>Phone Number : </strong> {phoneNumber}</p>}
              {login && <p><strong>Job : </strong> {employment}</p>}
              {login && (<p><strong>Subscription : </strong> {subscription ? "yes" : "no"}</p>)}
            </div>
          </div>
          {
            login && <div className="table-box">
              <table>
                <thead>
                  <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>글쓴이</th>
                    <th>날짜</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    writingsArr.map((item, idx) => {
                      return (
                        <tr key={idx+1}>
                          <td>{idx+1}</td>
                          <td>{item.title}</td>
                          <td>{item.author}</td>
                          <td>{item.date}</td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </div>
          }
        </section>
      </div>
    </div>
  );
}

export default App;
