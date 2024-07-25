import { useEffect, useState } from 'react'
import { fetchPosts, deletePost, updatePost } from '../api'
import { Post, PostDetail } from './PostDetail'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
const maxPostPage = 10

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)

  const queryClient = useQueryClient()

  useEffect(() => {
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1
      queryClient.prefetchQuery({
        queryKey: ['posts', nextPage],
        queryFn: () => fetchPosts(nextPage)
      })
    }
  }, [currentPage, queryClient])

  // replace with useQuery
  const { data, isError, isLoading } = useQuery({
    queryKey: ['posts', currentPage],
    queryFn: () => fetchPosts(currentPage),
    staleTime: 2000
  })

  const deletePosts = useMutation({
    mutationFn: (postId: number) => deletePost(postId)
  })

  const updatePosts = useMutation({
    mutationFn: (postId: number) => updatePost(postId)
  })

  const handleNextPage = () => {
    if (currentPage < maxPostPage) {
      setCurrentPage((prevState) => prevState + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1 && currentPage <= maxPostPage) {
      setCurrentPage((prevState) => prevState - 1)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (isError) {
    return <div>Error fetching posts</div>
  }

  console.log({ data })

  return (
    <>
      <ul>
        {data?.map((post: Post) => (
          <li
            key={post.id}
            className='post-title'
            onClick={() => {
              deletePosts.reset()
              updatePosts.reset()
              setSelectedPost(post)
            }}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className='pages'>
        <button disabled={currentPage <= 1} onClick={handlePrevPage}>
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button disabled={currentPage === maxPostPage} onClick={handleNextPage}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && (
        <PostDetail
          deleteMutation={deletePosts}
          post={selectedPost}
          updateMutation={updatePosts}
        />
      )}
    </>
  )
}
