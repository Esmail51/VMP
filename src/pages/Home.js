import Img from "../assets/img/home-img.png"
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Home = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const handlechange = (event,value) => {
        event.preventDefault()
        if(value === 'sign_up') {
            navigate('register')
        }
        if( value === 'sign_in'){
        navigate('login')
        }
    }
    return (
        <div style={{padding:'40px'}}>
            <img src={Img} alt="" className="img-max"></img>
            <h2 style={{marginTop:'50px'}}>{t('welcome')}</h2>
            <p>{t('home_sub')}</p>
                <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'1rem', marginTop:'50px'}}>
                <button onClick={(e) => handlechange(e, 'sign_up')}>sign up</button>
                <button onClick={(e) => handlechange(e, 'sign_in')}>sign In</button></div>
                </div>
    )
}

export default Home