import { h, Component } from 'preact';
import { Link } from 'preact-router';
import style from './style';
import { route } from 'preact-router';

export default class Login extends Component {
	state = {
		username: '',
		password: '',
		errors: '',
		disabled: false
	};


	handleChange = e => {
		this.setState({ [e.target.id]: e.target.value });
	};


	login = e => {
		e.preventDefault();

		this.setState({
			errors: '',
			disabled: true
		});

		this.props.login(this.state.username, this.state.password).catch(ex => {
			this.setState({
				errors: 'Invalid username or password',
				disabled: false
			});
		});
	};


	render = ({ }, { username, password, errors, disabled }) => {
		return (
			<div class={ style.login }>
				<div class={ style.box }>
					<img 
						src='/assets/logo.png'
						class={ style.logo }
					/>

					<p class={ this.state.errors ? style.red : style.hidden }>
						{ this.state.errors }
					</p>

					<form
						method='post'
						onSubmit={ this.login }
					>
						<input
							id='username'
							type='text'
							placeholder='Username'
							value={ username }
							onChange={ this.handleChange }
							disabled={ disabled }
							class={ style['u-full-width'] }
						/>

						<input
							id='password'
							type='password'
							placeholder='Password'
							value={ password }
							onChange={ this.handleChange }
							disabled={ disabled }
							class={ style['u-full-width'] }
						/>

						<div class={ style.row + ' ' + style.right }>
							<input
								class={ style['button-primary'] }
								type='submit'
								value='Sign In'
							/>
						</div>
					</form>
				</div>
			</div>
		);
	}
}