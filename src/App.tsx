import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
  Dispatch,
  SetStateAction
} from 'react'
import { useForm } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'
import { v4 as uuid } from 'uuid'

/******************************************************************************/

type ApiResponse = {
  id: string
}

const fakeApiCall = (): Promise<ApiResponse> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: uuid()
      })
    }, 800)
  })

/******************************************************************************/

type Post = {
  id: string
  title: string
  post: string
}

type Commentary = {
  name: string
  email: string
  comment: string
}

/******************************************************************************/

type PostContextValues = ApiResponse & {
  setId: Dispatch<SetStateAction<string>>
}

const PostContext = createContext<PostContextValues>({} as PostContextValues)

type PostProviderProps = {
  children: ReactNode
}

const PostProvider = ({ children }: PostProviderProps) => {
  const [id, setId] = useState('')

  return (
    <PostContext.Provider
      value={{
        id,
        setId
      }}
    >
      {children}
    </PostContext.Provider>
  )
}

const usePost = () => useContext(PostContext)

/******************************************************************************/

type FormPostData = Omit<Post, 'id'>

const FormPost = () => {
  const { register, control, handleSubmit } = useForm<FormPostData>()
  const { id, setId } = usePost()
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async ({ title, post }: FormPostData) => {
    setIsLoading(true)

    console.log({ title, post })

    const { id: apiId } = await fakeApiCall()
    setId(apiId)

    setIsLoading(false)
  }

  return (
    <>
      {!!id && <h2 className="is-subtitle">{id}</h2>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="field">
          <label htmlFor="title" className="label">
            Título
          </label>
          <div className="control">
            <input
              id="title"
              name="title"
              type="text"
              className="input"
              ref={register}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="post" className="label">
            Post
          </label>
          <div className="control">
            <input
              id="post"
              name="post"
              type="text"
              className="input"
              ref={register}
            />
          </div>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button type="submit" className="button is-link">
              Submit
            </button>
          </div>
          <div className="control">
            <button
              type="reset"
              className="button is-dark"
              onClick={() => setId('')}
            >
              Clear ID
            </button>
          </div>
        </div>
      </form>

      {isLoading && <p className="is-text">Loading....</p>}

      <DevTool control={control} />
    </>
  )
}

/******************************************************************************/

const FormCommentary = () => {
  const { register, control, handleSubmit } = useForm<Commentary>()

  const onSubmit = ({ name, email, comment }: Commentary) => {
    console.log({ name, email, comment })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="field">
          <label htmlFor="name" className="label">
            Nome
          </label>
          <div className="control">
            <input
              id="name"
              name="name"
              type="text"
              className="input"
              ref={register}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="email" className="label">
            Email
          </label>
          <div className="control">
            <input
              id="email"
              name="email"
              type="email"
              className="input"
              ref={register}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="comment" className="label">
            Comentário
          </label>
          <div className="control">
            <input
              id="comment"
              name="comment"
              type="text"
              className="input"
              ref={register}
            />
          </div>
        </div>

        <div className="control">
          <button type="submit" className="button is-link">
            Submit
          </button>
        </div>
      </form>
      <DevTool control={control} />
    </>
  )
}

/******************************************************************************/

const PostContainer = () => {
  const { id, setId } = usePost()

  return (
    <div className="container">
      <div className="box mb-4">
        <FormPost />
      </div>

      {id && (
        <div className="box">
          <FormCommentary />
        </div>
      )}
    </div>
  )
}

/******************************************************************************/

const App = () => {
  return (
    <PostProvider>
      <main className="is-flex is-flex-direction-column is-align-items-center is-justify-content-start">
        <h1 className="title is-1 is-dark mb-6">Salve pra firma</h1>
        <PostContainer />
      </main>
    </PostProvider>
  )
}

export default App
