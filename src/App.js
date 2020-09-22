import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post.js';
import { db, auth } from './firebase.js';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload.js';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`,
	};
}

const useStyles = makeStyles((theme) => ({
	paper: {
		position: 'absolute',
		width: 400,
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
}));

function App() {
	const classes = useStyles();
	const [modalStyle] = React.useState(getModalStyle);

	const [posts, setPosts] = useState([]); // post state
	const [open, setOpen] = useState(false); // modal state
	const [openSignIn, setOpenSignIn] = useState(false); // signIn state
	const [username, setUserName] = useState(''); // username state
	const [email, setEmail] = useState(''); // email state
	const [password, setPassword] = useState(''); // password state
	const [user, setUser] = useState(null); // user state

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((authUser) => {
			if (authUser) {
				//user has logged in...
				console.log(authUser);
				setUser(authUser);
			} else {
				// user has logged out

				setUser(null);
			}
		});

		return () => {
			// perform some cleanup action
			unsubscribe();
		};
	}, [user, username]);

	useEffect(() => {
		db.collection('posts').onSnapshot((snapshot) => {
			setPosts(
				snapshot.docs.map((doc) => ({
					id: doc.id,
					post: doc.data(),
				}))
			);
		});
	}, []);

	const signup = (event) => {
		event.preventDefault();

		// create user with email and password
		auth
			.createUserWithEmailAndPassword(email, password)
			.then((authUser) => {
				return authUser.user.updateProfile({
					displayName: username,
				});
			})
			.catch((error) => alert(error.message));

		console.log('display name is ', username);
		setOpen(false);
	};

	const signin = (event) => {
		event.preventDefault();

		auth
			.signInWithEmailAndPassword(email, password)
			.catch((error) => alert(error.message));

		setOpenSignIn(false);
	};

	return (
		<div className="app">
			<Modal open={open} onClose={() => setOpen(false)}>
				<div style={modalStyle} className={classes.paper}>
					<form className="app__signUp">
						<center>
							<img
								className="app__headerImage"
								src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1024px-Instagram_logo.svg.png"
								style={{
									width: 100,
								}}
								alt="instagram logo"
							/>
						</center>
						<Input
							type="text"
							placeholder="username"
							value={username}
							onChange={(event) => setUserName(event.target.value)}
						></Input>
						<Input
							type="text"
							placeholder="email"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
						></Input>
						<Input
							type="text"
							placeholder="password"
							value={password}
							onChange={(event) => setPassword(event.target.value)}
						></Input>
						<Button type="submit" onClick={signup}>
							Sign Up
						</Button>
					</form>
				</div>
			</Modal>

			<Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
				<div style={modalStyle} className={classes.paper}>
					<form className="app__signIn">
						<center>
							<img
								className="app__headerImage"
								src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1024px-Instagram_logo.svg.png"
								style={{
									width: 100,
								}}
								alt="instagram logo"
							/>
						</center>
						<Input
							type="text"
							placeholder="email"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
						></Input>
						<Input
							type="text"
							placeholder="password"
							value={password}
							onChange={(event) => setPassword(event.target.value)}
						></Input>
						<Button type="submit" onClick={signin}>
							Sign In
						</Button>
					</form>
				</div>
			</Modal>

			<div className="app__header">
				<img
					className="app__headerImage"
					src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1024px-Instagram_logo.svg.png"
					style={{ width: 100 }}
					alt="instagram logo"
				/>

				{user ? (
					<Button onClick={() => auth.signOut()}>Log Out</Button>
				) : (
					<div className="app__lgoinContainer">
						<Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
						<Button onClick={() => setOpen(true)}>Sign Up</Button>
					</div>
				)}
			</div>

			<div className="app__posts">
				<div className="app__postsLeft">
					{posts.map(({ id, post }) => {
						return (
							<Post
								key={id}
								postId={id}
								user={user}
								username={post.username}
								caption={post.caption}
								imageUrl={post.imageUrl}
							/>
						);
					})}
				</div>

				<div className="app__postsRight">
					<InstagramEmbed
						url="https://instagr.am/p/Zw9o4/"
						maxWidth={320}
						hideCaption={false}
						containerTagName="div"
						protocol=""
						injectScript
						onLoading={() => {}}
						onSuccess={() => {}}
						onAfterRender={() => {}}
						onFailure={() => {}}
					/>
				</div>
			</div>

			{user?.displayName ? (
				<ImageUpload username={user.displayName} />
			) : (
				<h3>Login to Upload</h3>
			)}
		</div>
	);
}

export default App;
