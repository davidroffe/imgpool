import React from 'react';
import axios from 'axios';

class Single extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      post: { id: props.match.params.id || '', tag: [] }
    };

    this.handleTagClick = this.handleTagClick.bind(this);
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
  handleTagClick(e) {
    this.props.handleTagClick(
      e,
      () => this.props.history.push('/posts'),
      e.target.innerText
    );
  }
  render() {
    return (
      <section id="post-single">
        <div className="image-container">
          <img src={this.state.post.url} />
        </div>
        <div className="tags">
          {this.state.post.tag.map((tag, index) => {
            return (
              <button key={index} className="tag" onClick={this.handleTagClick}>
                {tag.name}
              </button>
            );
          })}
        </div>
      </section>
    );
  }
}

export default Single;
