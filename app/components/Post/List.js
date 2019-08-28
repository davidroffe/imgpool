import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: []
    };
  }
  componentDidMount() {
    axios.get('/api/post/list').then(res => {
      this.setState({ posts: res.data });
    });
  }
  render() {
    return (
      <section id="post-list">
        {this.state.posts.map((post, index) => {
          return (
            <Link key={index} to={'/post/' + post.id} className="post-item">
              <img src={post.thumbUrl} />
            </Link>
          );
        })}
      </section>
    );
  }
}

export default List;
