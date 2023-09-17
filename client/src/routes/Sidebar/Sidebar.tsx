import './style.css'
import { faMoon } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function Sidebar() {

	// useEffect(() => {
	// 	const toggle = document.querySelector('#toggle');

	// 	modeSwitch.addEventListener('click', function () {
	// 		toggle!.checked = !toggle!.checked;
	// 	})

	// 	return () => {
	// 		modeSwitch.removeEventListener('click', function () {
	// 			toggle!.checked = !toggle!.checked;
	// 		})
	// 	}
	// }, [toggle])

	return (
		<li className="mode toggle-switch switch cursor">
			<input type="checkbox" id="toggle" />
			<div className="moon-sun">
				<FontAwesomeIcon icon={faMoon} className="fa-solid fa-moon icon moon" />
				{/* <FontAwesomeIcon icon={faSun} className="fa-solid fa-sun icon sun" /> */}
			</div>
			<span className="mode-text text">Dark Mode</span>
		</li>
	)
}

export default Sidebar