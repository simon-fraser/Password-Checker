import { SHA1 } from 'crypto-js';
import React from 'react';

import { numberWithCommas } from './functions';
import Breaches from './Breaches';

import './App.css';

class App extends React.Component {
	constructor(props, context) {
		super(props, context)

		this.state = {
			explainModal: false,
			messageClass: 'is-invisible',
			messageSentance: '',
			messageTitle: '',
			passwordSuffix: '',
			rangeValue: '',
			working: false
		}
	}

	handleKeyPress(target) {
		// Enter Key press
		if(target.charCode === 13) {
			this.handleCheck();
		}
	}

	handleCheck() {
		let suffixRange = [];

		fetch(`https://api.pwnedpasswords.com/range/${this.state.rangeValue}`)
			.then(response => {
				// return text format from API
				return response.text()
			})
			.then(hashes => {
				// return text as array.
				// Should never expect empty according to API (which is slightly worrying they have that much data)
				let suffixArray = hashes.split('\r\n')

				// Loop over the array we can split the suffix & count apart
				suffixArray.forEach(suffix => {
					let [singleSuffix, count] = suffix.split(':')
					// Append to the range
					suffixRange.push({
						key: singleSuffix,
						count: count
					})
				})
				// Pass suffix range on
				return suffixRange

			}).then(suffixArray => {
				// Loop the array and compare the keys
				for(let index = 0; index < suffixArray.length; index++) {
					// compare given suffix to ones returned
					if(suffixArray[index].key === this.state.passwordSuffix) return suffixArray[index];
				}
				// if no result return null
				return false

			}).then(result => {
				// Display Message for user
				this.handleMessage(result)

			}).catch(error => {
				console.log('error', error)
			})
	}

	updatePasswordValue(e) {
		// SHA1 has the password ensure is uppercase
		let hash = SHA1(e.target.value).toString().toUpperCase()
		this.setState({
			passwordSuffix: hash.slice(5),
			rangeValue: hash.substring(0,5)
		})
	}

	handleMessage(result) {
		if(result === false) {
			this.setState({
				messageClass: 'is-success',
				messageTitle: `Good News`,
				messageSentance: `This password wasn't found in any of the reported data breaches. That doesn't necessarily mean it's a good password, merely that it's not been made public.`
			})
		} else {
			this.setState({
				messageClass: 'is-danger',
				messageTitle: `Time to Act, this password has been seen ${numberWithCommas(result.count)} times!`,
				messageSentance: `This password has appeared in a data breach and should never be used. If you have used it before, change it!`
			})
		}
	}

	handleExplain() {
		let { explainModal } = this.state
		explainModal = !explainModal
		this.setState({ explainModal })
	}

	render() {
		return <React.Fragment>
			<section className="section main-section">
				<div className="container">

					<div className="columns is-centered is-multiline">
						<div className="column is-three-quarters">
							<h1 className="title main-title has-text-centered">Check if your passwords have been leaked?</h1>
						</div>

						<div className="column is-half">
							<div className="columns is-gapless">
								<div className="column is-three-quarters">
									<input className="input is-radiusless" onKeyPress={this.handleKeyPress.bind(this)} onChange={this.updatePasswordValue.bind(this)} type="password" placeholder="Your Password" autoComplete="off" />
								</div>
								<div className="column is-one-quarter">
									<button onClick={this.handleCheck.bind(this)} type="button" className={['button','is-info','is-radiusless',(this.state.working)? 'is-loading' : ''].join(' ')} style={{ width: '100%' }}>Check Now</button>
								</div>
							</div>
						</div>

					</div>

					{/* Result */}
					<div className="columns is-centered">
						<div className="column is-half">
							<div className="content">
								<div className={['notification','has-text-centered', this.state.messageClass].join(' ')}>
									<h1 className="title has-text-weight-bold">{this.state.messageTitle}</h1>
									<p>{this.state.messageSentance}</p>
								</div>
							</div>
						</div>
					</div>

				</div>
			</section>

			<footer className="section base">
				<div className="container">
					<div className="columns">
						<div className="column"><a href="https://simonf.co.uk/" className="button is-text">By SimonF</a></div>
						<div className="column has-text-right has-text-left-mobile"><button className="button is-text" onClick={this.handleExplain.bind(this)}>Explain?</button></div>
					</div>
				</div>
			</footer>

			<div className={['modal', (this.state.explainModal)?'is-active':''].join(' ')}>
				<div className="modal-background"></div>
				<div className="modal-content">
				<div className="modal-text content">

					<h1 className="title">Password Checker</h1>

					<p>This application checks the database of leaked passwords at <a href="https://haveibeenpwned.com" target="_blank" rel="noopener noreferrer">Pwned Passwords</a></p>

					<p>Using a model called <a href="https://en.wikipedia.org/wiki/K-anonymity" target="_blank" rel="noopener noreferrer">k-anonymity</a> it is possible to check your password without looking at it or sending the data off your computer.</p>

					<Breaches />

				</div>

				</div>
				<button className="modal-close is-large" onClick={this.handleExplain.bind(this)} aria-label="close"></button>
			</div>
		</React.Fragment>
	}
}

export default App;