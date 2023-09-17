import './createButton.module.css'

export default function Button() {
    return(
        <a href="https://www.google.com" className="btn">
            <i className="fa-solid fa-plus"></i> New Task
        </a>
    )
}