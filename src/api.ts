import axios from 'axios'

export async function fetchPosts(pageNum: number = 1) {
  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`
  )
  return response.data
}

export async function fetchComments(postId: number) {
  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  )
  return response.data
}

export async function deletePost(postId: number) {
  const response = await axios.delete(
    `https://jsonplaceholder.typicode.com/posts/${postId}`
  )
  return response.data
}

export async function updatePost(postId: number) {
  const response = await axios.patch(
    `https://jsonplaceholder.typicode.com/posts/${postId}`,
    { title: 'God is the GREATEST!! The King of Kings!!' }
  )
  return response.data
}
