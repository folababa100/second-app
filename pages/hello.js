import React, {Component} from 'react';

class HelloPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [
        {
          id: '1',
          name: 'Hello 1',
          body: 'Wassup People 1'
        },
        {
          id: '2',
          name: 'Hello 2',
          body: 'Wassup People 2'
        },
        {
          id: '3',
          name: 'Hello 3',
          body: 'Wassup People 3'
        },
        {
          id: '4',
          name: 'Hello 4',
          body: 'Wassup People 4'
        },
        {
          id: '5',
          name: 'Hello 5',
          body: 'Wassup People 5'
        }
      ]
    }
  }
  render() {
    return (
      <div className="overall">
        {
          this.state.data.map((dat) => {
            return (
              <div key={dat.id} className="container">
                <p className="name">{dat.name}</p>
                <p className="body">{dat.body}</p>
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default HelloPage;
