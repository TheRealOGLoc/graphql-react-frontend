import { useMutation, useQuery } from "@apollo/client"
import { getAll } from "./graphql/query"
import { CREATE_POST, DELETE_POST } from "./graphql/mutation"
import { useState } from "react"

function App() {
  const { loading, error, data, refetch } = useQuery(getAll)
  const [createPost, { createErr }] = useMutation(CREATE_POST)
  const [deletePost, { deleteErr }] = useMutation(DELETE_POST)
  const [post, setPost] = useState({
    title: "",
    description: ""
  })

  if (loading) {
    return "Loading"
  }

  if (error) {
    return "Error"
  }

  const _handleChange = (e) => {
    const { name, value } = e.target
    setPost((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  const addPost = async () => {
    await createPost({
      variables: {
        title: post.title,
        description: post.description
      }
    }
    )
    refetch()
    console.log("success")
  }

  const removePost = async (id) => {
    await deletePost({
      variables: {
        id
      }
    })
    refetch()
  }

  return (
    <div className="App">
      {
        data.getAll.map((data, index) => {
          return <div key={index} >
            <p>Title: {data.title} | Description: {data.description}</p>
            <button onClick={async () => await removePost(data.id)} >Remove Post</button>
          </div>
        })
      }
      <div>-------------------</div>
      <div>
        <input placeholder="title" name="title" onChange={_handleChange} ></input>
        <br />
        <input placeholder="description" name="description" onChange={_handleChange} ></input>
      </div>
      <button onClick={addPost}>Add a Post</button>
    </div>
  );
}

export default App;
