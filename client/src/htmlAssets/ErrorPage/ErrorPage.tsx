import { Link } from "react-router-dom";
import styles from "./ErrorPage.module.css";
import Icon from '../../assets/undraw_Page_not_found_re_e9o6.png'
import ErrorPagebtn from "./ErrorPagebtn";

type ErrorPageProps = {
    // You can add any props you need here
    // For example, you can pass a message prop to display the error message
    message: string;
};

const ErrorPage = (props: ErrorPageProps, ) => {
    // Destructure the message prop from the props object
    const { message } = props;

    return (
        <div className={styles.errorPage}>
            <div className={styles.errorContents}>
                <div className={styles.errorImage}>
                    <p className={styles.message}>{message}</p>
                    <img src={Icon} className={styles.icon} alt="Error" />
                </div>
                <div className="error-content">
                    <Link to="/" style={{ textDecoration: "none" }}>
                        <ErrorPagebtn />
                    </Link>
                </div>
            </div>
        </div>
    );
};

// Export the ErrorPage component as a default export
export default ErrorPage;