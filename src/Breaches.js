import React from 'react';

import { numberWithCommas, printDate } from './functions';

import './Breaches.css';

class Breaches extends React.Component {
	constructor(props, context) {
		super(props, context)

		this.state = {
			breaches: false
		}
	}

	componentDidMount() {
		fetch(`https://haveibeenpwned.com/api/v2/breaches`)
			.then(response => {
				return response.json()
			})
			.then(json => {
				this.setState({ breaches: json })
			})
			.catch(error => {
				console.log('Breach Error', error)
			})
	}

	render() {
		if(this.state.breaches === false) return null

		const content = () => {
			let html = '';
			// Loop breaches create html list
			this.state.breaches.forEach(breach => {
				html += (`<li class="breach-row"><span class="breach-title">${breach.Title} ${(breach.Domain !== "")? `<a class="breach-link" href="http://${breach.Domain}" target="_blank" rel="noopener noreferrer">[^]</a>` : ''}</span> • <span class="breach-date">On ${printDate(breach.BreachDate)}</span> • <span class="breach-count">Breach size ${numberWithCommas(breach.PwnCount)}</span></li>`)
			})

			return html
		}

		return <React.Fragment>
			<h2 className="subtitle">Recorded Data breaches</h2>
			<ul dangerouslySetInnerHTML={{__html: content()}}></ul>
		</React.Fragment>
	}
}

export default Breaches;