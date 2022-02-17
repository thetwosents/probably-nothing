import React, { useEffect } from "react";
import Draggable from 'react-draggable';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCJUINANA7kw6hXiX684vZV6ds9hmYOpW0",
  authDomain: "gatekeeper-d13f9.firebaseapp.com",
  databaseURL: "https://gatekeeper-d13f9-default-rtdb.firebaseio.com",
  projectId: "gatekeeper-d13f9",
  storageBucket: "gatekeeper-d13f9.appspot.com",
  messagingSenderId: "602825357952",
  appId: "1:602825357952:web:037e39f9448c077e374465"
};

const app = initializeApp(firebaseConfig);

// Get a reference to the database service
const database = getDatabase(app);

const conversation = [
  {
    id: 1,
    screenName: 'Neo',
    text: 'Are you ready?'
  }
];

const minimize = () => {
  console.log('minimize');
  // Add class to .header
  document.querySelector('.instant-messenger').classList.add('minimized');
}

const maximize = () => {
  console.log('maximize');
  // Remove class from .header
  document.querySelector('.instant-messenger').classList.remove('minimized');
}

const Title = (props) => {
  const {chatName} = props;
  return (
    <div className="header">
      {chatName} - DIM
      <ul className="header__links">
        <li className="header__minimize" 
        onClick={minimize}
        >_</li>
        <li className="header__maximize" onClick={maximize}>[]</li>
        {/* <li className="header__close">&times;</li> */}
      </ul>
    </div>
  );
}

const Navbar = ({chatName}) => {
  return (
    <nav className="nav">
      <ul className="nav__list">
        <li className="nav__item">File</li>
        <li className="nav__item">Edit</li>
        <li className="nav__item">Import</li>
      </ul>
      <span className="nav__warning-level">{chatName} Members Online: 1</span>
    </nav>
  );
}

const MessageItem = ({message, screenName, className}) => {
  return (
    <div className={`message-item ${className}`}>
      <div className="message-item__screenname">{screenName}:</div>
      {message.message}
    </div>
  )
}

const MessageList = (props) => {
  const [messages, setMessages] = React.useState([]);

  // Monitor the onValue for any reference to "berserker" in the text
  // If it's found, add a class to the message-item
  
  // Use firebase 
  const commandRef = ref(database, 'commands');
  onValue(commandRef, (snapshot) => {
    const data = snapshot.val();
    // data is a snapshot.val() object for it will not be a traditional array. To transform it we need to use Object.keys()
    const keys = Object.keys(data);
    const newMessages = keys.map((key) => {
      const message = data[key];
      return {
        ...message,
        id: key
      }
    });

    if (messages.length !== newMessages.length) {
      setMessages(newMessages);
    }
  });

  useEffect(() => {
    console.log('MessageList: useEffect');
    console.log(messages);
  }, [messages]);

  const { messageData, screenName, chatName } = props;
  const currentMessage = { text: "We've been waiting for you.", id: 1 };
  return (
    <div className="message-list">
      <div className="message-list__container">
        {
          messages.map((message, i) => {
            return (
              <MessageItem message={message} screenName={message.author} key={i}/>
            );
          })
        }
      </div>
    </div>
  );
}

const CustomizeRow = (props) => {
  return (
    <div className='customize-row'>
      <div className='customize-row__set'>
        <button className='customize-row__button text-blue'>🪐</button>
        <button className='customize-row__button background-blue'>💽</button>
      </div>

      <div className='customize-row__set'>
        <button className='customize-row__button small-a'>🛒	</button>
        <button className='customize-row__button medium-a'>🎧	</button>
        <button className='customize-row__button large-a'>📟</button>
      </div>

      <div className='customize-row__set'>
        <button className='customize-row__button bold-text'>🎪</button>
        <button className='customize-row__button italic-text'>🏟</button>
        <button className='customize-row__button underline-text'>🌍</button>
      </div>
      <div className='customize-row__set'>
        <button className='customize-row__button link-text'>🥂</button>
      </div>
    </div>
  );
}

const MessageForm = ({value, addedMessage, onChange}) => {
  const disabledClass = !value.length ? 'message-form__submit--disabled' : null;
  return (
    <form className="message-form" onSubmit={(e)=> {addedMessage(e, value)}}>
      <textarea
        className="message-form__textarea"
        value={value}
        onChange={onChange}
      />
      <div className="message-form__actions">
        <button
          type="button"
          onClick={(e)=> {addedMessage(e, value)}}
          disabled={!value.length}
          className={`message-form__submit ${disabledClass}`}></button>
      </div>
    </form>
  );
}

let messageId = 0;

class InstantMessenger extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chatName: "NeoDAO",
      screenName: "neo",
      data: [],
      value: ""
    };

  }

  addedMessage = (e, val) => {
    e.preventDefault();
    const message = {text: val, id: messageId++};
    this.state.data.push(message);
    this.setState({data: this.state.data, value: ""});
  };
  
  handleChange = (event) => {
    this.setState({value: event.target.value});
  };
  
  render() {
    const { data, chatName, screenName, value } = this.state;
    return (
      <Draggable>
      <div className="instant-messenger">
        <Title chatName={chatName} />
        <Navbar chatName={chatName} />
        <MessageList
          messageData={data}
          screenName={screenName}
          chatName={chatName}
        />
        <CustomizeRow />
        <MessageForm
          addedMessage={this.addedMessage}
          onChange={this.handleChange}
          value={value}
        />
      </div>
      </Draggable>
    );
  }
}

export default InstantMessenger;