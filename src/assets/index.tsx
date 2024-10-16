import logoImg from "@/assets/img/logo/mainlogo.png";
// import mainImg from "@/assets/img/main-bg.png";

import playImg from "@/assets/img/play_bg.jpg";
import game1Img from "@/assets/img/mark/1.png";
import game2Img from "@/assets/img/mark/2.png";
import game3Img from "@/assets/img/mark/3.png";
import game4Img from "@/assets/img/mark/4.png";
import game5Img from "@/assets/img/mark/5.png";
import game6Img from "@/assets/img/mark/6.png";
import game7Img from "@/assets/img/mark/7.png";
import game8Img from "@/assets/img/mark/8.png";
import game9Img from "@/assets/img/mark/9.png";
import game10Img from "@/assets/img/mark/10.png";

export const source = {
    logo:logoImg,
    playBg: playImg,
    games:[ 
        game1Img, game2Img, game3Img,game4Img,game5Img,
        game6Img, game7Img, game8Img, game9Img, game10Img,
    ]
};

export const header = {
    container:{ backgroundColor: "black", paddingY: '10px',},
    logo: {justifyContent: {xs:'center', sm:'center', md:'left',}},
    titleContainer: { justifyContent: { xs: 'left', sm: 'center' }, color:'white'},
    title: { fontSize: {md: '32px',  lg: '40px', }},
    subtitle: {fontSize: { xs: '12px', sm: '20px', md: '24px',}},
}


export const footer = {
    container: {backgroundColor: 'black', paddingY:'20px'}
}
