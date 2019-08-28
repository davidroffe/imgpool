import React from 'react';
import axios from 'axios';

class Single extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      post: { id: props.match.params.id || '' }
    };
  }
  componentDidMount() {
    axios
      .get('/api/post/single', {
        params: { id: this.state.post.id }
      })
      .then(res => {
        this.setState({ post: res.data });
      });
  }
  render() {
    return (
      <section id="post-single">
        <img src={this.state.post.url} />
      </section>
    );
  }
}

export default Single;
