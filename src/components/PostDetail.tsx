// import { fetchComments } from "./api";

import { UseMutationResult, useQuery } from '@tanstack/react-query'
import { fetchComments } from '../api'

export type Post = {
  userId: string
  id: number
  title: string
  body: string
}

type PostDetailProps = {
  post: Post
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deleteMutation: UseMutationResult<any, Error, number, unknown>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateMutation: UseMutationResult<any, Error, number, unknown>
}

export type Comment = {
  postId: number
  id: number
  name: string
  email: string
  body: string
}

export function PostDetail({
  post,
  deleteMutation,
  updateMutation
}: PostDetailProps) {
  // replace with useQuery
  const { data, isError, isLoading } = useQuery({
    queryKey: ['comments', post.id],
    queryFn: () => fetchComments(post.id),
    staleTime: 2000
  })

  if (isLoading) {
    return <div>Loading comments...</div>
  }

  if (isError) {
    return <div>Error fetching comments</div>
  }

  return (
    <>
      <h3 style={{ color: 'blue' }}>{post.title}</h3>
      <div>
        <button onClick={() => deleteMutation.mutate(post?.id)}>Delete</button>{' '}
        {deleteMutation?.isPending && (
          <p className='loading'>Deleting the post</p>
        )}
        {deleteMutation?.isError && (
          <p className='error'>
            Error deleting the post: {deleteMutation?.error.toString()}
          </p>
        )}
        {deleteMutation?.isSuccess && (
          <p className='success'>Post deleted successfully</p>
        )}
      </div>
      <div>
        <button onClick={() => updateMutation?.mutate(post?.id)}>
          Update title
        </button>
        {updateMutation?.isPending && (
          <p className='loading'>Updating post title...</p>
        )}
        {updateMutation?.isError && (
          <p className='error'>
            Error updating post title: {updateMutation?.error.toString()}
          </p>
        )}
        {updateMutation?.isSuccess && (
          <p className='success'>Post title updated successfully</p>
        )}
      </div>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment: Comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  )
}
