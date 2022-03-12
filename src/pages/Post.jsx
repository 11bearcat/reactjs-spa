import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {useFetching} from "../hooks/useFetching";
import PostService from "../API/PostService";
import Loader from "../components/UI/loader/Loader";

const Post = () => {
	const params = useParams()
	const [post, setPost] = useState({})
	const [comments, setComments] = useState([])
	const [fetchPostById, isLoading] = useFetching(async (id) => {
		const response = await PostService.getById(id)
		setPost(response.data)
	})
	const [fetchCommentsByPostId, isCommentsLoading] = useFetching(async (id) => {
		const response = await PostService.getCommentsByPostId(id)
		setComments(response.data)
	})

	useEffect(() => {
		fetchPostById(params.id).then()
		fetchCommentsByPostId(params.id).then()
	}, [])
	return (
		<div>
			<h1>Вы открыли страницу поста c ID = {params.id}</h1>
			{isLoading
				? <Loader/>
				: <div>{post.id}, {post.title}</div>
			}
			<h1>Коментарии</h1>
			{isCommentsLoading
				? <Loader/>
				: <div>
					{comments.map(comm =>
						<div key={comm.id} style={{marginTop: 15} }>
							<h5>{comm.email}</h5>
							<div>{comm.body}</div>
						</div>
					)}
					</div>
			}
		</div>
	);
};

export default Post;