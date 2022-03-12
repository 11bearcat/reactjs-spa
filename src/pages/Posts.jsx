import React, {useEffect, useRef, useState} from 'react'
import PostList from "../components/PostList";
import PostForm from "../components/PostForm";
import PostFilter from "../components/PostFilter";
import MyModal from "../components/UI/modal/MyModal";
import MyButton from "../components/UI/button/MyButton";
import Loader from "../components/UI/loader/Loader";
import PostService from "../API/PostService";
import {usePosts} from "../hooks/usePost";
import {useFetching} from "../hooks/useFetching";
import {getPageCount} from "../utils/pages";
import {useObserver} from "../hooks/useObserver";
import '../styles/App.css'
import MySelect from "../components/UI/select/MySelect";


const Posts = () => {
	const [modal, setModal] = useState(false)
	const [posts, setPosts] = useState([])
	const [filter, setFilter] = useState({sort: '', query: ''})
	const [totalPages, setTotalPages] = useState(0)
	const [limit, setLimit] = useState(10)
	const [page, setPage] = useState(1)
	const [fetchPosts, isPostsLoading, postError] = useFetching(async () => {
		const response = await PostService.getAll(limit, page)
		setPosts([...posts, ...response.data])
		const totalCount = response.headers['x-total-count']
		setTotalPages(getPageCount(totalCount, limit))
	})
	const sortedAndSearchPosts = usePosts(posts, filter.sort, filter.query)
	const lastElement = useRef()

	useObserver(lastElement, page < totalPages, isPostsLoading, () => {
	 setTimeout(() => {
		 setPage(page + 1)
	 }, 300)
	})

	useEffect(() => {
		fetchPosts().then()
	}, [page, limit])

	const createPost = (newPost) => {
		setPosts([...posts, newPost])
		setModal(false)
	}

	const removePost = (post) => {
		setPosts(posts.filter(p => p.id !== post.id))
	}

	const changePage = (p) => {
		setPage(p)
	}

	return (
		<div className="App">
			<MyButton style={{marginTop: '30px'}} onClick={() => {setModal(true)}}>
				Создать пост
			</MyButton>

			<MyModal visible={modal} setVisible={setModal}>
				<PostForm create={createPost}/>
			</MyModal>

			<hr style={{margin: '15px 0'}}/>
			<PostFilter filter={filter} setFilter={setFilter} />
			<MySelect
				value={limit}
				onChange={value => setLimit(value)}
				defaultValue="Кол-во элементов на странице"
				options={[
					{value: 5, name: '5'},
					{value: 10, name: '10'},
					{value: 20, name: '20'},
					{value: -1, name: 'Показать все'},
				]}
			/>
			{postError && <h1>Произошла ошибка {postError}</h1> }
			<PostList remove={removePost} posts={sortedAndSearchPosts} title={'Список постов'}/>
			<div ref={lastElement} style={{height: 20, background: 'red'}} />
			{isPostsLoading
					&& <div style={{ display: 'flex', justifyContent: 'center', marginTop: 50}}> <Loader/> </div>}
			{/*<Pagination page={page} changePage={changePage} totalPages={totalPages}/>*/}
		</div>
	);
}

export default Posts;
