import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Post = () => {
  const navigate = useNavigate();
  const [twit, setTwit] = useState("");
  const [post, setPost] = useState([]);
  const [comment, setComment] = useState(false);
  const [commentPosts, setCommentPosts] = useState("");
  const [comments, setComments] = useState("");
  let data = {
    twit: twit,
  };

  let commentP = {
    comment: commentPosts,
  };
  const PostTwit = () => {
    axios.post(`https://twiteeex.herokuapp.com/v1/posts`, data, {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
    });

    window.location.reload();
  };

  useEffect(() => {

    if(!localStorage.getItem("token"))
    {
      navigate("/");
    }

    axios
      .get(`https://twiteeex.herokuapp.com/v1/posts`, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setPost(res.data.data);
      });
  }, [twit, navigate]);

  const RemovePost = (id) => {
    axios.delete(`https://twiteeex.herokuapp.com/v1/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
    });

    setTimeout(() => {
      window.location.reload();
    }, 4000);
  };

  const commentPost = (id) => {
    setComment(!false);
    localStorage.setItem("id", id);
    axios
      .get(`https://twiteeex.herokuapp.com/v1/posts/comments/${id}`, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setCommentPosts(res.data.data.comment);
      });
  };

  const commentPostx = (id) => {
    localStorage.setItem("id", id);
    axios
      .get(`https://twiteeex.herokuapp.com/v1/posts/comments/${id}`, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res.data.data);
        setComments(res.data.data);
      });
  };

  const PostComment = () => {
    axios.post(
      `https://twiteeex.herokuapp.com/v1/post_comment/${localStorage.getItem(
        "id"
      )}`,
      commentP,
      {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      }
    );
    setComment(false);

  };
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "40%",
          paddingTop: 30,
          marginLeft: "2rem",
        }}
      >
        <input
          placeholder="Type a post..."
          className="post_inp"
          onChange={(e) => setTwit(e.target.value)}
        />
        <br />
        <button className="post_but" onClick={PostTwit}>
          Post Twit
        </button>
      </div>
      <div
        style={{
          width: "70%",
          height: 500,
          marginTop: "3rem",
          marginLeft: "2rem",
          overflowY: "scroll",
        }}
      >
        
        <table>
          <thead>
            <tr>
              <th>Nos</th>
              <th>Name</th>
              <th>Post</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {post.map((item, i) => {
              return (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.post_data}</td>
                  <td>
                    {item.name === localStorage.getItem("name") ? (
                      <button onClick={() => RemovePost(item.twit_id)}>
                        Delete
                      </button>
                    ) : (
                      ""
                    )}
                  </td>
                  <td>
                    <button onClick={() => commentPost(item.twit_id)}>
                      Comment
                    </button>
                    <button onClick={() => commentPostx(item.twit_id)}>
                      View Comments
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <br />
        <br />
        <p>Comments</p>

        {comment === true ? (
          <div
            style={{
              width: 1100,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              marginTop: "5rem",
            }}
          >
            <p>{comment}</p>
            <br />
            <input
              placeholder="Type a post..."
              className="comment_inp"
              onChange={(e) => setCommentPosts(e.target.value)}
            />
            &nbsp;
            <button className="comment_but" onClick={PostComment}>
              Comment
            </button>
          </div>
        ) : 
        ( Array.isArray(comments))? 
        <table>
        <thead>
          <tr>
            <th>Nos</th>
            <th>Comment</th>
            <th>Date Commented</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((item, i) => {
          return (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{item.comment}</td>
              <td>{item.date_commented}</td>
            </tr>
          );
          })}
        </tbody>
      </table>
        : 
        <table>
        <thead>
          <tr>
            <th>Nos</th>
            <th>Comment</th>
            <th>Date Commented</th>
          </tr>
        </thead>
        <tbody>
          <td>1</td>
          <td>{comments.comment}</td>
          <td>{comments.date_commented}</td>
        </tbody>
      </table>

        }
      </div>
    </div>
  );
};

export default Post;
