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
    let tagActive,
      tagsActive = false;

    for (var i = 0; i < tags.length; i++) {
      if (tags[i].active) tagsActive = true;
    }

    if (tagsActive) {
      for (var i = 0; i < posts.length; i++) {
        tagActive = false;

        for (var j = 0; j < posts[i].tag.length; j++) {
          for (var k = 0; k < tags.length; k++) {
            if (tags[k].active && tags[k].id === posts[i].tag[j].id) {
              tagActive = true;
            }
          }
          if (tagActive) {
            activePosts.push(posts[i]);
            break;
          }
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
