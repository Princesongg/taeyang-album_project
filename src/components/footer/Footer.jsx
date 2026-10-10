import './Footer.css';

export default function Footer() {
    return <footer className="album-footer">
        <p className="album-footer__title">TAE YANG</p>
        <p className="album-footer__label">THEBLACKLABEL Inc.</p>
        <div className="album-footer__information">
            <div><h2>COMPANY</h2><div className="album-footer__details">
                <p>CEO : 정경인</p>
                <p>Business Registration : No. 629-86-00391</p>
                <p>E-commerce Permit : 2024-서울용산-0882호</p>
                <p>Address : 서울 용산구 이태원로 214 더블랙레이블</p>
                <p>Personal Information Manager : 이창훈<br /> (tblshopcs@theblacklabel.com)</p>
            </div></div>
            <div className="album-footer__divider"><img src="/images/footer/divider.svg" alt="" /></div>
            <div><h2>CS</h2><div className="album-footer__details album-footer__details--cs">
                <p>CS Center : 1551-0391</p><p>Open : 10:00 ~ 17:00</p><p>Lunch : 12:00 ~ 13:00</p><p>Closed : Sat, Sun, Public Holidays</p>
            </div></div>
        </div>
    </footer>;
}
