import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import TagMenu from '../TagMenu';

class List extends React.Component {
  constructor(props) {
    super(props);

    this.getActivePosts = this.getActivePosts.bind(this);
    this.state = { tagMenu: false };
  }
  componentDidMount() {
    axios.get('/api/post/list').then(res => {
      this.props.setPostList(res.data);
    });
  }
  getActivePosts() {
    if (this.props.posts.length === 0 || this.props.tags.length === 0) {
      return this.props.posts;
    }

    const tags = this.props.tags;
    let posts = this.props.posts;
    let activePosts = [];
    let activeTags = [];
    let tagsActive;

    for (let i = 0; i < tags.length; i++) {
      if (tags[i].active) activeTags.push(tags[i]);
    }

    if (activeTags.length) {
      for (let i = 0; i < posts.length; i++) {
        tagsActive = 0;

        for (let j = 0; j < activeTags.length; j++) {
          for (let k = 0; k < posts[i].tag.length; k++) {
            if (activeTags[j].id === posts[i].tag[k].id) {
              tagsActive++;
            }
          }
        }
        if (tagsActive === activeTags.length) {
          activePosts.push(posts[i]);
        }
      }
    } else {
      activePosts = this.props.posts;
    }

    return activePosts;
  }
  render() {
    return (
      <section id="post-list">
        <TagMenu
          isActive={this.state.tagMenu}
          toggleMenu={this.toggleTagMenu}
          toggleTag={this.props.toggleTag}
          tags={this.props.tags}
        />
        {this.getActivePosts().map((post, index) => {
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
